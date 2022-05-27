const request = require('request');
const User = require('../model/User');

// get location data from locationsAPI
const options = {
    url: 'http://localhost:9000/locationsAPI',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
    }
};

const notifyUsers = () => {

    locations = []
    new Promise(resolve => {

        request(options,
            function (err, res, body) {
                resolve(body)
            })
    }).then(async value => {

        let json = JSON.parse(value);
        for (let i = 0; i < json.length; i++) {
            locations.push(json[i].faultLocation)
        }

        for (let i = 0; i < locations.length; i++) {
            let foundUser = await User.findOne({ prefferedLocation: locations[i] }).exec();
            if (foundUser) {
                console.log(foundUser.username)
            }

        }
    })
}

module.exports = notifyUsers;