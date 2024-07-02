const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
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
    category:{
        type:mongoose.Schema.Types.ObjectId, ref:"Category"
    },
    price:{
        currency:{type:String, default:"INR"},
        amount:{type:Number, required:true},
        discount:{
            percentage:{type:Number, default:0},
            start:{type:Date},
            end:{type:Date},
        }
    },
    images:[{
        url:{type:String, required:true},
        altText:{type:String}
    }],
    available:{
        type:Boolean,
        default:true,
    },

},{timestamps:true});



const Item = mongoose.model("Item",ItemSchema);

module.exports = Item;