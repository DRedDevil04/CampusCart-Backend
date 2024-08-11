const mongoose = require("mongoose");

const KitSchema = new mongoose.Schema({
    name:{
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


const Kit = mongoose.model("Kits",KitSchema);

module.exports = Kit;