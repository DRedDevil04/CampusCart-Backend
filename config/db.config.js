const mongoose = require("mongoose");
const { createClient } = require("redis");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const client = createClient({
  url: process.env.REDIS_URI, // replace with your Redis server URL
});

// Connect to Redis
client
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Redis connection error:", err);
  });

// Handling Redis errors
client.on("error", (err) => {
  console.error("Redis error:", err);
});

const db_url = process.env.MONGO_URI;
console.log(db_url);
const connectDB = async () => {
  await mongoose.connect(db_url, {
    useUnifiedTopology: true,
  });
  console.log("\nConnected to Database Successfully! ✨");
};

module.exports = {
  connectDB,
  client,
};
