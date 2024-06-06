import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
//import appRouter from "./routes/api.js";

dotenv.config({path:"./.env"});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes

//app.use("/api", appRouter);

const PORT = process.env.PORT || 6969; //8000 or 6969, 8000 default
app.listen(PORT, async () => {
    try {
        console.log(`Server started successfully on port ${PORT} ! 🚀`);
        console.log("Waiting for DB...");
        await connectDB();
    } catch (err) {
        console.log("Error while starting server: ", err);
    }
});
