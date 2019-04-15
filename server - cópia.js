// ---------------------------------------------- Global Variables ----------------------------------------------

// Importing general libraries.
const fs = require('fs');
const express = require('express');
const formidable = require('formidable');
const cmd = require('node-cmd');
const {performance} = require('perf_hooks');
const async = require("async");


// Importing community finding libraries.
const infomap = require('./website/algorithms/infomap/infomap');
const louvain = require('./website/algorithms/louvain/louvain');
const layeredLabelPropagation = require('./website/algorithms/llp/layeredLabelPropagation');
const hamming = require('./website/algorithms/hamming/hamming');
const nmi = require('./website/algorithms/nmi/nmi');
const cmddd = require('./cmd.js');

// Importing benchmarking libraries.
const girvan = require('./website/algorithms/girvan-newman/girvan-newman');

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

              //  let t1 = performance.now();
                community = louvain.jLouvain(aux.nodeDetection(mother_result[mix + "_" + avg_deg]["nodes"], 1), mother_result[mix + "_" + avg_deg]["links"], 1/10000);
               // console.log(community);
                //  let t2 = performance.now();
              //  final_times["Louvain" + "_" + net + "_" + mix + "_" + avg_deg + "_" + ij] = t2 - t1;
                final_arr.push(Object.values(community));
                final_arr_titles.push("Louvain" + "_" + net + "_" + mix + "_" + avg_deg + "_" + ij);
                ij++;
                result["nodes"] = aux.nodify(community, 0);
                console.log(result["nodes"]);
                result["links"] = mother_result[mix + "_" + avg_deg]["links"];

            }

            break;

        case 'Infomap':

            if (cyto === "true") {

                community = infomap.jInfomap(aux.nodeDetection(result_cyto["nodes"], 0), result["links"], gamma_var);
                result_cyto["nodes"] = aux.nodify(community, 3);
                result_cyto["links"] = result_cyto["links"];

            } else {

                let t1 = performance.now();
                community = infomap.jInfomap(aux.nodeDetection(mother_result[mix + "_" + avg_deg]["nodes"], 1), mother_result[mix + "_" + avg_deg]["links"], 1/10000);
                let t2 = performance.now();
                final_times["Infomap" + "_" + net + "_" + mix + "_" + avg_deg + "_" + ij] = t2 - t1;
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

                if (mix === undefined && avg_deg === undefined) gamma_var = 0;

                let t1 = performance.now();
                community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(mother_result[mix + "_" + avg_deg]["nodes"], 1), mother_result[mix + "_" + avg_deg]["links"], gamma_var, 10000);
                let t2 = performance.now();
                final_times["LLP" + "_" + net + "_" + mix + "_" + avg_deg + "_" + ij] = t2 - t1;
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
/*
    str = aux.arrayToString(final_arr, str, final_arr_titles);
    fs.writeFile("./print.txt", str);
*/
});

// ---------------------------------------------- RESET ----------------------------------------------

// Resetting the application by clicking in the corresponding button in the interface.
app.get('/reset/:net/cytoscape/:cyto/mix_param/:mix/avg_deg/:deg/net_size/:size/max_deg/:maxk/min_com/:minc/max_com/:maxc', function (req, res) {

        switch (req.params.net) {

            case "GN":

              //  mother_result[req.params.mix + "_" + req.params.deg] = girvan.jGirvan_Newman(req.params.mix, false, req.params.deg);

               // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (rep) {

                    [16].map(function (avg_deg) {

                        [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (mix_param) {

                            let t1 = performance.now();
                            result = girvan.jGirvan_Newman(mix_param, false, avg_deg);
                            let t2 = performance.now();

                            mother_result[mix_param + "_" + avg_deg] = result;

                            final_arr.push(result["communities"]);
                            final_arr_titles.push("GN_Bench" + "_" + mix_param + "_" + avg_deg);

                            //final_times["GN_Bench" + "_" + mix_param + "_" + avg_deg + "_" + ij] = t2 - t1;
                            //ij++;

                            console.log(mix_param);

                        });
                    });
             //   });

                if(req.params.cyto !== "false")  {

                    result_cyto = girvan.jGirvan_Newman(req.params.mix, true, req.params.deg);
                    res.send(result_cyto)

                } else {

                    res.send(mother_result[req.params.mix + "_" + req.params.deg]);

                }

                break;

            case "LFR":

                let obj_lfr_com = {};

[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (mix_param) {

    setTimeout(function () {

        cmd.get(
            `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            rm network.dat
            rm community.dat
            ./benchmark -N ${128} -k ${16} -maxk ${50} -mu ${mix_param} -minc ${10} -maxc ${50}
        `,
            function () { // err, data, stderr

                fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data_net) {

                    if (err) throw err;

                    //let obj_lfr_cyto = [];
                    let obj_lfr = [];
                    let node_data_lfr = {};

                    let split = data_net.toString().split("\n");

                    for (let i = 0; i < split.length - 1; i++) {
                        let splitLine = split[i].split("\t");
                        node_data_lfr[splitLine[0]] = true;
                        node_data_lfr[splitLine[1]] = true;
                        obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));
                        //obj_lfr_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});

                    }

                    fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data_com) {

                        if (err) throw err;

                        obj_lfr_com = {};
                        let split = data_com.toString().split("\n");

                        for (let i = 0; i < split.length - 1; i++) {
                            let splitLine = split[i].split("\t");
                            obj_lfr_com[splitLine[0]] = Number(splitLine[1]);
                        }

                        mother_result[mix_param + "_" + 16] = {};
                        mother_result[mix_param + "_" + 16]["nodes"] = aux.nodify(obj_lfr_com, 0);
                        mother_result[mix_param + "_" + 16]["links"] = obj_lfr;

                        //  console.log(Object.values(obj_lfr_com));
                        final_arr.push(Object.values(obj_lfr_com));
                        final_arr_titles.push("LFR_Bench" + "_" + mix_param + "_" + 16);
                    });

                });

            });

        console.log(mix_param);

    }, 1000 + 1000*mix_param);

});

           //     console.log(final_arr);
/*
                if (req.params.cyto !== "false") {

                    //result_cyto["nodes"] = aux.nodify(obj_lfr_com, 3);
                    //result_cyto["links"] = obj_lfr_cyto;
                    res.send(result_cyto);

                } else {
                    res.send(mother_result[0 + "_" + req.params.deg]);

                }
*/
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

                    //mother_result[req.params.mix + "_" + req.params.deg] = {};
                    //mother_result[req.params.mix + "_" + req.params.deg]["nodes"] = aux.nodify(node_data, 1);
                    //mother_result[req.params.mix + "_" + req.params.deg]["links"] = obj;

                    if(req.params.cyto !== "false")  {

                        result_cyto["nodes"] = aux.nodify(node_data, 2);
                        result_cyto["links"] = obj_cyto;
                        res.send(result_cyto);

                    } else {
                        res.send(mother_result[req.params.mix + "_" + req.params.deg]);
                    }
                });

                break;

            case "Karate":

                // Importing Zachary's karate club network. Supporting Cytoscape.js and D3.js representation.
               // result = require('./uploads/karate_club.json');
                //mother_result[req.params.mix + "_" + req.params.deg] = require('./uploads/karate_club.json');

                if(req.params.cyto !== "false")  {

                    res.send(require('./uploads/karate_club_cyto.json'));

                } else {

                    res.send(mother_result[req.params.mix + "_" + req.params.deg]);
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
                        //mother_result[req.params.mix + "_" + req.params.deg] = result;

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

// ---------------------------------------------- NMI ACCURACY BENCHMARK ----------------------------------------------

app.get('/bench_accu/:title', function (req, res) {

    let datat = {};
    let auxii = "";
    let titles = [];
    let net = final_arr_titles[0].split("_")[0];

    for (let i = 0; i < final_arr.length; i++) {

        let mix;
        let deg;

        if ((final_arr_titles[i].search("LLP")) > -1) {

            mix = final_arr_titles[i].split("_")[3];
            deg = final_arr_titles[i].split("_")[4];

        } else {

            mix = final_arr_titles[i].split("_")[2];
            deg = final_arr_titles[i].split("_")[3];

        }

        let index;

        final_arr_titles.map(function (value, key) {

            if (value === net + "_Bench_" + mix + "_" + deg) {

                index = key;

            }

        });

        datat[final_arr_titles[i]] = nmi.jNMI(final_arr[index],final_arr[i]);

    }

    //str = aux.arrayToString(final_arr, str, final_arr_titles);
    //fs.writeFile("./print.txt", str);

    // ---------------------------- NMI x Mix Parameter

    [16].map(function (avg_deg) { //deg

        ["LLP", "Louvain", "Infomap"].map(function (alg) { //net

            if (alg === "LLP") {

                [0, 0.5].map(function (i) { // gamma

                    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (ii) { // mix

                        titles.push(alg + "_" + net + "_" + i + "_" + ii + "_" + avg_deg + "_");
                    })
                });

            } else {

                [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (ii) { // mix

                    titles.push(alg + "_" + net + "_" + ii + "_" + avg_deg + "_");

                });
            }
        });
    });

        auxii  = aux.arrayToString_plot(datat, auxii, titles);
        fs.writeFileSync("./website/algorithms/" + req.params.title + "_" + net + ".csv", auxii);

});

// ---------------------------------------------- NMI SPEED BENCHMARK ----------------------------------------------

app.get('/bench_speed', function (req, res) {

    let auxii = "";
    let titles = [];

    // ---------------------------- NMI x Mix Parameter

    [16].map(function (avg_deg) { //deg

                    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (ii) { // mix

                        titles.push("LFR_Bench" + "_" + ii + "_" + avg_deg + "_");
                    })
    });

    auxii  = aux.arrayToString_plot(final_times, auxii, titles);
    fs.writeFileSync("./website/algorithms/GN_speed.csv", auxii);

});

//console.log(nmi.jNMI([1,1,3,0,0,0,0,0], [9,0,4,2,6,1,2,11]));
/*
[0.4, 0.5, 0.6, 0.9].map(function (mix_param) {

    final_arr.push(cmddd.cmdd(mix_param));

});
*/

let obj_lfr_com = {};

[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (mix_param) {

    setTimeout(function () {

        cmd.get(
            `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            rm network.dat
            rm community.dat
            ./benchmark -N ${128} -k ${16} -maxk ${50} -mu ${mix_param} -minc ${10} -maxc ${50}
        `,
            function () { // err, data, stderr

                fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data_net) {

                    if (err) throw err;

                    //let obj_lfr_cyto = [];
                    let obj_lfr = [];
                    let node_data_lfr = {};

                    let split = data_net.toString().split("\n");

                    for (let i = 0; i < split.length - 1; i++) {
                        let splitLine = split[i].split("\t");
                        node_data_lfr[splitLine[0]] = true;
                        node_data_lfr[splitLine[1]] = true;
                        obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));
                        //obj_lfr_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});

                    }

                    fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data_com) {

                        if (err) throw err;

                        obj_lfr_com = {};
                        let split = data_com.toString().split("\n");

                        for (let i = 0; i < split.length - 1; i++) {
                            let splitLine = split[i].split("\t");
                            obj_lfr_com[splitLine[0]] = Number(splitLine[1]);
                        }

                        mother_result[mix_param + "_" + 16] = {};
                        mother_result[mix_param + "_" + 16]["nodes"] = aux.nodify(obj_lfr_com, 0);
                        mother_result[mix_param + "_" + 16]["links"] = obj_lfr;

                        //  console.log(Object.values(obj_lfr_com));
                        final_arr.push(Object.values(obj_lfr_com));
                        final_arr_titles.push("LFR_Bench" + "_" + mix_param + "_" + 16);
                    });

                });

            });

        console.log(mix_param);

    }, 1000 + 1000*mix_param);

});

/*
    setTimeout( function() {

        cmd.get(
            `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            rm network.dat
            rm community.dat
            ./benchmark -N ${128} -k ${16} -maxk ${50} -mu ${0.3} -minc ${10} -maxc ${50}
        `,
            function () { // err, data, stderr

                fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data_net) {

                    if (err) throw err;

                    //let obj_lfr_cyto = [];
                    let obj_lfr = [];
                    let node_data_lfr = {};

                    let split = data_net.toString().split("\n");

                    for (let i = 0; i < split.length - 1; i++) {
                        let splitLine = split[i].split("\t");
                        node_data_lfr[splitLine[0]] = true;
                        node_data_lfr[splitLine[1]] = true;
                        obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));
                        //obj_lfr_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});

                    }

                    fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data_com) {

                        if (err) throw err;

                        obj_lfr_com = {};
                        let split = data_com.toString().split("\n");

                        for (let i = 0; i < split.length - 1; i++) {
                            let splitLine = split[i].split("\t");
                            obj_lfr_com[splitLine[0]] = Number(splitLine[1]);
                        }

                        mother_result[0.3 + "_" + 16] = {};
                        mother_result[0.3 + "_" + 16]["nodes"] = aux.nodify(obj_lfr_com, 0);
                        mother_result[0.3 + "_" + 16]["links"] = obj_lfr;

                        //  console.log(Object.values(obj_lfr_com));
                        final_arr.push(Object.values(obj_lfr_com));
                        final_arr_titles.push("LFR_Bench" + "_" + 0.3 + "_" + 16);
                    });

                });

            });


    }, 3500);

    setTimeout( function() {

        cmd.get(
            `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            rm network.dat
            rm community.dat
            ./benchmark -N ${128} -k ${16} -maxk ${50} -mu ${0.8} -minc ${10} -maxc ${50}
        `,
            function () { // err, data, stderr

                fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data_net) {

                    if (err) throw err;

                    //let obj_lfr_cyto = [];
                    let obj_lfr = [];
                    let node_data_lfr = {};

                    let split = data_net.toString().split("\n");

                    for (let i = 0; i < split.length - 1; i++) {
                        let splitLine = split[i].split("\t");
                        node_data_lfr[splitLine[0]] = true;
                        node_data_lfr[splitLine[1]] = true;
                        obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));
                        //obj_lfr_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});

                    }

                    fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data_com) {

                        if (err) throw err;

                        obj_lfr_com = {};
                        let split = data_com.toString().split("\n");

                        for (let i = 0; i < split.length - 1; i++) {
                            let splitLine = split[i].split("\t");
                            obj_lfr_com[splitLine[0]] = Number(splitLine[1]);
                        }

                        mother_result[0.8 + "_" + 16] = {};
                        mother_result[0.8 + "_" + 16]["nodes"] = aux.nodify(obj_lfr_com, 0);
                        mother_result[0.8 + "_" + 16]["links"] = obj_lfr;


                        //  console.log(Object.values(obj_lfr_com));
                        final_arr.push(Object.values(obj_lfr_com));
                        final_arr_titles.push("LFR_Bench" + "_" + 0.8 + "_" + 16);
                    });

                });

            });
    }, 3000);

    setTimeout( function() {

        cmd.get(
            `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            rm network.dat
            rm community.dat
            ./benchmark -N ${128} -k ${16} -maxk ${50} -mu ${1} -minc ${10} -maxc ${50}
        `,
            function () { // err, data, stderr

                fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data_net) {

                    if (err) throw err;

                    //let obj_lfr_cyto = [];
                    let obj_lfr = [];
                    let node_data_lfr = {};

                    let split = data_net.toString().split("\n");

                    for (let i = 0; i < split.length - 1; i++) {
                        let splitLine = split[i].split("\t");
                        node_data_lfr[splitLine[0]] = true;
                        node_data_lfr[splitLine[1]] = true;
                        obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));
                        //obj_lfr_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});

                    }

                    fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data_com) {

                        if (err) throw err;

                        obj_lfr_com = {};
                        let split = data_com.toString().split("\n");

                        for (let i = 0; i < split.length - 1; i++) {
                            let splitLine = split[i].split("\t");
                            obj_lfr_com[splitLine[0]] = Number(splitLine[1]);
                        }

                        mother_result[1 + "_" + 16] = {};
                        mother_result[1 + "_" + 16]["nodes"] = aux.nodify(obj_lfr_com, 0);
                        mother_result[1 + "_" + 16]["links"] = obj_lfr;

                        // console.log(Object.values(obj_lfr_com));
                        final_arr.push(Object.values(obj_lfr_com));
                        final_arr_titles.push("LFR_Bench" + "_" + 1 + "_" + 16);
                    });

                });

            });

    }, 2500);

    setTimeout( function() {

        cmd.get(
            `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            rm network.dat
            rm community.dat
            ./benchmark -N ${128} -k ${16} -maxk ${50} -mu ${0.2} -minc ${10} -maxc ${50}
        `,
            function () { // err, data, stderr

                fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data_net) {

                    if (err) throw err;

                    //let obj_lfr_cyto = [];
                    let obj_lfr = [];
                    let node_data_lfr = {};

                    let split = data_net.toString().split("\n");

                    for (let i = 0; i < split.length - 1; i++) {
                        let splitLine = split[i].split("\t");
                        node_data_lfr[splitLine[0]] = true;
                        node_data_lfr[splitLine[1]] = true;
                        obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));
                        //obj_lfr_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});

                    }

                    fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data_com) {

                        if (err) throw err;

                        obj_lfr_com = {};
                        let split = data_com.toString().split("\n");

                        for (let i = 0; i < split.length - 1; i++) {
                            let splitLine = split[i].split("\t");
                            obj_lfr_com[splitLine[0]] = Number(splitLine[1]);
                        }

                        mother_result[0.2 + "_" + 16] = {};
                        mother_result[0.2 + "_" + 16]["nodes"] = aux.nodify(obj_lfr_com, 0);
                        mother_result[0.2 + "_" + 16]["links"] = obj_lfr;

                        // console.log(Object.values(obj_lfr_com));
                        final_arr.push(Object.values(obj_lfr_com));
                        final_arr_titles.push("LFR_Bench" + "_" + 0.2 + "_" + 16);
                    });

                });

            });


    }, 1500);

    setTimeout( function() {

        cmd.get(
            `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            rm network.dat
            rm community.dat
            ./benchmark -N ${128} -k ${16} -maxk ${50} -mu ${0.9} -minc ${10} -maxc ${50}
        `,
            function () { // err, data, stderr

                fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data_net) {

                    if (err) throw err;

                    //let obj_lfr_cyto = [];
                    let obj_lfr = [];
                    let node_data_lfr = {};

                    let split = data_net.toString().split("\n");

                    for (let i = 0; i < split.length - 1; i++) {
                        let splitLine = split[i].split("\t");
                        node_data_lfr[splitLine[0]] = true;
                        node_data_lfr[splitLine[1]] = true;
                        obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));
                        //obj_lfr_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});
                    }

                    fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data_com) {

                        if (err) throw err;

                        obj_lfr_com = {};
                        let split = data_com.toString().split("\n");

                        for (let i = 0; i < split.length - 1; i++) {
                            let splitLine = split[i].split("\t");
                            obj_lfr_com[splitLine[0]] = Number(splitLine[1]);
                        }

                        mother_result[0.9 + "_" + 16] = {};
                        mother_result[0.9 + "_" + 16]["nodes"] = aux.nodify(obj_lfr_com, 0);
                        mother_result[0.9 + "_" + 16]["links"] = obj_lfr;

                        // console.log(Object.values(obj_lfr_com));
                        final_arr.push(Object.values(obj_lfr_com));
                        final_arr_titles.push("LFR_Bench" + "_" + 0.9 + "_" + 16);

                    });
                });
            });

    }, 1000);
*/