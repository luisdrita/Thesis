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
let community, node_data, obj, obj_cyto, girvan_bench, girvan_bench_cyto;

let str = "";
let final_arr = [];

function arrayToString(multi_array) {

    for (let ij = 0; ij < multi_array.length; ij++) {
        str += ("Method" + ij);
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
}

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

function readFile(type, gamma_var, cyto, fet) {

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

                girvan_bench = girvan.girvanVar(0.1, "false", 16);
                girvan_bench_cyto = girvan.girvanVar(0.1, "true", 16);

                result["communities"] = girvan_bench["communities"];
                final_arr.push(result["communities"]);

                break;

            case 'louvain':

                if(cyto==="true" && fet !== "Girvan") {

                    community = louvain.louvainVar(final_node_data, obj, gamma_var);

                    result_cyto["nodes"] = nodify(community, 3);
                    result_cyto["links"] = obj_cyto;

                } else if (cyto==="true" && fet === "Girvan") {

                    result_cyto["nodes"] = girvan_bench_cyto["nodes"];
                    result_cyto["links"] = girvan_bench_cyto["links"];

                } else if (cyto !== "true" && fet !== "Girvan") {

                    community = louvain.louvainVar(final_node_data, obj, gamma_var);

                    result["nodes"] = nodify(community, 0);
                    result["links"] = obj;

                } else if (cyto !== "true" && fet === "Girvan") {

                    community = louvain.louvainVar(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);

                    result["nodes"] = nodify(community, 0);
                    result["links"] = girvan_bench["links"];

                    final_arr.push(Object.values(community));

                //    fs.writeFile("./girvanLouvain.txt", arrayToString(result["communities"]));

                }

                break;

            case 'infomap':

                if(cyto==="true" && fet !== "Girvan") {

                    community = infomap.infomapVar(final_node_data, obj, gamma_var);

                    result_cyto["nodes"] = nodify(community, 3);
                    result_cyto["links"] = obj_cyto;

                } else if (cyto==="true" && fet === "Girvan") {

                    result_cyto["nodes"] = girvan_bench_cyto["nodes"];
                    result_cyto["links"] = girvan_bench_cyto["links"];

                } else if (cyto !== "true" && fet !== "Girvan") {

                    community = infomap.infomapVar(final_node_data, obj, gamma_var);

                    result["nodes"] = nodify(community, 0);
                    result["links"] = obj;

                } else if (cyto !== "true" && fet === "Girvan") {

                    community = infomap.infomapVar(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);

                    console.log(community);

                    result["nodes"] = nodify(community, 0);
                    result["links"] = girvan_bench["links"];

                    final_arr.push(Object.values(community));

                }

                break;

            case 'llp':

                if(cyto==="true" && fet !== "Girvan") {

                    community = layeredLabelPropagation.layeredLabelPropagationVar(final_node_data, obj, gamma_var);

                    result_cyto["nodes"] = nodify(community, 3);
                    result_cyto["links"] = obj_cyto;

                } else if (cyto==="true" && fet === "Girvan") {

                    result_cyto["nodes"] = girvan_bench_cyto["nodes"];
                    result_cyto["links"] = girvan_bench_cyto["links"];

                } else if (cyto !== "true" && fet !== "Girvan") {

                    community = layeredLabelPropagation.layeredLabelPropagationVar(final_node_data, obj, gamma_var);

                    result["nodes"] = nodify(community, 0);
                    result["links"] = obj;

                } else if (cyto !== "true" && fet === "Girvan") {

                    community = layeredLabelPropagation.layeredLabelPropagationVar(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], 1);

                    result["nodes"] = nodify(community, 0);
                    result["links"] = girvan_bench["links"];

                    final_arr.push(Object.values(community));

                //    fs.writeFile("./girvanLouvain.txt", str);

                }

        }

    });

}

readFile('init', 0, "true", "undefined");

 // Standard algorithm when any is chosen.

app.get('/run/:id', function (req, res) { // This will run every time you send a request to localhost:3000/search.

    if(req.params.id === "Cytoscape") {
        res.send(result_cyto);

    } else {
        res.send(result); // Responding.
    }

    arrayToString(final_arr);
    fs.writeFile("./benchmark_data/llp_gamma1_mix0.txt", str);

});

app.get('/reset/:alg', function (req, res) { // This will run every time you send a request to localhost:3000/search.

    switch (req.params.alg) {

        case "Cytoscape":
            res.send(result_cyto_reset);
            break;
        case "Girvan":
            res.send(girvan_bench);
            break;

        case "LFR":
            res.send(result_cyto_reset);
            break;

        case "Girvan_Cytoscape":
            res.send(girvan_bench_cyto);
            break;

        case "undefined":
            res.send(result_reset);
    }

});

app.get('/algorithm/:type/gamma/:val/cytoscape/:cyto/fetchy/:fet', function (req, res) { // This will run every time you send a request to localhost:3000/search.

        readFile(req.params.type, req.params.val, req.params.cyto, req.params.fet);

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

/*

function ola () {
    for (let i = 0; i < 11; i++) {
        readFile('llp', i/10, "false", "Girvan");
        console.log(str);
    }

    fs.writeFile("./girvanLouvain.txt", str);
}

*/



// console.log(lfr.lfrVar(3, 2, 100, 0.2));