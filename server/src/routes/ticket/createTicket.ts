import {FastifyReply, FastifyRequest} from 'fastify';
import {ObjectId} from 'mongodb';

import Ticket from '../../models/Ticket.js';
import User from '../../models/User.js';

const createTicketHandler = async (
  req: FastifyRequest<{
    Body: {
      title: string;
    };
  }>,
  res: FastifyReply
) => {
  const {title} = req.body;

  const user = await User.findById(req.session.user);
  if (!user || user.deleted) {
    return res.status(401).send({
      msg: 'You are not authorized to access this endpoint',
      success: false,
    });
  }

  const ticket = new Ticket({
    title,
    userId: new ObjectId(req.session.user),
  });
  await ticket.save();

  return res.status(200).send({success: true, ticket});
};

export default createTicketHandler;
