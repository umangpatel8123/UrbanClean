/// <reference types='node' />

import 'fastify';
import {ObjectId} from 'mongodb';

declare module 'fastify' {
  export interface Session {
    user: ObjectId;
  }
}
