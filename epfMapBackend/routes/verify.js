const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verifyController.js');

router.get('/:confirmationCode', verifyController.verifyUser);

module.exports = router;