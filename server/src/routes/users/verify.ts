import {hash} from '@node-rs/argon2';
import {FastifyReply, FastifyRequest} from 'fastify';
import {cpus} from 'os';
import validator from 'validator';

import User from '../../models/User.js';
import VerificationCode from '../../models/VerificationCode.js';
import {GenericResponseBodyType} from '../../schemas/generics.schema.js';
import {
  UserVerifyBodyType,
  UserVerifyParamsType,
} from '../../schemas/user.schema.js';

const verifyUserHandler = async (
  req: FastifyRequest<{
    Body: UserVerifyBodyType;
    Params: UserVerifyParamsType;
    Reply: GenericResponseBodyType;
  }>,
  res: FastifyReply
) => {
  const {code} = req.params;
  const {password} = req.body;

  if (!validator.isUUID(`${code}`)) {
    return res.status(400).send({
      msg: 'Invalid verification code',
      success: false,
    });
  }
  const verificationCode = await VerificationCode.findByCode(code);
  if (
    !verificationCode ||
    verificationCode.deleted ||
    verificationCode.used ||
    verificationCode.expiresAt < new Date()
  ) {
    return res.status(400).send({
      msg: 'Invalid verification code',
      success: false,
    });
  }
  const user = await User.findById(verificationCode.user);
  if (!user || user.deleted) {
    return res.status(403).send({
      msg: 'You are not authorized to access this endpoint',
      success: false,
    });
  }
  await VerificationCode.updateOne(
    {
      _id: verificationCode._id,
    },
    {
      $set: {
        updatedAt: new Date(),
        used: true,
        usedAt: new Date(),
      },
    }
  );

  const hashedPassword = await hash(password, {
    // use Argon2i
    algorithm: 1,
    parallelism: cpus().length,
  });
  await User.updateOne(
    {
      _id: user._id,
    },
    {
      $set: {
        password: hashedPassword,
        updatedAt: new Date(),
        verified: true,
      },
    }
  );

  req.session.user = user._id;
  await req.session.save();

  return res.status(200).send({
    msg: 'Password updated and user verified successfully',
    success: true,
  });
};

export default verifyUserHandler;
