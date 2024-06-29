import {FastifyReply, FastifyRequest} from 'fastify';

import GarbageCollector, {
  GarbageCollectorStatus,
} from '../../models/GarbageCollector.js';
import User, {UserRole} from '../../models/User.js';

const toggleStatusHandler = async (
  req: FastifyRequest<{
    Body: {
      status: GarbageCollectorStatus;
    };
  }>,
  res: FastifyReply
) => {
  const {status} = req.body;
  if (!Object.values(GarbageCollectorStatus).includes(status)) {
    return res.status(400).send({
      msg: 'Invalid status',
      success: false,
    });
  }

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

  const collector = await GarbageCollector.updateById(user.collector, {
    $set: {
      status: status as GarbageCollectorStatus,
    },
  });

  return res.status(200).send({
    msg: collector,
    success: true,
  });
};

export default toggleStatusHandler;
