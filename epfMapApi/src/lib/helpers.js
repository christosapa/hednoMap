/* convert greek letters to latin */
function string_to_slug(str) {

    // trim whitespace at both ends
    str = str.replace(/^\s+|\s+$/g, '')
        // convert to lowercase
        .toLowerCase();

    from = ['ου', 'ΟΥ', 'Ού', 'ού', 'αυ', 'ΑΥ', 'Αύ', 'αύ', 'ευ', 'ΕΥ', 'Εύ', 'εύ', 'α', 'Α', 'ά', 'Ά', 'β', 'Β', 'γ', 'Γ', 'δ', 'Δ', 'ε', 'Ε', 'έ', 'Έ', 'ζ', 'Ζ', 'η', 'Η', 'ή', 'Ή', 'θ', 'Θ', 'ι', 'Ι', 'ί', 'Ί', 'ϊ', 'ΐ', 'Ϊ', 'κ', 'Κ', 'λ', 'Λ', 'μ', 'Μ', 'ν', 'Ν', 'ξ', 'Ξ', 'ο', 'Ο', 'ό', 'Ό', 'π', 'Π', 'ρ', 'Ρ', 'σ', 'Σ', 'ς', 'τ', 'Τ', 'υ', 'Υ', 'ύ', 'Ύ', 'ϋ', 'ΰ', 'Ϋ', 'φ', 'Φ', 'χ', 'Χ', 'ψ', 'Ψ', 'ω', 'Ω', 'ώ', 'Ώ'];
    to = ['ou', 'ou', 'ou', 'ou', 'au', 'au', 'au', 'au', 'eu', 'eu', 'eu', 'eu', 'a', 'a', 'a', 'a', 'b', 'b', 'g', 'g', 'd', 'd', 'e', 'e', 'e', 'e', 'z', 'z', 'i', 'i', 'i', 'i', 'th', 'th', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'k', 'k', 'l', 'l', 'm', 'm', 'n', 'n', 'ks', 'ks', 'o', 'o', 'o', 'o', 'p', 'p', 'r', 'r', 's', 's', 's', 't', 't', 'y', 'y', 'y', 'y', 'y', 'y', 'y', 'f', 'f', 'x', 'x', 'ps', 'ps', 'o', 'o', 'o', 'o'];

    for (var i = 0; i < from.length; i++) {
        while (str.indexOf(from[i]) !== -1) {
            str = str.replace(from[i], to[i]);
        }
    }

    // str = str.replace(/[^a-z0-9 -]/g, '') // REMOVE INVALID CHARS
    //     .replace(/\s+/g, '-')        // COLLAPSE WHITESPACE AND REPLACE BY DASH - 
    //     .replace(/-+/g, '-');        // COLLAPSE DASHES

    return str;
}

/* check if event is live or planned */
function islive(fromDateTime, toDateTime) {
    
    // current date and time are Greek (am-ET because of time/date format)
    var today = new Date().toLocaleString('am-ET', {timeZone: 'Europe/Athens'}, {timeStyle: 'short'}, {hour12: false}, {month: 'short'});

    // match date ant time from today
    var currentDate = today.match(/[0-9]+.[0-9]+.[0-9]+/)[0].replace(/[.]/g, '/');
    var currentTime = today.match(/[0-9]+:[0-9]+/)[0];

    // strip leading zero from date
    (currentDate[0] == '0') && (currentDate = currentDate.match(/[0-9].[0-9]+.[0-9]+/)[0]) 

    fromDate = fromDateTime.match(/[0-9]+\/[0-9]+\/[0-9]+/)[0];
    toDate = toDateTime.match(/[0-9]+\/[0-9]+\/[0-9]+/)[0];

    fromTime = fromDateTime.match(/[0-9]+:[0-9]+/)[0];
    toTime = toDateTime.match(/[0-9]+:[0-9]+/)[0];

    // convert time to hh:mm format
    (fromTime[1] == ':') && (fromTime = '0' + fromTime);
    (toTime[1] == ':') && (toTime = '0' + toTime);

    // convert time to 24-hour format
    if (fromDateTime.match(/[α-ω]{2}/)[0] == 'μμ' && fromTime < '12:00') {
        fromTimeHH = String(parseInt(fromTime) + 12);
        fromTime = fromTimeHH + fromTime.match(/:[0-9]{2}/)[0];
    }
    if (toDateTime.match(/[α-ω]{2}/)[0] == 'μμ' && toTime < '12:00') {
        toTimeHH = String(parseInt(toTime) + 12);
        toTime = toTimeHH + toTime.match(/:[0-9]{2}/)[0];
    }

    if (currentDate >= fromDate && currentDate <= toDate) {
        if (currentTime >= fromTime && currentTime <= toTime) {
            return true;
        }
    }
    return false;
}

module.exports = { string_to_slug, islive };