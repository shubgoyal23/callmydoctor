// lib/redis.ts
import { createClient } from "redis";

const globalForRedis = globalThis as unknown as {
  redisClient?: ReturnType<typeof createClient>;
};

export const getRedisClient = async () => {
  if (!globalForRedis.redisClient) {
    const client = createClient({
      url: `redis://default:${process.env.REDIS_PWD}@${process.env.REDIS_HOST}`,
    });

    client.on("error", (err: Error) => {
      console.error("Redis Client Error", err);
    });

    await client.connect();
    globalForRedis.redisClient = client;
  }

  return globalForRedis.redisClient!;
};
