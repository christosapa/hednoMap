const User = require('../model/User');

const showLocations = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden 

    const locations = foundUser.prefferedLocation

    try {
        res.json({ locations })

    } catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { showLocations };