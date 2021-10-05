var express = require("express");
var router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const colors = require("colors");
var _ = require('underscore');
const NodeGeocoder = require('node-geocoder');
const helper = require("../lib/helpers");

/* value="9" > ΑΡΤΑΣ value="10"> ΑΤΤΙΚΗΣ value="11" > ΑΧΑΙΑΣ value="12" > ΒΟΙΩΤΙΑΣ value="13" > ΓΡΕΒΕΝΩΝ value="14" > ΔΡΑΜΑΣ value="15" > ΔΩΔΕΚΑΝΗΣΟΥ
   value="6" > ΕΒΡΟΥ value="16" > ΕΥΒΟΙΑΣ value="17" > ΕΥΡΥΤΑΝΙΑΣ value="18" > ΖΑΚΥΝΘΟΥ value="19" > ΗΛΕΙΑΣ value="20" > ΗΜΑΘΙΑΣ value="21" > ΗΡΑΚΛΕΙΟΥ
   value="96" > ΘΕΣΠΡΩΤΙΑ value="23" > ΘΕΣΣΑΛΟΝΙΚΗΣ value="24" > ΙΩΑΝΝΙΝΩΝ value="25" > ΚΑΒΑΛΑΣ value="26" > ΚΑΡΔΙΤΣΑΣ value="27" > ΚΑΣΤΟΡΙΑΣ value="28" > ΚΕΡΚΥΡΑΣ
   value="29" > ΚΕΦΑΛΛΟΝΙΑ value="30" > ΚΙΛΚΙΣ value="31" > ΚΟΖΑΝΗΣ value="62" > ΚΟΡΙΝΘΙΑΣ value="33" > ΚΥΚΛΑΔΩΝ value="34" > ΛΑΚΩΝΙΑΣ value="35" > ΛΑΡΙΣΑΣ
   value="36" > ΛΑΣIΘΙΟΥ value="37" > ΛΕΣΒΟΥ value="38" > ΛΕΥΚΑΔΑΣ value="39" > ΜΑΓΝΗΣΙΑΣ value="40" > ΜΕΣΣΗΝΙΑΣ value="41" > ΞΑΝΘΗΣ
   value="43" > ΠΕΛΛΗΣ value="44" > ΠΙΕΡΙΑΣ value="45" > ΠΡΕΒΕΖΗΣ value="46" > ΡΕΘΥΜΝΟΥ value="47" > ΡΟΔΟΠΗΣ value="48" > ΣΑΜΟΥ value="49" > ΣΕΡΡΩΝ
   value="50" > ΤΡΙΚΑΛΩΝ value="51" > ΦΘΙΩΤΙΔΑΣ value="52" > ΦΛΩΡΙΝΑΣ value="53" > ΦΩΚΙΔΑΣ value="54" > ΧΑΛΚΙΔΙΚΗΣ value="55" > ΧΑΝΙΩΝ value="56" > ΧΙΟΥ */
cityNumLocations = [67, 30, 96, 62].concat(_.range(6, 21), _.range(23, 31), _.range(33, 41), _.range(43, 56))

const options = {
    provider: 'google',
    apiKey: 'AIzaSyDWbxY8wOy9rYue9YsyJAVO9VpYFqkVSZ8', // for Mapquest, OpenCage, Google Premier
    formatter: null,// 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

coordsArray = [];

for (cityNum of cityNumLocations) {
    for (let pageNum = 1; pageNum < 2; pageNum++) {
        url = "https://siteapps.deddie.gr/Outages2Public/Home/OutagesPartial?page=" + pageNum + "&municipalityID=&prefectureID=" + cityNum

        axios
            .get(url)
            .then((response) => {
                const $ = cheerio.load(response.data);

                $("body > div > div > table > tbody > tr").each((index, element) => {
                    // TODO find duplicate entries
                    geocoder.geocode(helper.string_to_slug($($(element).find("td")[2]).text()))
                        .then(function (res) {
                            coordsArray.push({ latitude: res[0].latitude, longitude: res[0].longitude })
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                });
            })
            .catch((err) => console.log("Fetch error " + err));
    }
}

    router.get("/", function (req, res, next) {
        res.send(JSON.stringify(coordsArray));
    });
module.exports = router;