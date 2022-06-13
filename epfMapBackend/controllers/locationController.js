const User = require('../model/User');
const opencage = require('opencage-api-client');
var greekUtils = require('greek-utils');

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
                if (data.results.length > 0) {
                    const place = data.results[0];
                    foundUser.prefferedLocation = greekUtils.sanitizeDiacritics(place.components.municipality).toUpperCase()
                    const result = await foundUser.save();
                    res.status(201).json({ 'success': 'Location "' + place.components.municipality + '" saved!' });
                    console.log(result);
                } else {
                    console.log('status', data.status.message);
                    console.log('total_results', data.total_results);
                }
            })
            .catch((error) => {
                res.status(500).json({ 'message': error.message });
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