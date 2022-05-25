const User = require('../model/User');

const saveLocation = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden 

    const myLocationMarker = req.body

    try {
        foundUser.prefferedLocation = `${myLocationMarker.lat},${myLocationMarker.lng}`
        res.status(201).json({ 'success': `Location ${myLocationMarker.lat},${myLocationMarker.lng} saved!` });
        const result = await foundUser.save();
        console.log(result);

    } catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { saveLocation };