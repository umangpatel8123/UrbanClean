import {FastifyReply, FastifyRequest} from 'fastify';
import {ObjectId} from 'mongodb';

import Ticket from '../../models/Ticket.js';
import TicketMessage from '../../models/TicketMessage.js';

const addTicketMessageHandler = async (
  req: FastifyRequest<{
    Body: {
      message: string;
    };
    Params: {
      ticketId: string;
    };
  }>,
  res: FastifyReply
) => {
  const {message} = req.body;
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

  const ticketMessage = new TicketMessage({
    message,
    ticketId: new ObjectId(ticketId),
    userId: new ObjectId(req.session.user),
  });
  await ticketMessage.save();

  await Ticket.updateOne(
    {_id: new ObjectId(ticketId)},
    {
      $set: {
        updatedAt: new Date(),
      },
    }
  );

  return res.status(200).send({success: true, ticketMessage});
};

export default addTicketMessageHandler;
