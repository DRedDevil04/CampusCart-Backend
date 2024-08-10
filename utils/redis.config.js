const redis = require('redis');

export const client = redis.createClient({ url: process.env.CACHE_URI });

if (process.env.NODE_ENV === "production") {
  client.on("error", (err) => console.log("Redis Client Error", err));
  client.on("connect", () =>
    console.log("Connected to Redis Successfully! ✨")
  );

  await client.connect();
}