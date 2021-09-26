var express = require("express");
var router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const colors = require("colors");

locationsDictionary = {
    "kilkis": [40.99402872045363, 22.873970191401646],
};

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

    str = str.replace(/[^a-z0-9 -]/g, '') // REMOVE INVALID CHARS
        .replace(/\s+/g, '-')        // COLLAPSE WHITESPACE AND REPLACE BY DASH - 
        .replace(/-+/g, '-');        // COLLAPSE DASHES

    return str;

}

axios
    .get("https://siteapps.deddie.gr/Outages2Public/Home/OutagesPartial?page=1&municipalityID=&prefectureID=30")
    .then((response) => {
        const $ = cheerio.load(response.data);

        $("body > div > div > table > tbody > tr").each((index, element) => {
            htmlScraped = locationsDictionary[string_to_slug($($(element).find("td")[2]).text())];
            console.log($($(element).find("td")[2]).text());
            console.log(htmlScraped);
        });
    })
    .catch((err) => console.log("Fetch error " + err));


router.get("/", function (req, res, next) {
    res.send(htmlScraped);
});

module.exports = router;