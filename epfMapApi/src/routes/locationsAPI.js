var express = require('express');
var router = express.Router();
const webScraper = require('../lib/webScraper');

run2functions = async () => {
    await webScraper.findNumOfPages();
    await webScraper.findCoordsOfOutages();
};

run2functions();

// send coords
router.get('/', function (req, res, next) {
    res.send(JSON.stringify(coordsArray));
});

module.exports = router;