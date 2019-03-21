// Importing general libraries.
const fs = require('fs');
const express = require('express');
const formidable = require('formidable');

//let requireEmscripten = require('require-emscripten');
//let counter = requireEmscripten(__dirname + '/node_modules/require-emscripten/example/test.c')._foo;
//__dirname + '/emsdk/emscripten/1.38.28/tests/lancichinetti-fortunato-radicchi/Sources/benchm.c'

// Importing community finding libraries.
const infomap = require('./website/algorithms/mod_algorithms/mod_infomap');
const louvain = require('./website/algorithms/mod_algorithms/mod_louvain');
const layeredLabelPropagation = require('./website/algorithms/mod_algorithms/mod_layeredLabelPropagation');
const hamming = require('./website/algorithms/hamming');

// Importing benchmarking libraries.
const girvan = require('./website/algorithms/benchmark/mod_girvan-newman');
// const lfr = require('./website/algorithms/benchmark/lancichinetti-fortunato-radicchi');

// Importing Zachary's karate club network. Supporting Cytoscape.js and D3.js representation.
const karate_reset = require('./website/algorithms/benchmark/karate_club.json');
const karate_cyto_reset = require('./website/algorithms/benchmark/karate_club_cyto.json');

const app = express();

app.use(express.static('website'));
app.listen(process.env.PORT || 3000);

// Initializing global variables.
let result = {}, result_reset = {}, result_cyto = {}, result_cyto_reset = {}, phylo_reset = {}, phylo_cyto_reset = {};
let node_data_lfr, obj_lfr_com, obj_lfr, obj_lfr_cyto, girvan_bench = {}, girvan_bench_cyto = {}, lfr_bench = {}, lfr_bench_cyto = {};
let str = "";
//let final_arr = [];
let executed = false;

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

// Converting array of arrays data to string representation. To be used to generate .txt docs for benchmark.
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

// Converting array of arrays data to string representation. To be used to generate .txt docs for benchmark.
function printMeta(obj) {

    let str = "";

    let keys = Object.keys(obj);
    let values = Object.values(obj);

        str += ("ST");
        str += "\t";
        str += ("Community");
        str += "\n";

    for (let j = 0; j < keys.length; j++) {

        for (let i = 0; i < 2; i++) {

            if (i === 0) {
                str += keys[j];
            } else {
                str += values[j];
            }

            str += "\t";

        }

        str += "\n";

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

// ---------------------------------------------- Application ----------------------------------------------

// Reading input file from the interface. Converting data to arrays.
function readFile(type, gamma_var, cyto, fet) {

    // fs.readFile('./uploads/Input.txt', 'utf8', function (err, data)

    if(!executed) {

        fs.readFile('./website/algorithms/benchmark/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data) {

            if (err) throw err;

            obj_lfr = [];
            obj_lfr_cyto = [];
            node_data_lfr = {};

            let split = data.toString().split("\n");

            for (let i = 0; i < split.length - 1; i++) {
                let splitLine = split[i].split("\t");
                node_data_lfr[splitLine[0]] = true;
                node_data_lfr[splitLine[1]] = true;
                obj_lfr.push(edge(splitLine[0], splitLine[1]));

                if (cyto === "true") obj_lfr_cyto.push({data: edge(splitLine[0], splitLine[1])});

            }

        });

        fs.readFile('./website/algorithms/benchmark/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data) {

            if (err) throw err;

            obj_lfr_com = {};

            let split = data.toString().split("\n");

            for (let i = 0; i < split.length - 1; i++) {
                let splitLine = split[i].split("\t");
                obj_lfr_com[splitLine[0]] = splitLine[1];
            }

            /*
            for (let i = 1; i < split.length; i++) {
                let splitLine = split[i].split("\t");
                obj_lfr_com.push(communityFunc(splitLine[0], splitLine[1]));
            }
             */

        });
        executed = true;
    }

            fs.readFile('./uploads/Input.txt', 'utf8', function (err, data) {

                if (err) throw err;

                let obj = [];
                let obj_cyto = [];
                let node_data = {};
                let community;

                let split = data.toString().split("\n");

                for (let i = 1; i < 200; i++) {
                    let splitLine = split[i].split("\t");
                    node_data[splitLine[0]] = true;
                    node_data[splitLine[1]] = true;
                    obj.push(edge(splitLine[0], splitLine[1]));

                    if (cyto === "true") obj_cyto.push({data: edge(splitLine[0], splitLine[1])});

                }

                switch (type) {

                    case 'init':
                        result_reset["nodes"] = nodify(node_data, 1);
                        result_reset["links"] = obj;

                        result_cyto_reset["nodes"] = nodify(node_data, 2);
                        result_cyto_reset["links"] = obj_cyto;

                        // karate_reset["nodes"]
                        // karate_reset["links"]

                        // karate_cyto_reset["nodes"]
                        // karate_cyto_reset["links"]

                        girvan_bench = girvan.girvanVar(0.1, false, 16); ////////////////////////////////////////////////////////
                        girvan_bench_cyto = girvan.girvanVar(0.1, true, 16);

                        lfr_bench["nodes"] = nodify(obj_lfr_com, 0);
                        lfr_bench["links"] = obj_lfr;

                        lfr_bench_cyto["nodes"] = nodify(node_data_lfr, 2);
                        lfr_bench_cyto["links"] = obj_lfr_cyto;

                        result["communities"] = girvan_bench["communities"];
                        //final_arr.push(result["communities"]);

                        break;

                    case 'louvain':

                        if (cyto === "true") {

                            switch (fet) {

                                case "GN":

                                    community = louvain.louvainVar(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = girvan_bench_cyto["links"];
                                    break;

                                case "LFR":

                                    community = louvain.louvainVar(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = obj_lfr_cyto;
                                    break;

                                case "Amazon":

                                    community = louvain.louvainVar(Object.keys(node_data), obj, gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = obj_cyto;
                                    break;

                                case "Karate":

                                    community = louvain.louvainVar(Array.from({length: 34}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = karate_cyto_reset["links"];
                                    break;

                                case "Staph":

                                    community = louvain.louvainVar(Array.from({length: phylo_reset["nodes"].length}, (v, k) => k), phylo_reset["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = phylo_cyto_reset["links"];
                            }

                        } else {

                            switch (fet) {

                                case "GN":

                                    for (let i = 0; i < 10; i++) {
                                        community = louvain.louvainVar(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);
                                        //final_arr.push(Object.values(community));
                                    }

                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = girvan_bench["links"];
                                    break;

                                case "LFR":

                                    community = louvain.louvainVar(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = obj_lfr;
                                    break;

                                case "Amazon":

                                    community = louvain.louvainVar(Object.keys(node_data), obj, gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = obj;
                                    break;

                                case "Karate":

                                    community = louvain.louvainVar(Array.from({length: karate_reset["nodes"].length}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = karate_reset["links"];
                                    break;

                                case "Staph":

                                    community = louvain.louvainVar(Array.from({length: phylo_reset["nodes"].length}, (v, k) => k), phylo_reset["links"], gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = phylo_reset["links"];
// console.log(community);
                                    fs.writeFile("./metaStaph.txt", printMeta(community));
                            }
                        }
                        break;

                    case 'infomap':

                        if (cyto === "true") {

                            switch (fet) {

                                case "GN":

                                    community = infomap.infomapVar(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = girvan_bench_cyto["links"];
                                    break;

                                case "LFR":

                                    community = infomap.infomapVar(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = obj_lfr_cyto;
                                    break;

                                case "Amazon":

                                    community = infomap.infomapVar(Object.keys(node_data), obj, gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = obj_cyto;
                                    break;

                                case "Karate":

                                    community = infomap.infomapVar(Array.from({length: karate_reset["nodes"].length}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = karate_cyto_reset["links"];
                                    break;

                                case "Staph":

                                    community = infomap.infomapVar(Array.from({length: phylo_reset["nodes"].length}, (v, k) => k), phylo_reset["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = phylo_cyto_reset["links"];
                            }

                        } else {

                            switch (fet) {

                                case "GN":

                                    community = infomap.infomapVar(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = girvan_bench["links"];
                                    break;

                                case "LFR":

                                    community = infomap.infomapVar(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = obj_lfr;
                                    break;

                                case "Amazon":

                                    community = infomap.infomapVar(Object.keys(node_data), obj, gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = obj;
                                    break;

                                case "Karate":

                                    community = infomap.infomapVar(Array.from({length: karate_reset["nodes"].length}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = karate_reset["links"];
                                    break;

                                case "Staph":

                                    community = infomap.infomapVar(Array.from({length: phylo_reset["nodes"].length}, (v, k) => k), phylo_reset["links"], gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = phylo_reset["links"];
                            }
                        }

                        break;

                    case 'llp':

                        if (cyto === "true") {

                            switch (fet) {

                                case "GN":

                                    community = layeredLabelPropagation.layeredLabelPropagationVar(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = girvan_bench_cyto["links"];
                                    break;

                                case "LFR":

                                    community = layeredLabelPropagation.layeredLabelPropagationVar(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = obj_lfr_cyto;
                                    break;

                                case "Amazon":

                                    community = layeredLabelPropagation.layeredLabelPropagationVar(Object.keys(node_data), obj, gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = obj_cyto;
                                    break;

                                case "Karate":

                                    community = layeredLabelPropagation.layeredLabelPropagationVar(Array.from({length: karate_reset["nodes"].length}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = karate_cyto_reset["links"];
                                    break;

                                case "Staph":

                                    community = layeredLabelPropagation.layeredLabelPropagationVar(Array.from({length: phylo_reset["nodes"].length}, (v, k) => k), phylo_reset["links"], gamma_var);
                                    result_cyto["nodes"] = nodify(community, 3);
                                    result_cyto["links"] = phylo_cyto_reset["links"];
                            }

                        } else {

                            switch (fet) {

                                case "GN":

                                    for (let i = 0; i < 10; i++) {
                                        community = layeredLabelPropagation.layeredLabelPropagationVar(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var, 10000);
                                        //final_arr.push(Object.values(community));
                                    }

                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = girvan_bench["links"];
                                    //    fs.writeFile("./girvanLouvain.txt", str);
                                    break;

                                case "LFR":

                                    community = layeredLabelPropagation.layeredLabelPropagationVar(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = obj_lfr;
                                    break;

                                case "Amazon":

                                    community = layeredLabelPropagation.layeredLabelPropagationVar(Object.keys(node_data), obj, gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = obj;
                                    break;

                                case "Karate":

                                    community = layeredLabelPropagation.layeredLabelPropagationVar(Array.from({length: karate_reset["nodes"].length}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = karate_reset["links"];
                                    break;

                                case "Staph":

                                    community = layeredLabelPropagation.layeredLabelPropagationVar(Array.from({length: phylo_reset["nodes"].length}, (v, k) => k), phylo_reset["links"], gamma_var);
                                    result["nodes"] = nodify(community, 0);
                                    result["links"] = phylo_reset["links"];
                            }
                        }
                }
        });
}

// Initial state of the application.
readFile('init', 0, "true", "");

// Sending data back to interface that resulted from community finding process.
app.get('/run/:id', function (req, res) {

    if(req.params.id === "Cytoscape") {
        res.send(result_cyto);

    } else {
        res.send(result);
    }
/*
    arrayToString(final_arr);
    fs.writeFile("./website/benchmark_data/llp_vs_gamma/mix_0.6/llp_gamma0.5_mix0.6.txt", str); ////////////////////////////////////////////////////////////////
    //    fs.writeFile("./girvanLouvain.txt", arrayToString(result["communities"]));
    */

});

// Resetting the application by clicking in the corresponding button in the interface.
app.get('/reset/:alg/cytoscape/:cyto', function (req, res) {

    if (req.params.cyto === "false") {

        switch (req.params.alg) {

            case "GN":

                res.send(girvan_bench);
                break;

            case "LFR":

                res.send(lfr_bench);
                break;

            case "Amazon":

                res.send(result_reset);
                break;

            case "Karate":

                res.send(karate_reset);
                break;

            case "Staph":

                res.send(phylo_reset);
        }

    } else {

        switch (req.params.alg) {

            case "GN":

                res.send(girvan_bench_cyto);
                break;

            case "LFR":

                res.send(lfr_bench_cyto);
                break;

            case "Amazon":

                res.send(result_cyto_reset);
                break;

            case "Karate":

                res.send(karate_cyto_reset);
                break;

            case "Staph":

                res.send(phylo_cyto_reset);
        }
    }
});

// Sending data to community finding analysis. It will be dependent on the algorithm used, respective variable parameters, data visualization framework and network under study.
app.get('/algorithm/:type/gamma/:val/cytoscape/:cyto/fetchy/:fet', function (req, res) {

    readFile(req.params.type, req.params.val, req.params.cyto, req.params.fet);

    res.send();
});

// To be executed upon file upload in the interface.
app.post('/upload', function (req, res) {

    let form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/uploads/' + "Input2.txt"; // file.name substituted by Input.txt
    });

});

fs.readFile('./uploads/clonalComplex.txt', 'utf8', function (err, data) {

    if (err) throw err;

    let node_data = {};
    let split = data.toString().split("\n");

    for (let i = 1; i < split.length; i++) {
        let splitLine = split[i].split("\t");
        node_data[splitLine[1]] = true;
    }

    let include_data = Object.keys(node_data);

    fs.readFile('./uploads/phylo.txt', 'utf8', function (err, data) {

        if (err) throw err;

        let obj = [];
        split = data.toString().split("\n");

        for (let i = 1; i < split.length; i++) {
            let splitLine = split[i].split("\t");
            if(searchy(splitLine[0], include_data)) {
                obj[i - 1] = [];
                for (let j = 1; j < splitLine.length; j++) {
                    obj[i - 1].push(Number(splitLine[j]));
                }
            }
        }

        let filtered_obj = obj.filter(function (el) {
            return el != null;
        });

        phylo_reset = hamming.hammingVar(filtered_obj, 1, false);
        phylo_cyto_reset = hamming.hammingVar(filtered_obj, 1, true);

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