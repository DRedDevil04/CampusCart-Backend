import mongoose from "mongoose";
import dotenv from "dotenv";
// import { createClient } from "redis";

// export const client = createClient({ url: process.env.CACHE_URI });

// if (process.env.NODE_ENV === "production") {
//   client.on("error", (err) => console.log("Redis Client Error", err));
//   client.on("connect", () =>
//     console.log("Connected to Redis Successfully! ✨")
//   );

//   await client.connect();
// }
dotenv.config({path:"./.env"});
const db_url = process.env.MONGO_URI;
console.log(db_url)
export const connectDB = async () => {
  await mongoose.connect(db_url, {
    useUnifiedTopology: true,
  });
  console.log("\nConnected to Database Successfully! ✨");
};
