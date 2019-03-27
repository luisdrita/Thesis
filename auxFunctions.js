// ---------------------------------------------- Auxiliary Functions ----------------------------------------------

function searchy(value, array_input) {

    let result = false;

    for (let i = 0; i < array_input.length; i++) {

        if (array_input[i] === value) {
            result = true;
            break;
        }

    }

    return result
}

function nodeDetection(nodes_obj) {

    let result = [];

    for (let i = 0; i < nodes_obj.length; i++) {

        result.push(nodes_obj[i].id)

    }

    return result
}

// Converting array of arrays data to string representation. To be used to generate .txt docs for benchmark.
function arrayToString(multi_array, str, title) {

    str += "Benchmark";
    str += "\t";

    for (let ij = 0; ij < title.length; ij++) {
        str += (title[ij] + "-" + ij);
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

function consensusArray(multi_array) {

    for (let j = 0; j < multi_array[0].length; j++) {

        let count = [];

        for (let i = 0; i < multi_array.length; i++) {

            count[multi_array[i][j]] = count[multi_array[i][j]] + 1;



        }

    }
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
    searchy: searchy,
    nodeDetection: nodeDetection,
    arrayToString: arrayToString,
    printMeta: printMeta,
    consensusArray: consensusArray,
    edge: edge,
    nodify: nodify
};