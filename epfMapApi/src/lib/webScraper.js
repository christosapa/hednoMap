require('dotenv').config()
const axios = require('axios');
const cheerio = require('cheerio');
const colors = require('colors');
var _ = require('underscore');
const NodeGeocoder = require('node-geocoder');
const helper = require('../lib/helpers');

/* numbers of cities according to hedno site */
/* value='9' > ΑΡΤΑΣ value='10'> ΑΤΤΙΚΗΣ value='11' > ΑΧΑΙΑΣ value='12' > ΒΟΙΩΤΙΑΣ value='13' > ΓΡΕΒΕΝΩΝ value='14' > ΔΡΑΜΑΣ value='15' > ΔΩΔΕΚΑΝΗΣΟΥ
   value='6' > ΕΒΡΟΥ value='16' > ΕΥΒΟΙΑΣ value='17' > ΕΥΡΥΤΑΝΙΑΣ value='18' > ΖΑΚΥΝΘΟΥ value='19' > ΗΛΕΙΑΣ value='20' > ΗΜΑΘΙΑΣ value='21' > ΗΡΑΚΛΕΙΟΥ
   value='96' > ΘΕΣΠΡΩΤΙΑ value='23' > ΘΕΣΣΑΛΟΝΙΚΗΣ value='24' > ΙΩΑΝΝΙΝΩΝ value='25' > ΚΑΒΑΛΑΣ value='26' > ΚΑΡΔΙΤΣΑΣ value='27' > ΚΑΣΤΟΡΙΑΣ value='28' > ΚΕΡΚΥΡΑΣ
   value='29' > ΚΕΦΑΛΛΟΝΙΑ value='30' > ΚΙΛΚΙΣ value='31' > ΚΟΖΑΝΗΣ value='62' > ΚΟΡΙΝΘΙΑΣ value='33' > ΚΥΚΛΑΔΩΝ value='34' > ΛΑΚΩΝΙΑΣ value='35' > ΛΑΡΙΣΑΣ
   value='36' > ΛΑΣIΘΙΟΥ value='37' > ΛΕΣΒΟΥ value='38' > ΛΕΥΚΑΔΑΣ value='39' > ΜΑΓΝΗΣΙΑΣ value='40' > ΜΕΣΣΗΝΙΑΣ value='41' > ΞΑΝΘΗΣ
   value='43' > ΠΕΛΛΗΣ value='44' > ΠΙΕΡΙΑΣ value='45' > ΠΡΕΒΕΖΗΣ value='46' > ΡΕΘΥΜΝΟΥ value='47' > ΡΟΔΟΠΗΣ value='48' > ΣΑΜΟΥ value='49' > ΣΕΡΡΩΝ
   value='50' > ΤΡΙΚΑΛΩΝ value='51' > ΦΘΙΩΤΙΔΑΣ value='52' > ΦΛΩΡΙΝΑΣ value='53' > ΦΩΚΙΔΑΣ value='54' > ΧΑΛΚΙΔΙΚΗΣ value='55' > ΧΑΝΙΩΝ value='56' > ΧΙΟΥ */
cityNumLocations = [67, 30, 96, 62].concat(_.range(6, 22), _.range(23, 32), _.range(33, 42), _.range(43, 57));

/* options for geocoder */
const options = {
    provider: 'google',
    apiKey: process.env.API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

cityPage = [];
coordsArray = [];
locationId = 0;
isDuplicateMultiplier = 0;
duplicateFactor = 0;
oldLocation = '';

/* find the number of pages for each city */
const findNumOfPages = async () => {
    try {
        for (cityNum of cityNumLocations) {
            // parse only the first page and collect number of pages
            for (let pageNum = 1; pageNum < 2; pageNum++) {
                url = `https://siteapps.deddie.gr/Outages2Public/Home/OutagesPartial?page=${pageNum}&municipalityID=&prefectureID=${cityNum}`;
                const resp = await axios.get(url);

                // parse html
                const $ = cheerio.load(resp.data);

                $('body > div > div > div > ul > li').each((index, element) => {
                    cityChar = parseInt($($(element).find('a')).text());
                    if (Number.isInteger(cityChar)) {
                        cityPage.push({
                            cityNum: cityNum,
                            page: cityChar
                        })
                    }
                });
            }
        }
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

/* find coordinates of event location */
const findCoordsOfOutages = async () => {
    try {
        for (let i = 0; i <= cityPage.length; i++) {

            url = `https://siteapps.deddie.gr/Outages2Public/Home/OutagesPartial?page=${cityPage[i].page}&municipalityID=&prefectureID=${cityPage[i].cityNum}`;
            const resp = await axios.get(url);
            // parse html
            const $ = cheerio.load(resp.data);

            $('body > div > div > table > tbody > tr').each((index, element) => {

                location = $($(element).find('td')[2]).text();

                // multiplier for changing longtitude of duplicate markers (=markers with same coords)
                isDuplicateMultiplier = 0;
                if (location == oldLocation) {
                    isDuplicateMultiplier = 1;
                }
                else {
                    duplicateFactor = 0;
                }

                // get coords from location
                // isLive(): checks if power cut is live or planned
                geocoder.geocode({ 'address': location + ', GR' })
                    .then(function (res) {
                        coordsArray.push({
                            latitude: res[0].latitude,
                            longitude: res[0].longitude + (isDuplicateMultiplier * duplicateFactor * 0.001),
                            isLive: helper.islive($($(element).find('td')[0]).text(), $($(element).find('td')[1]).text()),
                            fromDateTime: $($(element).find('td')[0]).text(),
                            toDateTime: $($(element).find('td')[1]).text(),
                            faultLocation: $($(element).find('td')[2]).text(),
                            locationDetails: $($(element).find('td')[3]).text(),
                            id: locationId++
                        })
                        duplicateFactor++;
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                oldLocation = location;
            });
        }
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

module.exports = { findNumOfPages, findCoordsOfOutages };