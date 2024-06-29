import {Redis} from 'ioredis';

const redis = new Redis({
  connectTimeout: 500,
  host: process.env['REDIS_HOST'],
  maxRetriesPerRequest: 1,
  password: process.env['REDIS_PASSWORD'],
  port: parseInt(`${process.env['REDIS_PORT']}`, 10),
  username: process.env['REDIS_USERNAME'],
});

export default redis;
