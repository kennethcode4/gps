/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';

const { env } = process;

export default registerAs('mongo', () => ({
  protocol: env.MONGODB_PROTOCOL,
  user: env.MONGODB_USER,
  password: env.MONGODB_PASSWORD,
  host: env.MONGODB_HOST,
  port: parseInt(env.MONGODB_PORT) || null,
  database: env.MONGODB_DATABASE,
  params: env.MONGODB_PARAMS,
  uri: env.MONGODB_PROTOCOL + '://' + env.MONGODB_USER + ':' + env.MONGODB_PASSWORD + '@' + env.MONGODB_HOST + '/',
}));
