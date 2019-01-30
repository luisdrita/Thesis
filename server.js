// Importing General Libraries.
const fs = require('fs');
const express = require('express');
let formidable = require('formidable');

// Importing Community Finding Libraries.
const infomap = require('./website/algorithms/mod_algorithms/mod_infomap');
const louvain = require('./website/algorithms/mod_algorithms/mod_louvain');
const layeredLabelPropagation = require('./website/algorithms/mod_algorithms/mod_layeredLabelPropagation');
const weightedLabelPropagation = require('./website/algorithms/mod_algorithms/mod_weightedLabelPropagation');

const app = express();

app.use(express.static('website'));

app.listen(process.env.PORT || 3000);

let result = {};
let result_reset = {};
let result_cyto = {};
let type, community, node_data, obj, obj_cyto;

function edge (source, target) { // Used in fs.readFile in order to push each edge in Input.txt to an empty array.
    return {source: source, target: target, value: 1}; // Previously, I used parseInt to convert source and target strings to an integer.
}

function edge_cyto (source, target) { // Used in fs.readFile in order to push each edge in Input.txt to an empty array.
    return {data: {source: source, target: target}}; // Previously, I used parseInt to convert source and target strings to an integer.
}

function nodify (final_node_data, state) { // Used in fs.readFile in order to push each node in Input.txt to an empty array.

    let result_aux = [];
    let keys = Object.keys(final_node_data);
    if(state === 0) {
        keys.forEach(function (key) {
            result_aux.push({"id": key, "group": final_node_data[key]})
        });
    } else if (state === 1) {
        keys.forEach(function (key) {
            result_aux.push({"id": key, "group": 1})
        });
    } else {
        keys.forEach(function (key) {
            result_aux.push({data: {"id": key}})
        });
    }
    return result_aux; // Previously, I used parseInt to convert the key string to an integer.
}

function readFile(type) {

    fs.readFile('./uploads/Input.txt', 'utf8', function (err, data) {
        obj = [];
        obj_cyto = [];

        if (err) throw err;
        node_data = {};
        let splitted = data.toString().split("\n");

        for (let i = 0; i < 1000; i++) {
            let splitLine = splitted[i].split("\t");
            node_data[splitLine[0]] = true;
            node_data[splitLine[1]] = true;
            obj.push(edge(splitLine[0], splitLine[1]));
            obj_cyto.push(edge_cyto(splitLine[0], splitLine[1]));

        }

        switch (type) {

            case 'init':
                community = node_data;
                result_reset["nodes"] = nodify(node_data, 1);
                result_reset["links"] = obj;

                break;

            case 'louvain':
                community = louvain.louvainVar(Object.keys(node_data), obj);

                result["nodes"] = nodify(community, 0);
                result["links"] = obj;

                result_cyto["nodes"] = nodify(community, 2);
                result_cyto["links"] = obj_cyto;

                break;

            case 'infomap':
                community = infomap.infomapVar(Object.keys(node_data), obj);
                result["nodes"] = nodify(community, 0);
                result["links"] = obj;

                result_cyto["nodes"] = nodify(community, 2);
                result_cyto["links"] = obj_cyto;

                break;

            case 'llp':
                community = layeredLabelPropagation.layeredLabelPropagationVar(Object.keys(node_data), obj);
                result["nodes"] = nodify(community, 0);
                result["links"] = obj;

                result_cyto["nodes"] = nodify(community, 2);
                result_cyto["links"] = obj_cyto;

        }

    });

}
readFile('init'); // Standard algorithm when any is chosen.

app.get('/run', function (req, res) { // This will run every time you send a request to localhost:3000/search.

    res.send(result); // Responding.

});

app.get('/reset', function (req, res) { // This will run every time you send a request to localhost:3000/search.

    res.send(result_reset); // Responding.

});

app.get('/algorithm/:type', function (req, res) { // This will run every time you send a request to localhost:3000/search.

    type = req.params.type;

    readFile(type);

});

app.get('/reset_cyto', function (req, res) { // This will run every time you send a request to localhost:3000/search.

    res.send(result_cyto); // Responding.

});

app.post('/upload', function (req, res){
    let form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
    });

});