import {createClient} from 'redis';

export const redisClient = createClient();
export const redisPublisher = createClient();


redisPublisher.connect();

