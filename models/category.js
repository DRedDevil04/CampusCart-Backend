const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    __created: {
        type:Date,
        default: Date.now,
    },
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    icon:{
        type:String,
    },
    items:[
        {type:mongoose.Schema.Types.ObjectId, ref:"Item"}
    ],
},{timestamps:true});


const Category = mongoose.model("Category",CategorySchema);

module.exports = Category;