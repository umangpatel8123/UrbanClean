import {FastifyReply, FastifyRequest} from 'fastify';
import {ObjectId} from 'mongodb';

import Ticket from '../../models/Ticket.js';
import TicketMessage from '../../models/TicketMessage.js';

export const getTicketListHandler = async (
  _req: FastifyRequest,
  res: FastifyReply
) => {
  const tickets = await Ticket.findWithAllUser();
  return res.status(200).send({success: true, tickets});
};

export const getOpenTicketListHandler = async (
  _req: FastifyRequest,
  res: FastifyReply
) => {
  const tickets = await Ticket.findWithAllUser({closed: false});
  return res.status(200).send({success: true, tickets});
};

export const getClosedTicketListHandler = async (
  _req: FastifyRequest,
  res: FastifyReply
) => {
  const tickets = await Ticket.findWithAllUser({closed: true});
  return res.status(200).send({success: true, tickets});
};

export const getTicketMessageHandler = async (
  req: FastifyRequest<{
    Params: {
      ticketId: string;
    };
  }>,
  res: FastifyReply
) => {
  const {ticketId} = req.params;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).send({
      msg: 'Ticket not found',
      success: false,
    });
  }

  const messages = await TicketMessage.findByTicketId(ticketId);
  return res.status(200).send({messages, success: true});
};

export const replyTicketMessageHandler = async (
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
  if (!ticket) {
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

export const closeTicketHandler = async (
  req: FastifyRequest<{
    Params: {
      ticketId: string;
    };
  }>,
  res: FastifyReply
) => {
  const {ticketId} = req.params;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
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
