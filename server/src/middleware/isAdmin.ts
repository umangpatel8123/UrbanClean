import {FastifyReply, FastifyRequest} from 'fastify';

import User, {UserRole} from '../models/User.js';

const isAdmin = async (req: FastifyRequest, res: FastifyReply) => {
  const user = await User.findById(req.session.user);
  if (!user || user.deleted) {
    return res.status(401).send({
      msg: 'You are not authorized to access this route',
      success: false,
    });
  }
  if (user.role !== UserRole.ADMIN) {
    return res.status(403).send({
      msg: 'You are not authorized to access this route',
      success: false,
    });
  }
};

export default isAdmin;
