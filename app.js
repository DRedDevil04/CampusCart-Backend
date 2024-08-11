const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { ConnectMongoDB } = require("./connection");

//Routers
const ItemRouter = require("./routes/item");
const CategoryRouter = require("./routes/category");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const orderRoutes = require("./routes/order");
const kitRoutes = require("./routes/kit.routes");

const app = express();
dotenv.config();

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    // origin: "https://takeiteasy-iiita.vercel.app", //TODO: change it back
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

//Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running at Port:", PORT));

//MongoDB connection
ConnectMongoDB(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.log(err));

//Test Api
app.get("/", (req, res) => {
  return res.send("Server is Running");
});

//Handling Items and Categories
app.use("/item", ItemRouter);
app.use("/category", CategoryRouter);
app.use("/kits", kitRoutes);

//Handling User
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

//Handling Orders
app.use("/order", orderRoutes);
