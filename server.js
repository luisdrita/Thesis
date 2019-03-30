// ---------------------------------------------- Global Variables ----------------------------------------------

// Importing general libraries.
const fs = require('fs');
const express = require('express');
const formidable = require('formidable');
const cmd = require('node-cmd');
// const fileExists = require('file-exists');

// Importing community finding libraries.
const infomap = require('./website/algorithms/infomap');
const louvain = require('./website/algorithms/louvain');
const layeredLabelPropagation = require('./website/algorithms/layeredLabelPropagation');
const hamming = require('./website/algorithms/hamming');

// Importing benchmarking libraries.
const girvan = require('./website/algorithms/girvan-newman');

// Importing auxiliary functions.
const aux = require('./auxFunctions');

const app = express();

app.use(express.static('website'));
app.listen(process.env.PORT || 3000);

// Initializing global variables.
let result = {}, result_reset = {}, result_cyto = {}, result_cyto_reset = {}, phylo_reset = {}, phylo_cyto_reset = {},
girvan_bench = {}, girvan_bench_cyto = {}, lfr_bench = {}, lfr_bench_cyto = {}, karate_reset = {}, karate_cyto_reset = {};

// Initializing benchmark variables.
let str = "", final_arr = [], final_arr_titles = [];

// ---------------------------------------------- Application ----------------------------------------------

// Reading input file from the interface. Converting data to arrays.
function readFile(type, gamma_var, cyto, net) {

    let community;
  //  final_arr.push(result["communities"]);

                switch (type) {

                    case 'Louvain':

                        if (cyto === "true") {

                            switch (net) {

                                case "GN":

                                    community = louvain.jLouvain(aux.nodeDetection(girvan_bench_cyto["nodes"], 0), girvan_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = girvan_bench_cyto["links"];
                                    break;

                                case "LFR":

                                    community = louvain.jLouvain(aux.nodeDetection(lfr_bench_cyto["nodes"], 0), lfr_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = lfr_bench_cyto["links"];
                                    break;

                                case "Amazon":

                                    community = louvain.jLouvain(aux.nodeDetection(result_cyto_reset["nodes"], 0), result_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = result_cyto_reset["links"];
                                    break;

                                case "Karate":

                                    community = louvain.jLouvain(aux.nodeDetection(karate_cyto_reset["nodes"], 0), karate_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = karate_cyto_reset["links"];
                                    break;

                                case "Staph":

                                    community = louvain.jLouvain(aux.nodeDetection(phylo_cyto_reset["nodes"], 0), phylo_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = phylo_cyto_reset["links"];
                            }

                        } else {

                            switch (net) {

                                case "GN":

                                    community = louvain.jLouvain(aux.nodeDetection(girvan_bench["nodes"], 1), girvan_bench["links"], gamma_var);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("Louvain GN");
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = girvan_bench["links"];
                                    break;

                                case "LFR":

                                    community = louvain.jLouvain(aux.nodeDetection(lfr_bench["nodes"], 1), lfr_bench["links"], gamma_var);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("Louvain LFR");
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = lfr_bench["links"];
                                    break;

                                case "Amazon":

                                    community = louvain.jLouvain(aux.nodeDetection(result_reset["nodes"], 1), result_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = result_reset["links"];
                                    break;

                                case "Karate":

                                    community = louvain.jLouvain(aux.nodeDetection(karate_reset["nodes"], 1), karate_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = karate_reset["links"];
                                    console.log(result["links"]);
                                    break;

                                case "Staph":

                                    community = louvain.jLouvain(aux.nodeDetection(phylo_reset["nodes"], 1), phylo_reset["links"], gamma_var);

                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = phylo_reset["links"];
                                    console.log(result["links"]);
                                //    fs.writeFile("./metaStaph.txt", aux.printMeta(community, length_var)); // length_var = split.length
                            }
                        }
                        break;

                    case 'Infomap':

                        if (cyto === "true") {

                            switch (net) {

                                case "GN":

                                    community = infomap.jInfomap(aux.nodeDetection(girvan_bench_cyto["nodes"], 0), girvan_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = girvan_bench_cyto["links"];
                                    break;

                                case "LFR":

                                    community = infomap.jInfomap(aux.nodeDetection(lfr_bench_cyto["nodes"], 0), lfr_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = lfr_bench_cyto["links"];
                                    break;

                                case "Amazon":

                                    community = infomap.jInfomap(aux.nodeDetection(result_cyto_reset["nodes"], 0), result_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = result_cyto_reset["links"];
                                    break;

                                case "Karate":

                                    community = infomap.jInfomap(aux.nodeDetection(karate_cyto_reset["nodes"], 0), karate_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = karate_cyto_reset["links"];
                                    break;

                                case "Staph":

                                    community = infomap.jInfomap(aux.nodeDetection(phylo_cyto_reset["nodes"], 0), phylo_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = phylo_cyto_reset["links"];
                            }

                        } else {

                            switch (net) {

                                case "GN":

                                    community = infomap.jInfomap(aux.nodeDetection(girvan_bench["nodes"], 1), girvan_bench["links"], gamma_var);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("Infomap GN");
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = girvan_bench["links"];
                                    break;

                                case "LFR":

                                    community = infomap.jInfomap(aux.nodeDetection(lfr_bench["nodes"], 1), lfr_bench["links"], gamma_var);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("Infomap LFR");
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = lfr_bench["links"];
                                    break;

                                case "Amazon":

                                    community = infomap.jInfomap(aux.nodeDetection(result_reset["nodes"], 1), result_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = result_reset["links"];
                                    break;

                                case "Karate":

                                    community = infomap.jInfomap(aux.nodeDetection(karate_reset["nodes"], 1), karate_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = karate_reset["links"];
                                    break;

                                case "Staph":

                                    community = infomap.jInfomap(aux.nodeDetection(phylo_reset["nodes"], 1), phylo_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = phylo_reset["links"];
                            }
                        }

                        break;

                    case 'LLP':

                        if (cyto === "true") {

                            switch (net) {

                                case "GN":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(girvan_bench_cyto["nodes"], 0), girvan_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = girvan_bench_cyto["links"];
                                    break;

                                case "LFR":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(lfr_bench_cyto["nodes"], 0), lfr_bench["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = lfr_bench_cyto["links"];
                                    break;

                                case "Amazon":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(result_cyto_reset["nodes"], 0), result_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = result_cyto_reset["links"];
                                    break;

                                case "Karate":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(karate_cyto_reset["nodes"], 0), karate_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = karate_cyto_reset["links"];
                                    break;

                                case "Staph":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(phylo_cyto_reset["nodes"], 0), phylo_reset["links"], gamma_var);
                                    result_cyto["nodes"] = aux.nodify(community, 3);
                                    result_cyto["links"] = phylo_cyto_reset["links"];
                            }

                        } else {

                            switch (net) {

                                case "GN":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(girvan_bench["nodes"], 1), girvan_bench["links"], gamma_var, 10000);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("LLP GN" + gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = girvan_bench["links"];
                                    //    fs.writeFile("./girvanLouvain.txt", str);
                                    break;

                                case "LFR":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(lfr_bench["nodes"], 1), lfr_bench["links"], gamma_var);
                                    final_arr.push(Object.values(community));
                                    final_arr_titles.push("LLP LFR" + gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = lfr_bench["links"];
                                    break;

                                case "Amazon":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(result_reset["nodes"], 1), result_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = result_reset["links"];
                                    break;

                                case "Karate":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(karate_reset["nodes"], 1), karate_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = karate_reset["links"];
                                    break;

                                case "Staph":

                                    community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(phylo_reset["nodes"], 1), phylo_reset["links"], gamma_var);
                                    result["nodes"] = aux.nodify(community, 0);
                                    result["links"] = phylo_reset["links"];
                            }
                        }
                }
}

// Sending data back to interface that resulted from community finding process.
app.get('/run/:inter', function (req, res) {

    if(req.params.inter === "Cytoscape") {
        res.send(result_cyto);

    } else {
        res.send(result);
    }

   // console.log(final_arr);
//console.log(final_arr_titles);
//    str = aux.arrayToString(final_arr, str, final_arr_titles);
 //   fs.writeFile("./print.txt", str);
    //    fs.writeFile("./girvanLouvain.txt", arrayToString(result["communities"]));

});

// Resetting the application by clicking in the corresponding button in the interface.
app.get('/reset/:alg/cytoscape/:cyto/mix_param/:mix/avg_deg/:deg/net_size/:sizee', function (req, res) {

    if (req.params.cyto === "false") {

        switch (req.params.alg) {

            case "GN":
                girvan_bench = girvan.jGirvan_Newman(req.params.mix, false, req.params.deg);
             //   result["communities"] = girvan_bench["communities"];
                res.send(girvan_bench);
                break;

            case "LFR":

                cmd.get(
                    `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            ./benchmark -N ${req.params.sizee} -k ${req.params.deg} -maxk 50 -mu ${req.params.mix} -minc 20 -maxc 50
        `,
                    function () { // err, data, stderr

                        fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data) {

                            if (err) throw err;

                            let obj_lfr = [];
                            let node_data_lfr = {};

                            let split = data.toString().split("\n");

                            for (let i = 0; i < split.length - 1; i++) {
                                let splitLine = split[i].split("\t");
                                node_data_lfr[splitLine[0]] = true;
                                node_data_lfr[splitLine[1]] = true;
                                obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));

                            }

                            fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data) {

                                if (err) throw err;

                                let obj_lfr_com = {};

                                let split = data.toString().split("\n");

                                for (let i = 0; i < split.length - 1; i++) {
                                    let splitLine = split[i].split("\t");
                                    obj_lfr_com[splitLine[0]] = splitLine[1];
                                }

                                lfr_bench["nodes"] = aux.nodify(obj_lfr_com, 0);
                                lfr_bench["links"] = obj_lfr;

                                res.send(lfr_bench);

                            });
                        });
                    });


                break;

            case "Amazon":

                fs.readFile('./uploads/amazon.txt', 'utf8', function (err, data) {

                    if (err) throw err;

                    let obj = [];
                    let node_data = {};

                    let split = data.toString().split("\n");

                    for (let i = 1; i < 200; i++) {
                        let splitLine = split[i].split("\t");
                        node_data[splitLine[0]] = true;
                        node_data[splitLine[1]] = true;
                        obj.push(aux.edge(splitLine[0], splitLine[1]));

                    }

                    result_reset["nodes"] = aux.nodify(node_data, 1);
                    result_reset["links"] = obj;
                    res.send(result_reset);
                });

                break;

            case "Karate":

                // Importing Zachary's karate club network. Supporting Cytoscape.js and D3.js representation.
                karate_reset = require('./uploads/karate_club.json');
                res.send(karate_reset);
                break;

            case "Staph":

                fs.readFile('./uploads/clonalComplex.txt', 'utf8', function (err, data) {

                    if (err) throw err;

                    let node_data = {};
                    let split = data.toString().split("\n");

                    for (let i = 1; i < split.length; i++) {
                        let splitLine = split[i].split(" ");
                        node_data[splitLine[1]] = true;
                    }

                    let include_data = Object.keys(node_data);

                    fs.readFile('./uploads/phylo.txt', 'utf8', function (err, data) {

                        if (err) throw err;

                        let obj = [];
                        split = data.toString().split("\n");

                        for (let i = 1; i < split.length; i++) {
                            let splitLine = split[i].split("\t");
                            if(aux.searchy(splitLine[0], include_data)) {
                                obj[i - 1] = [];
                                for (let j = 1; j < splitLine.length; j++) {
                                    obj[i - 1].push(Number(splitLine[j]));
                                }
                            }
                        }

                        phylo_reset = hamming.jHamming(obj, 1, false);
                        res.send(phylo_reset);

                    });
                });
        }

    } else {

        switch (req.params.alg) {

            case "GN":

                girvan_bench_cyto = girvan.jGirvan_Newman(req.params.mix, true, req.params.deg);
            //    result["communities"] = girvan_bench["communities"];
                res.send(girvan_bench_cyto);
                break;

            case "LFR":

                cmd.get(
                    `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            ./benchmark -N ${req.params.sizee} -k ${req.params.deg} -maxk 50 -mu ${req.params.mix} -minc 20 -maxc 50
        `,
                    function () { // err, data, stderr

                        fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data) {

                            if (err) throw err;

                            let obj_lfr_cyto = [];
                            let obj_lfr = [];
                            let node_data_lfr = {};

                            let split = data.toString().split("\n");

                            for (let i = 0; i < split.length - 1; i++) {
                                let splitLine = split[i].split("\t");
                                node_data_lfr[splitLine[0]] = true;
                                node_data_lfr[splitLine[1]] = true;
                                obj_lfr_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});
                                obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));
                            }

                            fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data) {

                                if (err) throw err;

                                let obj_lfr_com = {};

                                let split = data.toString().split("\n");

                                for (let i = 0; i < split.length - 1; i++) {
                                    let splitLine = split[i].split("\t");
                                    obj_lfr_com[splitLine[0]] = Number(splitLine[1]);
                                }

                                lfr_bench_cyto["nodes"] = aux.nodify(obj_lfr_com, 3);
                                lfr_bench_cyto["links"] = obj_lfr_cyto;
                                lfr_bench["links"] = obj_lfr;

                                res.send(lfr_bench_cyto);

                            });
                    });
                    });

                break;

            case "Amazon":

                fs.readFile('./uploads/amazon.txt', 'utf8', function (err, data) {

                    if (err) throw err;

                    let obj_cyto = [];
                    let obj = [];
                    let node_data = {};

                    let split = data.toString().split("\n");

                    for (let i = 1; i < 200; i++) {
                        let splitLine = split[i].split("\t");
                        node_data[splitLine[0]] = true;
                        node_data[splitLine[1]] = true;
                        obj_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});
                        obj.push(aux.edge(splitLine[0], splitLine[1]));
                    }

                    result_cyto_reset["nodes"] = aux.nodify(node_data, 2);
                    result_cyto_reset["links"] = obj_cyto;
                    result_reset["links"] = obj;
                    res.send(result_cyto_reset);
                });

                break;

            case "Karate":

                // Importing Zachary's karate club network. Supporting Cytoscape.js and D3.js representation.
                karate_reset = require('./uploads/karate_club.json');
                karate_cyto_reset = require('./uploads/karate_club_cyto.json');
                res.send(karate_cyto_reset);
                break;

            case "Staph":

                fs.readFile('./uploads/clonalComplex.txt', 'utf8', function (err, data) {

                    if (err) throw err;

                    let node_data = {};
                    let split = data.toString().split("\n");

                    for (let i = 1; i < split.length; i++) {
                        let splitLine = split[i].split(" ");
                        node_data[splitLine[1]] = true;
                    }

                    let include_data = Object.keys(node_data);

                    fs.readFile('./uploads/phylo.txt', 'utf8', function (err, data) {

                        if (err) throw err;

                        let obj = [];
                        split = data.toString().split("\n");

                        for (let i = 1; i < split.length; i++) { // length_var = split.length
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
                        res.send(phylo_cyto_reset);

                    });
                });
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
        file.path = __dirname + '/uploads/' + "upload.txt"; // file.name substituted by Input.txt
    });

});

// ---------------------------------------------- Benchmark ----------------------------------------------
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