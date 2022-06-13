const User = require('../model/User');

const deleteLocation = async (req, res) => {
    console.log(req)

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden 

    foundUser.prefferedLocation = ''

    try {
        const result = await foundUser.save();
        res.status(201).json({ 'success': 'Location deleted!' });
        console.log(result);

    } catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { deleteLocation };