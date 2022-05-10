const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport');

const handleNewUser = async (req, res) => {

    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // JWT token for email confirmation
    const confirmationToken = jwt.sign(
        {
            "UserInfo": {
                "username": user,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec()
    if (duplicate) return res.sendStatus(409); // Conflict E409

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user to the JSON db
        const result = await User.create({
            "username": user,
            "password": hashedPwd,
            "confirmationCode": confirmationToken
        })

        // Send email (use verified sender's email address & generated API_KEY on SendGrid)
        const transporter = nodemailer.createTransport(
            sendgridTransport({
                auth: {
                    api_key: process.env.SENDGRID_APIKEY,
                }
            })
        )

        var mailOptions = {
            from: 'no-reply@example.com',
            to: user,
            subject: 'Account Verification Link',
            text: 'Hello ,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/\/confirmation\/' + user + '\/' + confirmationToken + '\n\nThank You!\n'
        };

        transporter.sendMail({
            from: 'xristosstbuilt@gmail.com',
            to: user,
            subject: "Welcome to HEDNOmap! Confirm Your Email",
            html: `<h2> You're on your way! Let's confirm your email address.</h2>
                   Hello ${user},
                   <p>Thank you for subscribing. Please confirm your email by clicking on the following link:</p>
                   <a href=http://localhost:3500/confirm/${confirmationToken}> Confirm Email Address</a>`,
        }).catch(err => console.log(err));

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };