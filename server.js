// ---------------------------------------------- Global Variables ----------------------------------------------

// Importing general libraries.
const fs = require('fs');
const express = require('express');
const formidable = require('formidable');
const cmd = require('node-cmd');

// Importing community finding libraries.
const infomap = require('./website/algorithms/infomap');
const louvain = require('./website/algorithms/louvain');
const layeredLabelPropagation = require('./website/algorithms/layeredLabelPropagation');
const hamming = require('./website/algorithms/hamming');

// Importing benchmarking libraries.
const girvan = require('./website/algorithms/girvan-newman');

// Importing auxiliary functions.
const aux = require('./auxFunctions');

// Importing Zachary's karate club network. Supporting Cytoscape.js and D3.js representation.
const karate_reset = require('./uploads/karate_club.json');
const karate_cyto_reset = require('./uploads/karate_club_cyto.json');

const app = express();

app.use(express.static('website'));
app.listen(process.env.PORT || 3000);

// Initializing global variables.
let result = {}, result_reset = {}, result_cyto = {}, result_cyto_reset = {}, phylo_reset = {}, phylo_cyto_reset = {};
let node_data_lfr, obj_lfr_com, obj_lfr, obj_lfr_cyto, girvan_bench = {}, girvan_bench_cyto = {}, lfr_bench = {}, lfr_bench_cyto = {};
let str = "";
let length_var;
let final_arr = [];
let final_arr_titles = [];
let executed = false;

// ---------------------------------------------- Application ----------------------------------------------

// Reading input file from the interface. Converting data to arrays.
function readFile(type, gamma_var, cyto, fet) {

    // fs.readFile('./uploads/Input.txt', 'utf8', function (err, data)

    if(!executed) {
/*
        let a = 15;
        let b = 1000;

        cmd.run(
            `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            ./benchmark -N ${b} -k ${a} -maxk 50 -mu 0.1 -minc 20 -maxc 50
        `
        );
*/
        fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data) {

            if (err) throw err;

            obj_lfr = [];
            obj_lfr_cyto = [];
            node_data_lfr = {};

            let split = data.toString().split("\n");

            for (let i = 0; i < split.length - 1; i++) {
                let splitLine = split[i].split("\t");
                node_data_lfr[splitLine[0]] = true;
                node_data_lfr[splitLine[1]] = true;
                obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));

                if (cyto === "true") obj_lfr_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});

            }

        });

        fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data) {

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

            fs.readFile('./uploads/amazon.txt', 'utf8', function (err, data) {

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
                    obj.push(aux.edge(splitLine[0], splitLine[1]));

                    if (cyto === "true") obj_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});

                }

                switch (type) {

                    case 'init':
                        result_reset["nodes"] = aux.nodify(node_data, 1);
                        result_reset["links"] = obj;

                        result_cyto_reset["nodes"] = aux.nodify(node_data, 2);
                        result_cyto_reset["links"] = obj_cyto;

                        // karate_reset["nodes"]
                        // karate_reset["links"]

                        // karate_cyto_reset["nodes"]
                        // karate_cyto_reset["links"]

                        girvan_bench = girvan.jGirvan_Newman(0.1, false, 16);
                        girvan_bench_cyto = girvan.jGirvan_Newman(0.1, true, 16);

                        lfr_bench["nodes"] = aux.nodify(obj_lfr_com, 0);
                        lfr_bench["links"] = obj_lfr;

                        lfr_bench_cyto["nodes"] = aux.nodify(node_data_lfr, 2);
                        lfr_bench_cyto["links"] = obj_lfr_cyto;

                        result["communities"] = girvan_bench["communities"];
                        final_arr.push(result["communities"]);

                        break;

                    case 'louvain':

                        if (cyto === "true") {

                            switch (fet) {

                                case "GN":

                                    community = louvain.jLouvain(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = girvan_bench_cyto["links"];
                                    break;

                                case "LFR":

                                    community = louvain.jLouvain(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = obj_lfr_cyto;
                                    break;

                                case "Amazon":

                                    community = louvain.jLouvain(Object.keys(node_data), obj, gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = obj_cyto;
                                    break;

                                case "Karate":

                                    community = louvain.jLouvain(Array.from({length: 34}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = karate_cyto_reset["links"];
                                    break;

                                case "Staph":

                                    community = louvain.jLouvain(Array.from({length: phylo_reset["nodes"].length}, (v, k) => k), phylo_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = phylo_cyto_reset["links"];
                            }

                        } else {

                            switch (fet) {

                                case "GN":

                                    community = louvain.jLouvain(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("Louvain GN");
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = girvan_bench["links"];
                                    break;

                                case "LFR":

                                    community = louvain.jLouvain(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("Louvain LFR");
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = obj_lfr;
                                    break;

                                case "Amazon":

                                    community = louvain.jLouvain(Object.keys(node_data), obj, gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = obj;
                                    break;

                                case "Karate":

                                    community = louvain.jLouvain(Array.from({length: karate_reset["nodes"].length}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = karate_reset["links"];
                                    break;

                                case "Staph":

                                    community = louvain.jLouvain(aux.nodeDetection(phylo_reset["nodes"]), phylo_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = phylo_reset["links"];
 //console.log(community);
                                    fs.writeFile("./metaStaph.txt", aux.printMeta(community, length_var));
                            }
                        }
                        break;

                    case 'infomap':

                        if (cyto === "true") {

                            switch (fet) {

                                case "GN":

                                    community = infomap.jInfomap(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = girvan_bench_cyto["links"];
                                    break;

                                case "LFR":

                                    community = infomap.jInfomap(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = obj_lfr_cyto;
                                    break;

                                case "Amazon":

                                    community = infomap.jInfomap(Object.keys(node_data), obj, gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = obj_cyto;
                                    break;

                                case "Karate":

                                    community = infomap.jInfomap(Array.from({length: karate_reset["nodes"].length}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = karate_cyto_reset["links"];
                                    break;

                                case "Staph":

                                    community = infomap.jInfomap(Array.from({length: phylo_reset["nodes"].length}, (v, k) => k), phylo_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = phylo_cyto_reset["links"];
                            }

                        } else {

                            switch (fet) {

                                case "GN":

                                    community = infomap.jInfomap(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("Infomap GN");
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = girvan_bench["links"];
                                    break;

                                case "LFR":

                                    community = infomap.jInfomap(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("Infomap LFR");
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = obj_lfr;
                                    break;

                                case "Amazon":

                                    community = infomap.jInfomap(Object.keys(node_data), obj, gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = obj;
                                    break;

                                case "Karate":

                                    community = infomap.jInfomap(Array.from({length: karate_reset["nodes"].length}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = karate_reset["links"];
                                    break;

                                case "Staph":

                                    community = infomap.jInfomap(Array.from({length: phylo_reset["nodes"].length}, (v, k) => k), phylo_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = phylo_reset["links"];
                            }
                        }

                        break;

                    case 'llp':

                        if (cyto === "true") {

                            switch (fet) {

                                case "GN":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = girvan_bench_cyto["links"];
                                    break;

                                case "LFR":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = obj_lfr_cyto;
                                    break;

                                case "Amazon":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(Object.keys(node_data), obj, gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = obj_cyto;
                                    break;

                                case "Karate":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(Array.from({length: karate_reset["nodes"].length}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = karate_cyto_reset["links"];
                                    break;

                                case "Staph":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(Array.from({length: phylo_reset["nodes"].length}, (v, k) => k), phylo_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = phylo_cyto_reset["links"];
                            }

                        } else {

                            switch (fet) {

                                case "GN":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(Object.keys(girvan_bench["nodes"]), girvan_bench["links"], gamma_var, 10000);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("LLP GN" + gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = girvan_bench["links"];
                                    //    fs.writeFile("./girvanLouvain.txt", str);
                                    break;

                                case "LFR":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(Object.keys(node_data_lfr), lfr_bench["links"], gamma_var);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("LLP LFR" + gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = obj_lfr;
                                    break;

                                case "Amazon":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(Object.keys(node_data), obj, gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = obj;
                                    break;

                                case "Karate":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(Array.from({length: karate_reset["nodes"].length}, (v, k) => k + 1), karate_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = karate_reset["links"];
                                    break;

                                case "Staph":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(phylo_reset["nodes"]), phylo_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
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

   // console.log(final_arr);
console.log(final_arr_titles);
    str = aux.arrayToString(final_arr, str, final_arr_titles);
    fs.writeFile("./print.txt", str);
    //    fs.writeFile("./girvanLouvain.txt", arrayToString(result["communities"]));

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
console.log(req.params.val);
    readFile(req.params.type, req.params.val, req.params.cyto, req.params.fet);

    res.send();
});

// To be executed upon file upload in the interface.
app.post('/upload', function (req, res) {

    let form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/uploads/' + "upload.txt"; // file.name substituted by Input.txt
    });

});

// ---------------------------------------------- PHYLOViZ Data Upload ----------------------------------------------

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
        length_var = split.length;

        for (let i = 1; i < length_var; i++) {
            let splitLine = split[i].split("\t");
            if(aux.searchy(splitLine[0], include_data)) {
                obj[i - 1] = [];
                for (let j = 1; j < splitLine.length; j++) {
                    obj[i - 1].push(Number(splitLine[j]));
                }
            }
        }

        phylo_reset = hamming.jHamming(obj, 1, false);
        phylo_cyto_reset = hamming.jHamming(obj, 1, true);

    });
});

// ---------------------------------------------- Benchmark ----------------------------------------------
//heroku logs --tail
/*
let file1 = "one.dat";
let file2 = "two.dat";

function runBenchmark() {

    cmd.get(
        `
            cd ./website/algorithms/nmi
            ./mutual ${file1} ${file2}
        `,
        function(err, data, stderr){

            if (err) throw console.log('error', err);

            console.log(Number(data.split("\t")[1]));

        }
    );
}

runBenchmark();

 */

// readFile("Louvain", 1/10000, "false", "GN");
// readFile("Infomap", 1/10000, "false", "GN");

/*
function ola () {
    for (let i = 0; i < 11; i++) {
        readFile('llp', i/10, "false", "Girvan");
        console.log(str);
    }

    fs.writeFile("./girvanLouvain.txt", str);
}
*/