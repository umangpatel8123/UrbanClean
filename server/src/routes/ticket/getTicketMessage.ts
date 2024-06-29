import {FastifyReply, FastifyRequest} from 'fastify';

import Ticket from '../../models/Ticket.js';
import TicketMessage from '../../models/TicketMessage.js';

const getTicketMessageHandler = async (
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

  const messages = await TicketMessage.findByTicketId(ticketId);
  return res.status(200).send({messages, success: true});
};

export default getTicketMessageHandler;
