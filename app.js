const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;
const URL = process.env.BASE_URL;

mongoose.connect(URL)
    .then(() => console.log('Connected to Database!'))
    .catch((err) => console.log("failed to connect to database ", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
app.use(cookieParser());


app.get('/', (req, res)=>{
    res.send("server is running");
})

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/user', userRoutes);

app.listen(PORT, ()=>{
    console.log("listening on port", PORT , "...");
})