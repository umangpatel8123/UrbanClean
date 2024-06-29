import {hash} from '@node-rs/argon2';
import {FastifyReply, FastifyRequest} from 'fastify';
import {cpus} from 'node:os';
import validator from 'validator';

import GarbageCollector from '../../models/GarbageCollector.js';
import User, {UserRole} from '../../models/User.js';
import {CollectorSignupBodyType} from '../../schemas/user.schema.js';

const signupHandler = async (
  req: FastifyRequest<{
    Body: CollectorSignupBodyType;
  }>,
  res: FastifyReply
) => {
  const {email, lat, long, name, password} = req.body;

  const failedChecks = [
    {
      check: !validator.isEmail(email),
      msg: 'Invalid email address',
    },
    {
      check: !validator.isStrongPassword(password),
      msg: 'Try a stronger Password',
    },
  ].filter(x => x.check);

  if (failedChecks.length) {
    return res.status(400).send({
      msg: failedChecks[0]?.msg,
      success: false,
    });
  }

  const normalizedEmail = validator.normalizeEmail(email);
  if (!validator.isEmail(`${normalizedEmail}`)) {
    return res.status(400).send({
      msg: 'Invalid email',
      success: false,
    });
  }
  const hashedPassword = await hash(password, {
    // use Argon2i
    algorithm: 1,
    parallelism: cpus().length,
  });

  const existingUser = await User.findByEmail(`${normalizedEmail}`);
  if (existingUser) {
    return res.status(200).send({
      msg: 'User with the Email exists',
      success: true,
    });
  }

  const collector = new GarbageCollector({
    lat: lat,
    long: long,
  });
  await collector.save();

  const user = new User({
    collector: collector._id,
    email: `${normalizedEmail}`,
    name: name.trim(),
    password: hashedPassword,
    role: UserRole.COLLECTOR,
  });
  await user.save();

  req.session.user = user._id;
  await req.session.save();

  return res.status(200).send({
    data: {
      collector,
      user,
    },
    success: true,
  });
};

export default signupHandler;
