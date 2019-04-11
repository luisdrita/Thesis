// ---------------------------------------------- Auxiliary Functions ----------------------------------------------

function nodeDetection(nodes_obj, state) {

    let result = [];

    for (let i = 0; i < nodes_obj.length; i++) {

        if(state) {
            result.push(nodes_obj[i].id)
        } else {
            result.push(nodes_obj[i].data.id)
        }
    }
    return result
}

// Converting array of arrays data to string representation. To be used to generate .txt docs for benchmark.
function arrayToString(multi_array, str, title) {

    for (let ij = 0; ij < title.length; ij++) {
        str += (title[ij]);
        str += "\t";
    }
    str += "\n";

    for (let j = 0; j < multi_array[0].length; j++) {

        for (let i = 0; i < multi_array.length; i++) {

            str += multi_array[i][j];

            str += "\t";

        }

        str += "\n";

    }
    return str;
}

// Converting array of arrays data to string representation. To be used to generate .txt docs for benchmark.
function arrayToString_plot(obj, str, titles) {

    let result = {};
    let all_titles = Object.keys(obj);
    let repeat = 10;

    for (let i = 0; i < titles.length; i++) {

        for (let j = 0; j < all_titles.length; j++) {

            if (all_titles[j].includes(titles[i])) {

                result[titles[i]] = result[titles[i]] || 0;
                result[titles[i]] = result[titles[i]] + obj[all_titles[j]]/repeat;

            }
        }
    }

    let std_dev = {};

    for (let i = 0; i < titles.length; i++) {

        for (let j = 0; j < all_titles.length; j++) {

            if (all_titles[j].includes(titles[i])) {

                std_dev[titles[i]] = std_dev[titles[i]] || 0;
                std_dev[titles[i]] = std_dev[titles[i]] + Math.pow(obj[all_titles[j]] - result[titles[i]], 2)/repeat;
            }
        }

        std_dev[titles[i]] = Math.pow(std_dev[titles[i]], 0.5);

    }

    console.log(std_dev);
    console.log(result);

    let result_values = Object.values(result);
    let std_dev_values = Object.values(std_dev);

    str += ("time");
    str += ",";

    // ---------------------------- NMI x Mix Parameter [BENCH]

    str += ("Label Propagation");
    str += ",";
    str += ("SD1");
    str += ",";
    str += ("Layered Label Propagation");
    str += ",";
    str += ("SD2");
    str += ",";
    str += ("Louvain");
    str += ",";
    str += ("SD3");
    str += ",";
    str += ("Infomap");
    str += ",";
    str += ("SD4");

    // ---------------------------- LP/LLP/Louvain/Infomap NMI x Mix Parameter [BENCH]
/*
    str += ("k = 15");
    str += ",";
    str += ("SD1");
    str += ",";
    str += ("k = 20");
    str += ",";
    str += ("SD2");
    str += ",";
    str += ("k = 25");
    str += ",";
    str += ("SD3");
*/
    // ---------------------------- NMI Layered Label Propagation x Gamma Parameter [BENCH]
/*
    for (let i = 0; i < 11; i++) {

        str += ("Mix Param. = " + i/10);
        str += ",";
        str += ("SD" + (i + 1));

        if (i < 10) str += ",";

    }
*/

    // ---------------------------- GN Generating Time x Mix Parameter [BENCH]

/*
    str += ("Generating Time");
    str += ",";
    str += ("SD1");
*/


    str += "\n";

    for (let j = 0; j < 11; j++) {

        str += j/10;
        str += ",";

        for (let i = j; i < result_values.length; i = i + 11) {

                str += Math.round(result_values[i]*1000)/1000;
                str += ",";
                str += Math.round(std_dev_values[i]*1000)/1000;

            if (i < result_values.length-11) str += ",";

        }

        if(j !== 11-1) str += "\n";

        }

    return str;
}

// Converting array of arrays data to string representation. To be used to generate .txt docs for benchmark.
function printMeta(obj, length_var) {

    let str = "";
    let new_obj = {};

    let keys = Object.keys(obj);
    let values = Object.values(obj);

    str += ("ST");
    str += "\t";
    str += ("Community");
    str += "\n";

    for (let i = 1; i < length_var; i++) { // Generating 127 nodes, distributed in 4 groups, from GN benchmark network.

        new_obj[i.toString()] = length_var;

    }

    for (let i = 0; i < keys.length; i++) { // Generating 127 nodes, distributed in 4 groups, from GN benchmark network.

        new_obj[keys[i]] = values[i];

    }

    keys = Object.keys(new_obj);
    values = Object.values(new_obj);

    for (let j = 0; j < keys.length; j++) {

        for (let i = 0; i < 2; i++) {

            if (i === 0) {
                str += keys[j];
                str += "\t";
            } else {
                str += values[j];
            }

        }

        if(j !== keys.length-1) {
            str += "\n";
        }

    }

    return str;

}

// Upon input of source and target nodes, it returns an edge with the right format.
function edge (source, target) { // Used in fs.readFile in order to push each edge in Input.txt to an empty array.
    return {source: source, target: target, value: 1}; // Previously, I used parseInt to convert source and target strings to an integer.
}

// Upon input of a set of nodes, it returns an array with different format accordingly to a state value. It pretends to adjust to the type of visualization scheme and reset/run state.
function nodify (final_node_data, state) { // Used in fs.readFile in order to push each node in Input.txt to an empty array.

    let result_aux = [];
    let keys = Object.keys(final_node_data);

    switch(state) {

        case 0:
            keys.forEach(function (key) {
                result_aux.push({id: key, group: final_node_data[key]})
            });
            break;

        case 1:
            keys.forEach(function (key) {
                result_aux.push({id: key, group: 1})
            });
            break;

        case 2:
            keys.forEach(function (key) {
                result_aux.push({data: {id: key, weight: 5}})
            });
            break;

        case 3:
            keys.forEach(function (key) {
                result_aux.push({data: {id: key, weight: final_node_data[key]}});
            });

    }
    return result_aux; // Previously, I used parseInt to convert the key string to an integer.
}

module.exports = {
    nodeDetection: nodeDetection,
    arrayToString: arrayToString,
    printMeta: printMeta,
    edge: edge,
    nodify: nodify,
    arrayToString_plot: arrayToString_plot
};