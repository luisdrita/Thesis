// ---------------------------------------------- Global Variables ----------------------------------------------

// Importing general libraries.
const fs = require('fs');
const express = require('express');
const formidable = require('formidable');
const cmd = require('node-cmd');
const {performance} = require('perf_hooks');


// Importing community finding libraries.
const infomap = require('./website/algorithms/infomap');
const louvain = require('./website/algorithms/louvain');
const layeredLabelPropagation = require('./website/algorithms/layeredLabelPropagation');
const hamming = require('./website/algorithms/hamming');
const nmi = require('./website/algorithms/nmi');

// Importing benchmarking libraries.
const girvan = require('./website/algorithms/girvan-newman');

// Importing auxiliary functions.
const aux = require('./auxFunctions');

const app = express();

app.use(express.static('website'));
app.listen(process.env.PORT || 3000);

// Initializing global variables.
let result = {}, result_cyto = {}, mother_result = {};

// Initializing benchmarking variables.
let str = "", final_arr = [], final_arr_titles = [], final_times = {}, ij = 0;

// ---------------------------------------------- APPLICATION ----------------------------------------------

// Reading input file from the interface. Converting data to arrays.
function readFile(alg, gamma_var, cyto, net, mix, avg_deg) {

    let community;

    switch (alg) {

        case 'Louvain':

            if (cyto === "true") {

                community = louvain.jLouvain(aux.nodeDetection(result_cyto["nodes"], 0), result["links"], gamma_var);
                result_cyto["nodes"] = aux.nodify(community, 3);
                result_cyto["links"] = result_cyto["links"];

            } else {

                // ---------------------------- NMI x Mix Parameter
/*
                community = louvain.jLouvain(aux.nodeDetection(mother_result[mix]["nodes"], 1), mother_result[mix]["links"], 1/10000);
                final_arr.push(Object.values(community));
                final_arr_titles.push("Louvain" + "_" + net + "_" + mix + "_" + ij);
                ij++;
                result["nodes"] = aux.nodify(community, 0);
                result["links"] = mother_result[mix]["links"];
*/
                // ---------------------------- Label Propagation NMI x Mix Parameter

                community = louvain.jLouvain(aux.nodeDetection(mother_result[mix + "_" + avg_deg]["nodes"], 1), mother_result[mix + "_" + avg_deg]["links"], 1/10000);
                final_arr.push(Object.values(community));
                final_arr_titles.push("Louvain" + "_" + net + "_" + mix + "_" + avg_deg + "_" + ij);
                ij++;
                result["nodes"] = aux.nodify(community, 0);
                result["links"] = mother_result[mix + "_" + avg_deg]["links"];

                console.log(ij);

            }

            break;

        case 'Infomap':

            if (cyto === "true") {

                community = infomap.jInfomap(aux.nodeDetection(result_cyto["nodes"], 0), result["links"], gamma_var);
                result_cyto["nodes"] = aux.nodify(community, 3);
                result_cyto["links"] = result_cyto["links"];

            } else {

                // ---------------------------- NMI x Mix Parameter

                community = infomap.jInfomap(aux.nodeDetection(mother_result[mix]["nodes"], 1), mother_result[mix]["links"], 1/10000);
                final_arr.push(Object.values(community));
                final_arr_titles.push("Infomap" + "_" + net + "_" + mix + "_" + ij);
                ij++;
                result["nodes"] = aux.nodify(community, 0);
                result["links"] = mother_result[mix]["links"];

                // ---------------------------- Label Propagation NMI x Mix Parameter

                community = infomap.jInfomap(aux.nodeDetection(mother_result[mix + "_" + avg_deg]["nodes"], 1), mother_result[mix + "_" + avg_deg]["links"], 1/10000);
                final_arr.push(Object.values(community));
                final_arr_titles.push("Infomap" + "_" + net + "_" + mix + "_" + avg_deg + "_" + ij);
                ij++;
                result["nodes"] = aux.nodify(community, 0);
                result["links"] = mother_result[mix + "_" + avg_deg]["links"];

            }

            break;

        case 'LLP':

            if (cyto === "true") {

                community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(result_cyto["nodes"], 0), result["links"], gamma_var);
                result_cyto["nodes"] = aux.nodify(community, 3);
                result_cyto["links"] = result_cyto["links"];

            } else {

                // ---------------------------- NMI x Mix Parameter
/*
                community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(mother_result[mix]["nodes"], 1), mother_result[mix]["links"], gamma_var, 10000);
                final_arr.push(Object.values(community));
                final_arr_titles.push("LLP" + "_" + net + "_" + gamma_var + "_" + mix + "_" + ij);
                ij++;
                result["nodes"] = aux.nodify(community, 0);
                result["links"] = mother_result[mix]["links"];
*/
                // ---------------------------- Label Propagation NMI x Mix Parameter

                community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(mother_result[mix + "_" + avg_deg]["nodes"], 1), mother_result[mix + "_" + avg_deg]["links"], 0, 10000);
                final_arr.push(Object.values(community));
                final_arr_titles.push("LLP" + "_" + net + "_" + gamma_var + "_" + mix + "_" + avg_deg + "_" + ij);
                ij++;
                result["nodes"] = aux.nodify(community, 0);
                result["links"] = mother_result[mix + "_" + avg_deg]["links"];
            }
    }
}

// ---------------------------------------------- RUN ----------------------------------------------

// Sending data back to interface that resulted from community finding process.
app.get('/run/:inter', function (req, res) {

    if(req.params.inter === "Cytoscape") {

        res.send(result_cyto);

    } else {

        res.send(result);

    }

    str = aux.arrayToString(final_arr, str, final_arr_titles);
    fs.writeFile("./print.txt", str);

});

// ---------------------------------------------- RESET ----------------------------------------------

// Resetting the application by clicking in the corresponding button in the interface.
app.get('/reset/:alg/cytoscape/:cyto/mix_param/:mix/avg_deg/:deg/net_size/:size/max_deg/:maxk/min_com/:minc/max_com/:maxc', function (req, res) {

        switch (req.params.alg) {

            case "GN":

        //        result = girvan.jGirvan_Newman(req.params.mix, false, req.params.deg);
                //mother_result[req.params.mix] = result;

                // ---------------------------- NMI x Mix Parameter
/*
                [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (mix_param) {

                    console.log(mix_param);

                    result = girvan.jGirvan_Newman(mix_param, false, 16);
                    mother_result[mix_param] = result;

                    final_arr.push(result["communities"]);
                    final_arr_titles.push("GN_Bench" + "_" + mix_param);

                });
*/
                // ---------------------------- LP/LLP/Louvain/Infomap NMI x Mix Parameter

                [15].map(function (avg_deg) {

                    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (mix_param) {
                        let t1 = performance.now();
                        console.log(mix_param);

                        result = girvan.jGirvan_Newman(mix_param, false, avg_deg);
                        mother_result[mix_param + "_" + avg_deg] = result;

                        final_arr.push(result["communities"]);
                        final_arr_titles.push("GN_Bench" + "_" + mix_param + "_" + avg_deg);

                        let t2 = performance.now();
                        final_times["GN_Bench" + "_" + mix_param + "_" + avg_deg] = (t2-t1);

                    });

                });

                if(req.params.cyto !== "false")  {

                    result_cyto = girvan.jGirvan_Newman(req.params.mix, true, req.params.deg);
                    res.send(result_cyto)

                } else {

                    res.send(result);

                }

                break;

            case "LFR":

                [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (mix_param) {

                    console.log(mix_param);

                    cmd.get(
                        `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            ./benchmark -N ${req.params.size} -k ${req.params.deg} -maxk ${req.params.maxk} -mu ${mix_param} -minc ${req.params.minc} -maxc ${req.params.maxc}
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
                                    obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));
                                    obj_lfr_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});

                                }

                                fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data) {

                                    if (err) throw err;

                                    let obj_lfr_com = {};

                                    let split = data.toString().split("\n");

                                    for (let i = 0; i < split.length - 1; i++) {
                                        let splitLine = split[i].split("\t");
                                        obj_lfr_com[splitLine[0]] = Number(splitLine[1]);
                                    }

                                    result["nodes"] = aux.nodify(obj_lfr_com, 0);
                                    result["links"] = obj_lfr;
                                    mother_result[mix_param] = result;

                                    final_arr.push(Object.values(obj_lfr_com));
                                    final_arr_titles.push("LFR_Bench" + "_" + mix_param);
/*
                                    if (req.params.cyto !== "false") {

                                        result_cyto["nodes"] = aux.nodify(obj_lfr_com, 3);
                                        result_cyto["links"] = obj_lfr_cyto;
                                        res.send(result_cyto);

                                    } else {

                                        res.send(result);
                                    }
*/
                                });
                            });
                        });
                });

                if (req.params.cyto !== "false") {

                    result_cyto["nodes"] = aux.nodify(obj_lfr_com, 3);
                    result_cyto["links"] = obj_lfr_cyto;
                    res.send(result_cyto);

                } else {

                    res.send(result);
                }

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
                        obj.push(aux.edge(splitLine[0], splitLine[1]));
                        obj_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});

                    }

                    result["nodes"] = aux.nodify(node_data, 1);
                    result["links"] = obj;

                    if(req.params.cyto !== "false")  {

                        result_cyto["nodes"] = aux.nodify(node_data, 2);
                        result_cyto["links"] = obj_cyto;
                        res.send(result_cyto);
                    } else {
                        res.send(result);
                    }
                });

                break;

            case "Karate":

                // Importing Zachary's karate club network. Supporting Cytoscape.js and D3.js representation.
                result = require('./uploads/karate_club.json');

                if(req.params.cyto !== "false")  {

                    result_cyto = require('./uploads/karate_club_cyto.json');
                    res.send(result_cyto);
                } else {
                    res.send(result);
                }

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
                            if(include_data.includes(splitLine[0])) {
                                obj[i - 1] = [];
                                for (let j = 1; j < splitLine.length; j++) {
                                    obj[i - 1].push(Number(splitLine[j]));
                                }
                            }
                        }

                        result = hamming.jHamming(obj, 1, false);

                        if(req.params.cyto !== "false")  {

                            result_cyto = hamming.jHamming(obj, 1, true);
                            res.send(result_cyto);
                        } else {
                            res.send(result);
                        }
                    });
                });
        }
});

// ---------------------------------------------- ALGORITHM ----------------------------------------------

// Sending data to community finding analysis. It will be dependent on the algorithm used, respective variable parameters, data visualization framework and network under study.
app.get('/algorithm/:alg/gamma/:val/cytoscape/:cyto/network/:net/mix_param/:mix/avg_deg/:deg', function (req, res) {

    readFile(req.params.alg, req.params.val, req.params.cyto, req.params.net, req.params.mix, req.params.deg);
    res.send();
});

// ---------------------------------------------- DATA UPLOAD ----------------------------------------------

// To be executed upon file upload in the interface.
app.post('/upload', function (req, res) {

    let form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/uploads/' + "upload.txt"; // file.name substituted by Input.txt
    });

});

// ---------------------------------------------- NMI BENCHMARK ----------------------------------------------

let datat = {};

app.get('/bench', function (req, res) {

    for (let i = 0; i < final_arr.length; i++) {

        let auxi = "";
        let net;

        // ---------------------------- NMI x Mix Parameter
/*
        if(final_arr_titles[0].search("GN") === -1) {

            let splitName = final_arr_titles[i].split("_");

            if (splitName[0] === "Louvain" || splitName[0] === "Infomap") {

                net = "LFR_Bench_" + splitName[2] + ".txt";

            } else if (splitName[0] === "LLP") {

                net = "LFR_Bench_" + splitName[3] + ".txt";

            } else if (splitName[0] === "LFR") {

                net = final_arr_titles[i] + ".txt";

            }

        } else {

            net = "GN_Bench_0.txt";

        }
*/
        // ---------------------------- LP/LLP/Louvain/Infomap NMI x Mix Parameter

        if(final_arr_titles[0].search("GN") === -1) {

            let splitName = final_arr_titles[i].split("_");

            if (splitName[0] === "Louvain" || splitName[0] === "Infomap") {

                net = "LFR_Bench_" + splitName[2] + ".txt";

            } else if (splitName[0] === "LLP") {

                net = "LFR_Bench_" + splitName[3] + ".txt";

            } else if (splitName[0] === "LFR") {

                net = final_arr_titles[i] + ".txt";

            }

        } else {

            net = "GN_Bench_0_15.txt";

        }
/*
        auxi = aux.arrayToString_bench(final_arr, auxi, final_arr_titles,final_arr_titles[i]);

        fs.writeFile("./website/algorithms/nmi/" + final_arr_titles[i] + ".txt", auxi, function () {

            cmd.get(
                `
            cd ./website/algorithms/nmi
            ./mutual ${net} ${final_arr_titles[i] + ".txt"}
        `,
                function (err, data, stderr) {

                    if (err) throw console.log('error', err);

                    datat[final_arr_titles[i]] = Number(data.split("\t")[1]);
/*
                    if (final_arr_titles[i] !== "GN_Bench_0.txt" || final_arr_titles[i] !== "LFR_Bench_0_0.txt") {

                        fs.unlink("./website/algorithms/nmi/" + final_arr_titles[i] + ".txt", function (err) {
                            if (err) throw err;
                        });
                    }


                }
            );
        });
*/
        datat[final_arr_titles[i]] = nmi.jNMI(final_arr[0],final_arr[i]);

    }

    res.send();

});

app.get('/plot', function (req, res) {

    let auxii = "";
    let net = ((Object.keys(datat)[0]).split("_"))[1];
    let alg = ((Object.keys(datat)[0]).split("_"))[0];

    // ---------------------------- NMI x Mix Parameter
/*
    if(net.search("GN") === -1) {
        auxii  = aux.arrayToString_plot(datat, auxii, ["LLP_LFR_0_0_", "LLP_LFR_0_0.1_", "LLP_LFR_0_0.2_", "LLP_LFR_0_0.3_", "LLP_LFR_0_0.4_", "LLP_LFR_0_0.5_", "LLP_LFR_0_0.6_", "LLP_LFR_0_0.7_", "LLP_LFR_0_0.8_", "LLP_LFR_0_0.9_", "LLP_LFR_0_1_", "LLP_LFR_0.5_0_", "LLP_LFR_0.5_0.1_", "LLP_LFR_0.5_0.2_", "LLP_LFR_0.5_0.3_", "LLP_LFR_0.5_0.4_", "LLP_LFR_0.5_0.5_", "LLP_LFR_0.5_0.6_", "LLP_LFR_0.5_0.7_", "LLP_LFR_0.5_0.8_", "LLP_LFR_0.5_0.9_", "LLP_LFR_0.5_1_", "Louvain_LFR_0_", "Louvain_LFR_0.1_", "Louvain_LFR_0.2_", "Louvain_LFR_0.3_", "Louvain_LFR_0.4_", "Louvain_LFR_0.5_", "Louvain_LFR_0.6_", "Louvain_LFR_0.7_", "Louvain_LFR_0.8_", "Louvain_LFR_0.9_", "Louvain_LFR_1_", "Infomap_LFR_0_", "Infomap_LFR_0.1_", "Infomap_LFR_0.2_", "Infomap_LFR_0.3_", "Infomap_LFR_0.4_", "Infomap_LFR_0.5_", "Infomap_LFR_0.6_", "Infomap_LFR_0.7_", "Infomap_LFR_0.8_", "Infomap_LFR_0.9_", "Infomap_LFR_1_"]);
        fs.writeFileSync("./website/algorithms/nmi/nmi_mix_LFR.csv", auxii);
    } else {
        auxii  = aux.arrayToString_plot(datat, auxii, ["LLP_GN_0_0_", "LLP_GN_0_0.1_", "LLP_GN_0_0.2_", "LLP_GN_0_0.3_", "LLP_GN_0_0.4_", "LLP_GN_0_0.5_", "LLP_GN_0_0.6_", "LLP_GN_0_0.7_", "LLP_GN_0_0.8_", "LLP_GN_0_0.9_", "LLP_GN_0_1_", "LLP_GN_0.5_0_", "LLP_GN_0.5_0.1_", "LLP_GN_0.5_0.2_", "LLP_GN_0.5_0.3_", "LLP_GN_0.5_0.4_", "LLP_GN_0.5_0.5_", "LLP_GN_0.5_0.6_", "LLP_GN_0.5_0.7_", "LLP_GN_0.5_0.8_", "LLP_GN_0.5_0.9_", "LLP_GN_0.5_1_", "Louvain_GN_0_", "Louvain_GN_0.1_", "Louvain_GN_0.2_", "Louvain_GN_0.3_", "Louvain_GN_0.4_", "Louvain_GN_0.5_", "Louvain_GN_0.6_", "Louvain_GN_0.7_", "Louvain_GN_0.8_", "Louvain_GN_0.9_", "Louvain_GN_1_", "Infomap_GN_0_", "Infomap_GN_0.1_", "Infomap_GN_0.2_", "Infomap_GN_0.3_", "Infomap_GN_0.4_", "Infomap_GN_0.5_", "Infomap_GN_0.6_", "Infomap_GN_0.7_", "Infomap_GN_0.8_", "Infomap_GN_0.9_", "Infomap_GN_1_"]);
        fs.writeFileSync("./website/algorithms/nmi/nmi_mix_GN.csv", auxii);
    }
*/
    // ---------------------------- LP/LLP/Louvain/Infomap NMI x Mix Parameter

    let titles = [];

    for (let i = 15; i < 25; i = i + 5) {

        for (let ii = 0; ii < 11; ii++) {

            if (alg === "LLP") {

                titles.push(alg + "_" + net + "_" + 0 + "_" + ii / 10 + "_" + i);

            } else {

                titles.push(alg + "_" + net + "_" + ii / 10 + "_" + i);

            }

        }

    }

    //console.log(titles);

    auxii  = aux.arrayToString_plot(datat, auxii, titles);
    fs.writeFileSync("./website/algorithms/nmi/" + alg + "_vs_mix_vs_k_" + net + ".csv", auxii);

});

console.log(nmi.jNMI([0,10,2,30,3,3,5,60,0],[0,1,2,3,3,3,5,6,9]));
