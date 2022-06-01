const User = require('../model/User');
const opencage = require('opencage-api-client');

const saveLocation = async (req, res) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden 

    const myLocationMarker = req.body

    try {
        opencage
            .geocode({ q: `${myLocationMarker.lat}, ${myLocationMarker.lng}`, language: 'el' })
            .then(async (data) => {
                // console.log(JSON.stringify(data));
                if (data.results.length > 0) {
                    const place = data.results[0];
                    foundUser.prefferedLocation = place.components.municipality
                    res.status(201).json({ 'success': `Location ${myLocationMarker.lat},${myLocationMarker.lng} saved!` });
                    const result = await foundUser.save();
                    console.log(result);
                } else {
                    console.log('status', data.status.message);
                    console.log('total_results', data.total_results);
                }
            })
            .catch((error) => {
                console.log('error', error.message);
                if (error.status.code === 402) {
                    console.log('hit free trial daily limit');
                    console.log('become a customer: https://opencagedata.com/pricing');
                }
            });

    } catch (err) {
        console.log(err)
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { saveLocation };