import {FastifyReply, FastifyRequest} from 'fastify';

import sendMail from '../../lib/mailClient.js';
import User from '../../models/User.js';
import VerificationCode from '../../models/VerificationCode.js';

const forgotPasswordHandler = async (
  req: FastifyRequest<{
    Body: {
      email: string;
    };
  }>,
  res: FastifyReply
) => {
  const {email} = req.body;
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(400).send({msg: 'User not found', success: false});
  }
  const verificationCode = new VerificationCode({
    user: user._id,
  });
  await verificationCode.save();

  const url = new URL(
    `http://localhost:5173/reset-password/${verificationCode.code}`
  );
  console.log({url: url.href});

  try {
    await sendMail(
      'Reset Password',
      `Please click on the link to reset your password: ${url.href}`,
      user.email
    );
    return res.status(200).send({msg: 'Email sent', success: true});
  } catch (err) {
    console.log({err});
    return res.status(500).send({msg: 'Failed to send email', success: false});
  }
};

export default forgotPasswordHandler;
