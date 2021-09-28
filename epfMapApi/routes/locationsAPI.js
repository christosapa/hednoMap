var express = require("express");
var router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const colors = require("colors");
var _ = require('underscore');

// TODO write all municipalities with coords
locationsDictionary = {
    "kilkis": [40.99402872045363, 22.873970191401646],
    "i.p. mesologgiou": [38.37313816540975, 21.436854304810463],
    "naupaktou": [38.39401424524524, 21.839038306784772],
    "filiaton": [39.60117826874078, 20.310472261428593],
    // "sikyonion/kryoneri": [37.86751045855157, 22.582955566223802],
    // "loutrakiou-ag.theodoron/pisia": [38.02077359673312, 22.987254907272625]
};

// value="9" > ΑΡΤΑΣ 
// value="10"> ΑΤΤΙΚΗΣ
// value="11" > ΑΧΑΙΑΣ
// value="12" > ΒΟΙΩΤΙΑΣ
// value="13" > ΓΡΕΒΕΝΩΝ
// value="14" > ΔΡΑΜΑΣ
// value="15" > ΔΩΔΕΚΑΝΗΣΟΥ
// value="6" > ΕΒΡΟΥ
// value="16" > ΕΥΒΟΙΑΣ
// value="17" > ΕΥΡΥΤΑΝΙΑΣ
// value="18" > ΖΑΚΥΝΘΟΥ
// value="19" > ΗΛΕΙΑΣ
// value="20" > ΗΜΑΘΙΑΣ
// value="21" > ΗΡΑΚΛΕΙΟΥ
// value="96" > ΘΕΣΠΡΩΤΙΑ
// value="23" > ΘΕΣΣΑΛΟΝΙΚΗΣ
// value="24" > ΙΩΑΝΝΙΝΩΝ
// value="25" > ΚΑΒΑΛΑΣ
// value="26" > ΚΑΡΔΙΤΣΑΣ
// value="27" > ΚΑΣΤΟΡΙΑΣ
// value="28" > ΚΕΡΚΥΡΑΣ
// value="29" > ΚΕΦΑΛΛΟΝΙΑ
// value="30" > ΚΙΛΚΙΣ
// value="31" > ΚΟΖΑΝΗΣ
// value="62" > ΚΟΡΙΝΘΙΑΣ
// value="33" > ΚΥΚΛΑΔΩΝ
// value="34" > ΛΑΚΩΝΙΑΣ
// value="35" > ΛΑΡΙΣΑΣ
// value="36" > ΛΑΣIΘΙΟΥ
// value="37" > ΛΕΣΒΟΥ
// value="38" > ΛΕΥΚΑΔΑΣ
// value="39" > ΜΑΓΝΗΣΙΑΣ
// value="40" > ΜΕΣΣΗΝΙΑΣ
// value="41" > ΞΑΝΘΗΣ
// value="43" > ΠΕΛΛΗΣ
// value="44" > ΠΙΕΡΙΑΣ
// value="45" > ΠΡΕΒΕΖΗΣ
// value="46" > ΡΕΘΥΜΝΟΥ
// value="47" > ΡΟΔΟΠΗΣ
// value="48" > ΣΑΜΟΥ
// value="49" > ΣΕΡΡΩΝ
// value="50" > ΤΡΙΚΑΛΩΝ
// value="51" > ΦΘΙΩΤΙΔΑΣ
// value="52" > ΦΛΩΡΙΝΑΣ
// value="53" > ΦΩΚΙΔΑΣ
// value="54" > ΧΑΛΚΙΔΙΚΗΣ
// value="55" > ΧΑΝΙΩΝ
// value="56" > ΧΙΟΥ
cityNumLocations = [67, 30, 96]//, 62]//.concat(_.range(6, 21), _.range(23, 31),  _.range(33, 41), _.range(43, 56))


function string_to_slug(str) {

    str = str.replace(/^\s+|\s+$/g, '') // TRIM WHITESPACE AT BOTH ENDS.
        .toLowerCase();            // CONVERT TO LOWERCASE

    from = ["ου", "ΟΥ", "Ού", "ού", "αυ", "ΑΥ", "Αύ", "αύ", "ευ", "ΕΥ", "Εύ", "εύ", "α", "Α", "ά", "Ά", "β", "Β", "γ", "Γ", "δ", "Δ", "ε", "Ε", "έ", "Έ", "ζ", "Ζ", "η", "Η", "ή", "Ή", "θ", "Θ", "ι", "Ι", "ί", "Ί", "ϊ", "ΐ", "Ϊ", "κ", "Κ", "λ", "Λ", "μ", "Μ", "ν", "Ν", "ξ", "Ξ", "ο", "Ο", "ό", "Ό", "π", "Π", "ρ", "Ρ", "σ", "Σ", "ς", "τ", "Τ", "υ", "Υ", "ύ", "Ύ", "ϋ", "ΰ", "Ϋ", "φ", "Φ", "χ", "Χ", "ψ", "Ψ", "ω", "Ω", "ώ", "Ώ"];
    to = ["ou", "ou", "ou", "ou", "au", "au", "au", "au", "eu", "eu", "eu", "eu", "a", "a", "a", "a", "b", "b", "g", "g", "d", "d", "e", "e", "e", "e", "z", "z", "i", "i", "i", "i", "th", "th", "i", "i", "i", "i", "i", "i", "i", "k", "k", "l", "l", "m", "m", "n", "n", "ks", "ks", "o", "o", "o", "o", "p", "p", "r", "r", "s", "s", "s", "t", "t", "y", "y", "y", "y", "y", "y", "y", "f", "f", "x", "x", "ps", "ps", "o", "o", "o", "o"];

    for (var i = 0; i < from.length; i++) {
        while (str.indexOf(from[i]) !== -1) {
            str = str.replace(from[i], to[i]);    // CONVERT GREEK CHARACTERS TO LATIN LETTERS
        }
    }

    // str = str.replace(/[^a-z0-9 -]/g, '') // REMOVE INVALID CHARS
    //     .replace(/\s+/g, '-')        // COLLAPSE WHITESPACE AND REPLACE BY DASH - 
    //     .replace(/-+/g, '-');        // COLLAPSE DASHES

    return str;
}

coordsArray = [];

for (cityNum of cityNumLocations) {
    console.log(cityNum)
    for (let pageNum = 1; pageNum<2; pageNum++) {
        console.log(pageNum)
        url = "https://siteapps.deddie.gr/Outages2Public/Home/OutagesPartial?page=" + pageNum + "&municipalityID=&prefectureID=" + cityNum
        console.log(url);
        
        axios
            .get(url)
            .then((response) => {
                const $ = cheerio.load(response.data);

                $("body > div > div > table > tbody > tr").each((index, element) => {
                    // TODO find duplicate entries
                    console.log($($(element).find("td")[2]).text()/*.trim().replace(" ","-")*/);
                    coordsArray = coordsArray + "[" + locationsDictionary[string_to_slug($($(element).find("td")[2]).text())] + "]\n";
                    console.log(coordsArray);
                });
            })
            .catch((err) => console.log("Fetch error " + err));
    }
}

router.get("/", function (req, res, next) {
    res.send(coordsArray);
});

module.exports = router;