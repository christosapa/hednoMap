const express = require('express');
const router = express.Router();
const showLocationsController = require('../controllers/showLocationsController');

router.get('/', showLocationsController.showLocations);

module.exports = router;