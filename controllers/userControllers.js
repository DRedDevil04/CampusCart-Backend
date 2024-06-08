const User = require('../models/user.models');
const {response_400, response_200} = require('../utils/responseCodes.utils')

exports.updateProfile = async (req, res) => {
    
    try{
        const {name, email, password, profilePicture} = req.body;

        if(!email){
            return response_400(res, "I require user email");
        }

        const userExists = await User.findOne({ email: email }).exec();
        if (!userExists) {
            return response_400(res, "This email doesn't exist");
        }

        let updateobj = {};

        if(name) updateobj.name = name;
        if(profilePicture) updateobj.profilePicture = profilePicture;
        if(password) updateobj.password = password;
          
        const updatedUser = await User.findByIdAndUpdate(userExists._id, updateobj, { new: true });
        return response_200(res, "data updated", {
            name: updatedUser.name,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
        });

    }
    catch(err){
        return response_400(res, err);
    }
}

exports.getProfile = async (req, res) => {
    
    try{
        const {email} = req.body;

        if(!email){
            return response_400(res, "I require user email");
        }

        const userExists = await User.findOne({ email: email }).exec();
        if (!userExists) {
            return response_400(res, "This email doesn't exist");
        }
          
        return response_200(res, "get Profile", {
            name: userExists.name,
            email: userExists.email,
            profilePicture: userExists.profilePicture,
        });

    }
    catch(err){
        return response_400(res, err);
    }
}