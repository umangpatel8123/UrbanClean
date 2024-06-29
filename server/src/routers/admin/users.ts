import {FastifyPluginAsync} from 'fastify';

import isAdmin from '../../middleware/isAdmin.js';
import isAuthenticated from '../../middleware/isAuthenticated.js';
import {
  allUsersHandler,
  deleteUserHandler,
  singleUserHandler,
  // editUserHandler,
} from '../../routes/admin/users.js';

const usersAdminRouter: FastifyPluginAsync = async fastify => {
  fastify.get(
    '/',
    {
      preHandler: [isAuthenticated, isAdmin],
    },
    allUsersHandler
  );

  fastify.get<{
    Params: {id: string};
  }>(
    '/:id',
    {
      preHandler: [isAuthenticated, isAdmin],
    },
    singleUserHandler
  );

  fastify.delete<{
    Params: {id: string};
  }>(
    '/:id',
    {
      preHandler: [isAuthenticated, isAdmin],
    },
    deleteUserHandler
  );
};

export default usersAdminRouter;
