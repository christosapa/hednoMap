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

// TODO check for minutes in time and month/year in date
function islive(fromDateTime, toDateTime) {

    var today = new Date();
    var currentDate = today.getDate() //+ '/' +(today.getMonth()+1)+ '/' + today.getFullYear();
    var currentTime = today.getHours() //+ ":" + today.getMinutes() + ":" + today.getSeconds();

    fromDate = parseInt(fromDateTime.split(" ")[0].split("/")[0])
    toDate = parseInt(toDateTime.split(" ")[0].split("/")[0])

    // convert time to 24-hour format
    fromTime = parseInt(fromDateTime.split(" ")[1].split(":")[0])
    toTime = parseInt(toDateTime.split(" ")[1].split(":")[0])
    if (fromDateTime.split(" ")[2] == "μμ" && fromTime != 12) {
        fromTime = fromTime + 12
    }
    if (toDateTime.split(" ")[2] == "μμ" && toTime != 12) {
        toTime = toTime + 12
    }

    if (currentDate >= fromDate && currentDate <= toDate) {
        if (currentTime >= fromTime && currentTime <= toTime) {
            return true
        }
    }
    return false
}

module.exports = { string_to_slug, islive };