// redisClient.ts
import { createClient, RedisClientType } from 'redis';

class MemoryCache {
  private cache = new Map<string, string>();

  get(key: string): string | null {
    return this.cache.get(key) || null;
  }

  set(key: string, value: string, ttl: number = 0): void {
    this.cache.set(key, value);
    if (ttl > 0) {
      setTimeout(() => this.cache.delete(key), ttl * 1000);
    }
  }
}

/*
const redisClient: RedisClientType = createClient({
  url: 'redis://localhost:6380'
});
*/


const redisClient: RedisClientType = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
      host: process.env.REDIS_HOST,
      port: 14911
  }
});

const memoryCache = new MemoryCache();

let isRedisConnected = false;

redisClient.on('connect', () => {
  console.log('Connected to Redis.');
  isRedisConnected = true;
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
  isRedisConnected = false; // Mise à jour de l'état de connexion
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

const cache = {
  async get(key: string): Promise<string | null> {
    try {
      // Corrected usage here
      if (isRedisConnected) {
        const value = await redisClient.get(key);
        if (value) return value;
      }
    } catch (err) {
      console.warn('Redis get error, using memory cache as fallback.', err);
    }
    return memoryCache.get(key);
  },
  async set(key: string, value: string, ttl: number = 60): Promise<void> {
    try {
      // Corrected usage here
      if (isRedisConnected) {
        await redisClient.set(key, value, { EX: ttl });
        return;
      }
    } catch (err) {
      console.warn('Redis set error, using memory cache as fallback.', err);
    }
    memoryCache.set(key, value, ttl);
  }
};

// Fonction générique pour récupérer et mettre en cache des données
export async function fetchCachedData<T>(cacheKey: string, fetchFunction: () => Promise<T>, cacheTTL = 3600): Promise<T> {
  const cachedData = await cache.get(cacheKey);
  if (cachedData) return JSON.parse(cachedData);
  
  const data = await fetchFunction();
  await cache.set(cacheKey, JSON.stringify(data), cacheTTL);
  return data;
}

export default cache;
