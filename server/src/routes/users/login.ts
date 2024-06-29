import {verify} from '@node-rs/argon2';
import {FastifyReply, FastifyRequest} from 'fastify';
import {cpus} from 'node:os';
import validator from 'validator';

import User from '../../models/User.js';
import {GenericResponseBodyType} from '../../schemas/generics.schema.js';
import {
  UserLoginBodyType,
  UserResponseBodyType,
} from '../../schemas/user.schema.js';

const loginHandler = async (
  req: FastifyRequest<{
    Body: UserLoginBodyType;
    Reply: GenericResponseBodyType | UserResponseBodyType;
  }>,
  res: FastifyReply
) => {
  const {email, password} = req.body;
  if (!email) {
    return res.status(400).send({
      msg: 'Invalid email address',
      success: false,
    });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).send({
      msg: 'Invalid email address',
      success: false,
    });
  }
  const normalizedEmail = validator.normalizeEmail(email);
  const user = await User.findByEmail(`${normalizedEmail}`);
  if (!user) {
    return res.status(404).send({
      msg: 'User not found',
      success: false,
    });
  }
  if (user.deleted) {
    return res.status(403).send({
      msg: 'You are not authorized to access this endpoint',
      success: false,
    });
  }

  const checkPassword = await verify(user.password, password, {
    // use Argon2i
    algorithm: 1,
    parallelism: cpus().length,
  });
  if (!checkPassword) {
    return res.status(401).send({
      msg: 'Invalid Credentials',
      success: false,
    });
  }
  req.session.user = user._id;
  await req.session.save();

  return res.status(200).send({
    data: {...user, password: undefined},
    msg: 'Logged in Successfully',
    success: true,
  });
};

export default loginHandler;
