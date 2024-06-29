import {FastifyReply, FastifyRequest} from 'fastify';

import GarbageCollector from '../../models/GarbageCollector.js';
import User, {UserRole} from '../../models/User.js';

const meHandler = async (req: FastifyRequest, res: FastifyReply) => {
  const user = await User.findById(req.session.user);
  if (
    !user ||
    user.deleted ||
    user.role !== UserRole.COLLECTOR ||
    !user.collector
  ) {
    return res.status(404).send({
      msg: 'User not found',
      success: false,
    });
  }
  const collector = await GarbageCollector.findById(user.collector);
  if (!collector) {
    return res.status(404).send({
      msg: 'Collector not found',
      success: false,
    });
  }

  return res.status(200).send({
    data: {
      collector,
      user,
    },
    success: true,
  });
};

export default meHandler;
