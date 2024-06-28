const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    __created: {
        type:Date,
        default: Date.now,
    },
    name:{
        type: String,
        required: [true, "Name is required"],
    },
    email:{
        type: String,
        required:[true, "Email is required"],
        unique: [true, "Email already Exists"],
        validate: {
            validator: function(v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: (email) => `${email.value} is not a valid email address!`,
        },
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be atleast 8 characters"],
    },
    profilePicture:{
        type: String,
    },
    address: {
        room: { type: String, default: "" },
        floor: { type: String, default: "" },
        hostel: { type: String, default: "" },
        contact_number: { type: String, default: "" },
    },
    orders:[{
        type:mongoose.Schema.Types.ObjectId, ref:"Order"
    }],
    verified: {
        type: Boolean,
        default: false
    },
    role:{
        type:String,
        default:"user"
    },

    verificationId: String,
});

module.exports = mongoose.model("users", userSchema);