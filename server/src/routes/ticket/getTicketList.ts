import {FastifyReply, FastifyRequest} from 'fastify';
import {ObjectId} from 'mongodb';

import Ticket from '../../models/Ticket.js';

const getTicketListHandler = async (req: FastifyRequest, res: FastifyReply) => {
  const tickets = await Ticket.find({userId: new ObjectId(req.session.user)});
  return res.status(200).send({success: true, tickets});
};

export default getTicketListHandler;
