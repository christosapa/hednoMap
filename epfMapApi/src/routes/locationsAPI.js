var express = require('express');
var router = express.Router();
const webScraper = require('../lib/webScraper');
const schedule = require('node-schedule');

run2functions = async () => {
    await webScraper.findNumOfPages();
    await webScraper.findCoordsOfOutages();
};

const job = schedule.scheduleJob('0 21 * * *', function(){
    run2functions();
  });

// send coords
router.get('/', function (req, res, next) {
    res.send(JSON.stringify(coordsArray));
});

module.exports = router;