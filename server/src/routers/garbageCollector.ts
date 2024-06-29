import {FastifyPluginAsync} from 'fastify';

import isAuthenticated from '../middleware/isAuthenticated.js';
import {GarbageCollectorStatus} from '../models/GarbageCollector.js';
import meHandler from '../routes/garbageCollector/me.js';
import signupHandler from '../routes/garbageCollector/signup.js';
import toggleStatusHandler from '../routes/garbageCollector/toggleStatus.js';
import {GenericResponseBodyType} from '../schemas/generics.schema.js';
import {
  CollectorSignupBodyType,
  UserDataType,
  UserDataWithCollectorType,
} from '../schemas/user.schema.js';

const garbageCollectorRouter: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Body: CollectorSignupBodyType;
    Reply: GenericResponseBodyType | UserDataType | UserDataWithCollectorType;
  }>('/signup', signupHandler);

  fastify.get(
    '/me',
    {
      preHandler: [isAuthenticated],
    },
    meHandler
  );

  fastify.post<{
    Body: {
      status: GarbageCollectorStatus;
    };
  }>(
    '/status',
    {
      preHandler: [isAuthenticated],
    },
    toggleStatusHandler
  );
};

export default garbageCollectorRouter;
