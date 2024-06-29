import {Static, Type} from '@sinclair/typebox';

export const EnvSchema = Type.Object({
  COOKIE_SECRET: Type.String({minLength: 128}),
  CORS_ORIGIN_URI: Type.String({default: 'localhost'}),
  ETHEREAL_EMAIL_PASS: Type.String(),
  ETHEREAL_EMAIL_USER: Type.String(),
  MONGO_URI: Type.String(),
  NODE_ENV: Type.String({default: 'development'}),
  REDIS_HOST: Type.String({default: 'localhost'}),
  REDIS_PASSWORD: Type.String(),
  REDIS_PORT: Type.Number({default: 6379}),
  REDIS_USERNAME: Type.String(),
});

export type EnvSchemaType = Static<typeof EnvSchema>;
