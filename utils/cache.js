const client = require("./redis.config");

export async function getCache(key) {
    if (process.env.NODE_ENV === "production") {
      return await client.get(key);
    }
    return null;
  }
  
  export async function setCache(key, value) {
    if (process.env.NODE_ENV === "production") {
      return await client.set(key, value, { EX: CACHE_TTL });
    }
    return null;
  }