// Importing General Libraries.
const fs = require('fs');
const express = require('express');
const formidable = require('formidable');

// Importing Community Finding Libraries.
const infomap = require('./website/algorithms/mod_algorithms/mod_infomap');
const louvain = require('./website/algorithms/mod_algorithms/mod_louvain');
const layeredLabelPropagation = require('./website/algorithms/mod_algorithms/mod_layeredLabelPropagation');

// Importing Benchmarking Libraries
const girvan = require('./website/benchmark/girvan-newman');
const lfr = require('./website/benchmark/lancichinetti-fortunato-radicchi');

const app = express();

app.use(express.static('website'));
app.listen(process.env.PORT || 3000);

let result = {}, result_reset = {}, result_cyto = {}, result_cyto_reset = {};
let community, node_data, obj, obj_cyto, girvan_bench;

function edge (source, target) { // Used in fs.readFile in order to push each edge in Input.txt to an empty array.
    return {source: source, target: target, value: 1}; // Previously, I used parseInt to convert source and target strings to an integer.
}

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

function readFile(type, gamma_var, cyto) {

    fs.readFile('./uploads/Input.txt', 'utf8', function (err, data) {

        if (err) throw err;

        obj = [];
        obj_cyto = [];
        node_data = {};

        let split = data.toString().split("\n");

        for (let i = 1; i < 100; i++) {
            let splitLine = split[i].split("\t");
            node_data[splitLine[0]] = true;
            node_data[splitLine[1]] = true;
            obj.push(edge(splitLine[0], splitLine[1]));

            if (cyto==="true") obj_cyto.push({data: edge(splitLine[0], splitLine[1])});

        }

        let final_node_data = Object.keys(node_data);

        switch (type) {

            case 'init':
                result_reset["nodes"] = nodify(node_data, 1);
                result_reset["links"] = obj;

                result_cyto_reset["nodes"] = nodify(node_data, 2);
                result_cyto_reset["links"] = obj_cyto;

                girvan_bench = girvan.girvanVar(0.1);

                break;

            case 'louvain':
                community = louvain.louvainVar(final_node_data, obj, gamma_var);

                if(cyto==="true") {
                    result_cyto["nodes"] = nodify(community, 3);
                    result_cyto["links"] = obj_cyto;

                } else {
                    result["nodes"] = nodify(community, 0);
                    result["links"] = obj;
                }

                break;

            case 'infomap':
                community = infomap.infomapVar(final_node_data, obj, gamma_var);

                if(cyto==="true") {
                    result_cyto["nodes"] = nodify(community, 3);
                    result_cyto["links"] = obj_cyto;
                } else {
                    result["nodes"] = nodify(community, 0);
                    result["links"] = obj;
                }

                break;

            case 'llp':
                community = layeredLabelPropagation.layeredLabelPropagationVar(final_node_data, obj, gamma_var);

                if(cyto==="true") {
                    result_cyto["nodes"] = nodify(community, 3);
                    result_cyto["links"] = obj_cyto;
                } else {
                    result["nodes"] = nodify(community, 0);
                    result["links"] = obj;
                }

        }

    });

}

readFile('init', 0, "true");

 // Standard algorithm when any is chosen.

app.get('/run/:id', function (req, res) { // This will run every time you send a request to localhost:3000/search.

    if(req.params.id === "Cytoscape") {
        res.send(result_cyto);

    } else {
        res.send(result); // Responding.
    }

});

app.get('/reset/:alg', function (req, res) { // This will run every time you send a request to localhost:3000/search.

        if(req.params.alg === "Cytoscape") {
             res.send(result_cyto_reset);

        } else if (req.params.alg === "Girvan") {
            res.send(girvan_bench);

        } else if (req.params.alg === "LFR") {
            res.send(result_cyto_reset);

        } else {
             res.send(result_reset); // Responding.
        }

});

app.get('/algorithm/:type/gamma/:val/cytoscape/:cyto', function (req, res) { // This will run every time you send a request to localhost:3000/search.

        readFile(req.params.type, req.params.val, req.params.cyto);

    res.send();
});

app.post('/upload', function (req, res) {

    let form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + "Input2.txt"; // file.name substituted by Input.txt
    });

});

// Benchmark

console.log(lfr.lfrVar(3, 2, 100, 0.2));