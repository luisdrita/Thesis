function hashCode(str) { // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash*130;
}

function intToRGB(i){
    let c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

function label2number(label, metadata, id) {

    let result = {};

    for (let i = 0; i < Object.keys(metadata).length; i++) {

        result[(metadata[i][label])] = (result[metadata[i][label]] + 1) || 0;
    }
    return result[id]
}

function numberNonEmpty(label, metadata) {

    let result = 0;

    for (let i = 0; i < Object.keys(metadata).length; i++) {

        if (isNaN(metadata[i][label]) !== true && metadata[i][label] !== "") result = (result + 1);
    }
    return result
}