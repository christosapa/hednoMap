const request = require('request');
const User = require('../model/User');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport');

// get location data from locationsAPI
const options = {
    url: 'http://localhost:9000/locationsAPInoGC',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
    }
};

const notifyUsers = () => {

    // Send email (use verified sender's email address & generated API_KEY on SendGrid)
    const transporter = nodemailer.createTransport(
        sendgridTransport({
            auth: {
                api_key: process.env.SENDGRID_APIKEY,
            }
        })
    )

    locations = []

    new Promise(resolve => {

        request(options,
            function (err, res, body) {
                resolve(body)
            })

    }).then(async value => {

        let json = JSON.parse(value);
        for (let i = 0; i < json.length; i++) {
            locations.push(json[i])
        }
        for (let i = 0; i < locations.length; i++) {
            let foundUser = await User.findOne({ prefferedLocation: locations[i].faultLocation.trim() }).exec();
            if (foundUser) {
                transporter.sendMail({
                    from: 'xristosstbuilt@gmail.com',
                    to: foundUser.username,
                    subject: "HEDNOmap: Power outage alert!",
                    html: `<h2> Important information for your saved location.</h2>
                           Hello ${foundUser.username},
                           <p>A power outage is planned in municipality "${locations[i].faultLocation.trim()}" 
                           from ${locations[i].fromDateTime} to ${locations[i].toDateTime}.</p>
                           <p>Location details: ${locations[i].locationDetails}</p>`,
                }).catch(err => console.log(err));
            }
        }
    }).catch(function (err) {
        console.log(err);
    });
}

module.exports = notifyUsers;