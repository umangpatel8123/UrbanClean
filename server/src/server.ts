import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySession from '@fastify/session';
import {TypeBoxTypeProvider} from '@fastify/type-provider-typebox';
import MongoStore from 'connect-mongo';
// eslint-disable-next-line import/extensions
import 'dotenv/config';
import fastify from 'fastify';

import logger from './lib/logger.js';
import getMongoClient from './lib/mongoClient.js';
import redis from './lib/redisClient.js';
import garbageCollectorRouter from './routers/garbageCollector.js';
import reportsRouter from './routers/reports.js';
import userRouter from './routers/users.js';
import {EnvSchema} from './schemas/env.schema.js';

const isProd = process.env['NODE_ENV'] === 'production';

const app = fastify({
  logger: logger,
  trustProxy: isProd,
}).withTypeProvider<TypeBoxTypeProvider>();

await app.register(fastifyEnv, {
  schema: EnvSchema,
});

await app.register(fastifyCookie, {});
app.register(fastifyRateLimit, {
  allowList: [],
  errorResponseBuilder: (_request, context) => {
    return {
      msg: `Rate limit exceeded, retry in ${context.after} seconds`,
      success: false,
    };
  },
  global: false,
  keyGenerator: request => {
    return request.session.user?.toString() ?? request.ip;
  },
  max: 100,
  redis,
  timeWindow: 1000,
});

//@ts-expect-error MongoStore creates a MongoStoreClient which is not type compatible with fastify typings
await app.register(fastifySession, {
  cookie: {
    httpOnly: isProd,
    maxAge: 604800000,
    sameSite: 'lax',
    secure: isProd,
  },
  cookieName: 'URBAN_CLEAN_SESSION',
  loggerLevel: 'info',
  rolling: true,
  saveUninitialized: false,
  secret: process.env['COOKIE_SECRET'],
  store: MongoStore.create({
    autoRemove: 'interval',
    autoRemoveInterval: 10,
    client: getMongoClient(),
    serialize: session => {
      const {cookie, user} = session;
      return {cookie, user};
    },
  }),
});

await app.register(fastifyCors, {
  credentials: true,
  origin: isProd ? process.env['CORS_ORIGIN_URI']?.split(',') : true,
});

await app.register(userRouter, {prefix: '/api/users'});
await app.register(garbageCollectorRouter, {prefix: '/api/collectors'});
await app.register(reportsRouter, {prefix: '/api/reports'});

try {
  await app.listen({port: 3001});
} catch (err) {
  app.log.error(err);
  throw err;
}
