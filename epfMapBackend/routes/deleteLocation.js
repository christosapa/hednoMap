const express = require('express');
const router = express.Router();
const deleteLocationController = require('../controllers/deleteLocationController');

router.post('/', deleteLocationController.deleteLocation);

module.exports = router;