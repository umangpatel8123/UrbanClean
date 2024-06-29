import {FastifyPluginAsync} from 'fastify';

import isAdmin from '../../middleware/isAdmin.js';
import isAuthenticated from '../../middleware/isAuthenticated.js';
import {
  closeTicketHandler,
  getClosedTicketListHandler,
  getOpenTicketListHandler,
  getTicketListHandler,
  getTicketMessageHandler,
  replyTicketMessageHandler,
} from '../../routes/admin/tickets.js';

const ticketAdminRouter: FastifyPluginAsync = async fastify => {
  fastify.get(
    '/',
    {
      preHandler: [isAuthenticated, isAdmin],
    },
    getTicketListHandler
  );

  fastify.get(
    '/open',
    {
      preHandler: [isAuthenticated, isAdmin],
    },
    getOpenTicketListHandler
  );

  fastify.get(
    '/closed',
    {
      preHandler: [isAuthenticated, isAdmin],
    },
    getClosedTicketListHandler
  );

  fastify.get<{
    Params: {
      ticketId: string;
    };
  }>(
    '/:ticketId',
    {
      preHandler: [isAuthenticated, isAdmin],
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
      preHandler: [isAuthenticated, isAdmin],
      schema: {
        body: {
          message: {maxLength: 500, minLength: 1, type: 'string'},
        },
        params: {
          ticketId: {type: 'string'},
        },
      },
    },
    replyTicketMessageHandler
  );

  fastify.delete<{
    Params: {
      ticketId: string;
    };
  }>(
    '/:ticketId',
    {
      preHandler: [isAuthenticated, isAdmin],
      schema: {
        body: {
          message: {maxLength: 500, minLength: 1, type: 'string'},
        },
        params: {
          ticketId: {type: 'string'},
        },
      },
    },
    closeTicketHandler
  );
};

export default ticketAdminRouter;
