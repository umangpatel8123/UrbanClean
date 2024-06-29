import {FastifyPluginAsync} from 'fastify';

import isAuthenticated from '../middleware/isAuthenticated.js';
import forgotPasswordHandler from '../routes/users/forgotPassword.js';
import loginHandler from '../routes/users/login.js';
import logoutHandler from '../routes/users/logout.js';
import meHandler from '../routes/users/me.js';
import sendVerificationEmailHandler from '../routes/users/sendVerificationEmail.js';
import signupHandler from '../routes/users/signup.js';
import verifyUserHandler from '../routes/users/verify.js';
import {
  GenericResponseBody,
  GenericResponseBodyType,
} from '../schemas/generics.schema.js';
import {
  UserBasicInfoResponseBody,
  UserLoginBody,
  UserLoginBodyType,
  UserResponseBody,
  UserResponseBodyType,
  UserSignupBody,
  UserSignupBodyType,
  UserVerifyBody,
  UserVerifyBodyType,
  UserVerifyParams,
  UserVerifyParamsType,
} from '../schemas/user.schema.js';

const userRouter: FastifyPluginAsync = async fastify => {
  fastify.post<{
    Body: UserSignupBodyType;
    Reply: GenericResponseBodyType | UserResponseBodyType;
  }>(
    '/signup',
    {
      config: {
        rateLimit: {
          errorResponseBuilder(_req, context) {
            return {
              msg: `You have exceeded the rate limit, please try again in ${context.after}. Subsequent requests will result in a permanent ip ban.`,
              statusCode: 429,
              success: false,
            };
          },
          keyGenerator(req) {
            return req.ip;
          },
          max: 25,
          onExceeded(req, key) {
            req.log.warn(`Rate limit exceeded for ${key}`);
          },
          onExceeding(req, key) {
            req.log.warn(`Rate limit exceeding for ${key}`);
          },
          timeWindow: '1m',
        },
      },
      schema: {
        body: UserSignupBody,
        response: {
          200: UserResponseBody,
          400: GenericResponseBody,
        },
      },
    },
    signupHandler
  );

  fastify.post<{
    Body: UserLoginBodyType;
    Reply: GenericResponseBodyType | UserResponseBodyType;
  }>(
    '/login',
    {
      schema: {
        body: UserLoginBody,
        response: {
          200: UserResponseBody,
          400: GenericResponseBody,
        },
      },
    },
    loginHandler
  );

  fastify.get<{
    Querystring: {
      full: boolean;
    };
    Reply: GenericResponseBodyType | UserResponseBodyType;
  }>(
    '/me',
    {
      preHandler: [isAuthenticated],
      schema: {
        response: {
          200: UserBasicInfoResponseBody,
          400: GenericResponseBody,
        },
      },
    },
    meHandler
  );

  fastify.get<{
    Querystring: {
      full: boolean;
    };
    Reply: GenericResponseBodyType | UserResponseBodyType;
  }>(
    '/me/full',
    {
      preHandler: [isAuthenticated],
      schema: {
        response: {
          200: UserResponseBody,
          400: GenericResponseBody,
        },
      },
    },
    meHandler
  );

  fastify.get(
    '/send-verify-email',
    {
      preHandler: [isAuthenticated],
    },
    sendVerificationEmailHandler
  );

  fastify.post<{
    Body: {
      email: string;
    };
  }>('/send-verify-email', forgotPasswordHandler);

  fastify.post<{
    Body: UserVerifyBodyType;
    Params: UserVerifyParamsType;
    Reply: GenericResponseBodyType;
  }>(
    '/verify/:code',
    {
      schema: {
        body: {
          UserVerifyBody,
        },
        params: {
          UserVerifyParams,
        },
        response: {
          200: GenericResponseBody,
          400: GenericResponseBody,
          403: GenericResponseBody,
        },
      },
    },
    verifyUserHandler
  );

  fastify.post<{
    Reply: GenericResponseBodyType;
  }>(
    '/logout',
    {
      preHandler: [isAuthenticated],
      schema: {
        response: {
          200: GenericResponseBody,
        },
      },
    },
    logoutHandler
  );
};

export default userRouter;
