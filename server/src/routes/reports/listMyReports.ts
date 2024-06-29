import {FastifyReply, FastifyRequest} from 'fastify';

import Report from '../../models/Report.js';
import User from '../../models/User.js';

const listMyReportsHandler = async (req: FastifyRequest, res: FastifyReply) => {
  const user = await User.findById(req.session.user);
  if (!user || user.deleted) {
    return res.status(401).send({
      msg: 'You are not authorized to access this resource',
      success: false,
    });
  }

  const reports = await Report.find({
    user: user._id,
  });

  return res.status(200).send({
    data: reports,
    success: true,
  });
};

export default listMyReportsHandler;
