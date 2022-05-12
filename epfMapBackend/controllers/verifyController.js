const User = require('../model/User');

const verifyUser = async (req, res) => {

    const foundUser = await User.findOne({ confirmationCode: req.params.confirmationCode }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 

    foundUser.status = "Active";
    const result = await foundUser.save();
}

module.exports = { verifyUser };