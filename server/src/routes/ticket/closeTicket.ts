import {FastifyReply, FastifyRequest} from 'fastify';
import {ObjectId} from 'mongodb';

import Ticket from '../../models/Ticket.js';

const closeTicketHandler = async (
  req: FastifyRequest<{
    Params: {
      ticketId: string;
    };
  }>,
  res: FastifyReply
) => {
  const {ticketId} = req.params;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket || ticket.userId.toString() !== req.session.user.toString()) {
    return res.status(404).send({
      msg: 'Ticket not found',
      success: false,
    });
  }
  if (ticket.closed) {
    return res.status(400).send({
      msg: 'Ticket is already closed',
      success: false,
    });
  }

  await Ticket.updateOne(
    {_id: new ObjectId(ticketId)},
    {
      $set: {
        closed: true,
        updatedAt: new Date(),
      },
    }
  );

  return res
    .status(200)
    .send({msg: 'Ticket closed successfully', success: true});
};

export default closeTicketHandler;
