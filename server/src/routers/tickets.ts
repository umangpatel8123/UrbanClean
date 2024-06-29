import {FastifyPluginAsync} from 'fastify';

import isAuthenticated from '../middleware/isAuthenticated.js';
import isVerified from '../middleware/isVerified.js';
import addTicketMessageHandler from '../routes/ticket/addTicketMessage.js';
import closeTicketHandler from '../routes/ticket/closeTicket.js';
import createTicketHandler from '../routes/ticket/createTicket.js';
import getTicketListHandler from '../routes/ticket/getTicketList.js';
import getTicketMessageHandler from '../routes/ticket/getTicketMessage.js';

const ticketRouter: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Body: {
      title: string;
    };
  }>(
    '/',
    {
      preHandler: [isAuthenticated, isVerified],
      schema: {
        body: {
          title: {maxLength: 50, minLength: 1, type: 'string'},
        },
      },
    },
    createTicketHandler
  );

  fastify.get(
    '/',
    {
      preHandler: [isAuthenticated, isVerified],
    },
    getTicketListHandler
  );

  fastify.get<{
    Params: {
      ticketId: string;
    };
  }>(
    '/:ticketId',
    {
      preHandler: [isAuthenticated, isVerified],
      schema: {
        params: {
          ticketId: {type: 'string'},
        },
      },
    },
    getTicketMessageHandler
  );

  fastify.post<{
    Body: {
      message: string;
    };
    Params: {
      ticketId: string;
    };
  }>(
    '/:ticketId',
    {
      preHandler: [isAuthenticated, isVerified],
      schema: {
        body: {
          message: {maxLength: 500, minLength: 1, type: 'string'},
        },
        params: {
          ticketId: {type: 'string'},
        },
      },
    },
    addTicketMessageHandler
  );

  fastify.delete<{
    Params: {
      ticketId: string;
    };
  }>(
    '/:ticketId',
    {
      preHandler: [isAuthenticated, isVerified],
      schema: {
        params: {
          ticketId: {type: 'string'},
        },
      },
    },
    closeTicketHandler
  );
};

export default ticketRouter;
