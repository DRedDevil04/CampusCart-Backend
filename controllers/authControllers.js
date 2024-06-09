const User = require('../models/user.models');
const zod = require('zod');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {response_400, response_200} = require('../utils/responseCodes.utils')

function validate(name, email, password, res){
    const emailSchema = zod.string().email();
    const passwordSchema = zod.string().min(8);
    if(!name || !email || !password){
        response_400(res, "All Fields are required");
        return false;
    }
    else if(!(emailSchema.safeParse(email).success)){
        response_400(res, "Not a valid Email");
        return false;
    }
    else if(!(passwordSchema.safeParse(password).success)){
        response_400(res, "Password must be 8 characters long");
        return false;
    }
    return true;
}

exports.generateToken = async function(res, user){
    try{
        const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
                expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
        });
        return token;
    }
    catch(err){
        console.log(err);
        return "";
    }
}

exports.signup = async (req, res) => {
    try {
        const { name, email, password, profilePicture } = req.body;

        if (validate(name, email, password, res)) {
            const emailExists = await User.findOne({ email: email }).exec();
            if (emailExists) {
                return response_400(res, "email is already in use");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            let new_user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                profilePicture: profilePicture || "",
                role: "user"
            });

            const savedUser = await new_user.save();
            const token = await exports.generateToken(res, savedUser);

            return response_200(res, "registered successfully!", {
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                token: token
            });
        }
    } catch (err) {
        return response_400(res, err);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (validate("something", email, password, res)) {
            const userExists = await User.findOne({ email: email }).exec();
            
            if (userExists) {
                const checkPassword = await bcrypt.compare(password, userExists.password);
                if (checkPassword) {
                    const token = await exports.generateToken(res, userExists);
                    return response_200(res, "logged in successfully!", {
                        name: userExists.name,
                        email: userExists.email,
                        role: userExists.role,
                        token: token
                    });
                } else {
                    return response_400(res, "Wrong Password");
                }
            } else {
                return response_400(res, "didn't find this email");
            }
        }
    } catch (err) {
        return response_400(res, err.message);
    }
};

exports.logout = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(validate("something", email, password, res)){
            const userExists = await User.findOne({ email: email}).exec();
            if (userExists) {
                const checkPassword = bcrypt.compare(password, userExists.password);
                if(checkPassword){
                    res.clearCookie("token");
                    return response_200(res, "logged out successfully!", {});
                }
                return response_400(res, "Wrong Password");
            }
            return response_400(res, "didn't find this email");
        }

    }
    catch(err){
        return response_400(res, err);
    }
}
