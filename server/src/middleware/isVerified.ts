import {FastifyReply, FastifyRequest} from 'fastify';

import User from '../models/User.js';

const isVerified = async (req: FastifyRequest, res: FastifyReply) => {
  const user = await User.findById(req.session.user);
  if (!user || user.deleted) {
    return res.status(401).send({
      msg: 'You are not authorized to access this route',
      success: false,
    });
  }
  if (!user.verified) {
    return res.status(403).send({
      msg: 'You need verify your email first!',
      success: false,
    });
  }
};

export default isVerified;
