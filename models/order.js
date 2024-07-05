const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    __created: {
        type:Date,
        default: Date.now,
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId, ref:"users",
        required:true
    },
    items:[{
        item: {type:mongoose.Schema.Types.ObjectId, ref:"Item", required:true},
        quantity:{
            type:Number,
            requred:true,
        },
        price:{type:Number, required:true}
    }],
    payment:{
        payment_method:{
            type:String,
            default:"COD"
        },
        amount:{
            type:Number,
            required:true,
        },
        currency:{
            type:String,
            default:"INR"
        },
        status:{
            type: String,
            enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Cancelled'],
            default: 'Pending'
        },
        transactionDate:{
            type:Date,
            default:Date.now()
        }
    },
    shipping:{
        address:{
            room:{type:String, required:true},
            floor:{type:String, required:true},
            hostel:{type:String, required:true},
            contact_number:{type:String, required:true},
        },
        estimated_delivery_date:{
            type:String,
        },
    },
    order_status:{
        type: String,
        enum: ['Confirmation Awaited', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Confirmation Awaited'
    },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;