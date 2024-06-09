const mongoose = require("mongoose");

function ConnectMongoDB(url){
    return mongoose.connect(url);
}

module.exports = {ConnectMongoDB};