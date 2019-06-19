// ---------------------------------------------- Global Variables ----------------------------------------------

// Importing general libraries.
const fs = require('fs');
const express = require('express');
const cmd = require('node-cmd');
//const {performance} = require('perf_hooks');
const stats = require('download-stats');

// Importing community finding libraries.
const infomap = require('./website/algorithms/infomap/infomap');
const louvain = require('./website/algorithms/louvain/louvain');
const layeredLabelPropagation = require('./website/algorithms/llp/layeredLabelPropagation');
const hamming = require('./website/algorithms/hamming/hamming');
// const nmi = require('./website/algorithms/nmi/nmi');

// Importing benchmarking libraries.
const girvan = require('./website/algorithms/girvan-newman/girvan-newman');

// Importing auxiliary functions.
const aux = require('./auxFunctions');

const app = express();

app.use(express.static('website'));
app.listen(process.env.PORT || 3000);

// Initializing global variables.
let result = {}, result_cyto = {};

// Initializing benchmarking variables.
let str = "";
//let final_arr = [], final_arr_titles = [], final_times = {}, ij = 0;

// ---------------------------------------------- APPLICATION ----------------------------------------------

// Reading input file from the interface. Converting data to arrays.
function readFile(alg, gamma_var, cyto, net, mix, avg_deg) {

    let community;

    if (net === "Amazon" || net === "Karate" || net === "Staph") {mix = net; avg_deg = net;}

    switch (alg) {

        case 'Louvain':

            if (cyto === "true") {

                community = louvain.jLouvain(aux.nodeDetection(result_cyto[mix + "_" + avg_deg]["nodes"], 0), result[mix + "_" + avg_deg]["links"], gamma_var);
                result_cyto["nodes"] = aux.nodify(community, 3);
                result_cyto["links"] = result_cyto[mix + "_" + avg_deg]["links"];

            } else {

                //let t1 = performance.now();
                community = louvain.jLouvain(aux.nodeDetection(result[mix + "_" + avg_deg]["nodes"], 1), result[mix + "_" + avg_deg]["links"], gamma_var);
                //let t2 = performance.now();
                //final_times["Louvain" + "_" + net + "_" + mix + "_" + avg_deg + "_" + ij] = t2 - t1;
                //final_arr.push(Object.values(community));
                //final_arr_titles.push("Louvain" + "_" + net + "_" + mix + "_" + avg_deg + "_" + ij);
                //ij++;
                result["nodes"] = aux.nodify(community, 0);
                result["links"] = result[mix + "_" + avg_deg]["links"];

            }

            //if (net === "Staph") fs.writeFile("./metaStaph.txt", aux.printMeta(community, 5200));

            break;

        case 'Infomap':

            if (cyto === "true") {

                community = infomap.jInfomap(aux.nodeDetection(result_cyto[mix + "_" + avg_deg]["nodes"], 0), result[mix + "_" + avg_deg]["links"], gamma_var);
                result_cyto["nodes"] = aux.nodify(community, 3);
                result_cyto["links"] = result_cyto[mix + "_" + avg_deg]["links"];

            } else {

                //let t1 = performance.now();
                community = infomap.jInfomap(aux.nodeDetection(result[mix + "_" + avg_deg]["nodes"], 1), result[mix + "_" + avg_deg]["links"], gamma_var);
                //let t2 = performance.now();
                //final_times["Infomap" + "_" + net + "_" + mix + "_" + avg_deg + "_" + ij] = t2 - t1;
                //final_arr.push(Object.values(community));
                //final_arr_titles.push("Infomap" + "_" + net + "_" + mix + "_" + avg_deg + "_" + ij);
                //ij++;
                result["nodes"] = aux.nodify(community, 0);
                result["links"] = result[mix + "_" + avg_deg]["links"];

            }

            //if (net === "Staph") fs.writeFile("./metaStaph.txt", aux.printMeta(community, 5200));

            break;

        case 'LLP':

            if (cyto === "true") {

                community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(result_cyto[mix + "_" + avg_deg]["nodes"], 0), result[mix + "_" + avg_deg]["links"], gamma_var, 1000);
                result_cyto["nodes"] = aux.nodify(community, 3);
                result_cyto["links"] = result_cyto[mix + "_" + avg_deg]["links"];

            } else {

                if (mix === undefined && avg_deg === undefined) gamma_var = 0;

                //let t1 = performance.now();
                community = layeredLabelPropagation.jLayeredLabelPropagation(aux.nodeDetection(result[mix + "_" + avg_deg]["nodes"], 1), result[mix + "_" + avg_deg]["links"], gamma_var, 1000);
                //let t2 = performance.now();
                //final_times["LLP" + "_" + net + "_" + gamma_var + "_" + mix + "_" + avg_deg + "_" + ij] = t2 - t1;
                //final_arr.push(Object.values(community));
                //final_arr_titles.push("LLP" + "_" + net + "_" + gamma_var + "_" + mix + "_" + avg_deg + "_" + ij);
                //ij++;
                result["nodes"] = aux.nodify(community, 0);
                result["links"] = result[mix + "_" + avg_deg]["links"];
                console.log(gamma_var);
            }

            //if (net === "Staph") fs.writeFile("./metaStaph.txt", aux.printMeta(community, 5200));

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
    str = aux.printMeta(final_arr, 1000);
    fs.writeFile("./print.txt", str);
*/
});

// ---------------------------------------------- RESET ----------------------------------------------

// Resetting the application by clicking in the corresponding button in the interface.
app.get('/reset/:net/cytoscape/:cyto/mix_param/:mix/avg_deg/:deg/net_size/:size/max_deg/:maxk/min_com/:minc/max_com/:maxc', function (req, res) {

        switch (req.params.net) {

            case "GN":

                result[req.params.mix + "_" + req.params.deg] = girvan.jGirvan_Newman(req.params.mix, false, req.params.deg);

                if(req.params.cyto !== "false")  {

                    result_cyto[req.params.mix + "_" + req.params.deg] = girvan.jGirvan_Newman(req.params.mix, true, req.params.deg);
                    res.send(result_cyto[req.params.mix + "_" + req.params.deg]);

                } else {

                    res.send(result[req.params.mix + "_" + req.params.deg]);

                }

                break;

            case "LFR":

        cmd.get(
            `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            rm network.dat
            rm community.dat
            ./benchmark -N ${req.params.size} -k ${req.params.deg} -maxk ${req.params.maxk} -mu ${req.params.mix} -minc ${req.params.minc} -maxc ${req.params.maxc}
        `,
            function () { // err, data, stderr

                fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data_net) {

                    if (err) throw err;

                    let obj_lfr_cyto = [];
                    let obj_lfr = [];

                    let split = data_net.toString().split("\n");

                    for (let i = 0; i < split.length - 1; i++) {
                        let splitLine = split[i].split("\t");
                        obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));
                        obj_lfr_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});
                    }

                    fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data_com) {

                        if (err) throw err;

                        let obj_lfr_com = {};
                        let split = data_com.toString().split("\n");

                        for (let i = 0; i < split.length - 1; i++) {
                            let splitLine = split[i].split("\t");
                            obj_lfr_com[splitLine[0]] = Number(splitLine[1]);
                        }

                        result[req.params.mix + "_" + req.params.deg] = {};
                        result[req.params.mix + "_" + req.params.deg]["nodes"] = aux.nodify(obj_lfr_com, 0);
                        result[req.params.mix + "_" + req.params.deg]["links"] = obj_lfr;

                        if (req.params.cyto !== "false") {

                            result_cyto[req.params.mix + "_" + req.params.deg] = {};
                            result_cyto[req.params.mix + "_" + req.params.deg]["nodes"] = aux.nodify(obj_lfr_com, 3);
                            result_cyto[req.params.mix + "_" + req.params.deg]["links"] = obj_lfr_cyto;

                            res.send(result_cyto[req.params.mix + "_" + req.params.deg]);

                        } else {

                            res.send(result[req.params.mix + "_" + req.params.deg]);

                        }
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
                        obj.push(aux.edge(splitLine[0], splitLine[1]));
                        obj_cyto.push({data: aux.edge(splitLine[0], splitLine[1])});

                    }

                    result[req.params.mix + "_" + req.params.deg] = {};
                    result[req.params.mix + "_" + req.params.deg]["nodes"] = aux.nodify(node_data, 1);
                    result[req.params.mix + "_" + req.params.deg]["links"] = obj;

                    if(req.params.cyto !== "false")  {

                        result_cyto[req.params.mix + "_" + req.params.deg] = {};
                        result_cyto[req.params.mix + "_" + req.params.deg]["nodes"] = aux.nodify(node_data, 2);
                        result_cyto[req.params.mix + "_" + req.params.deg]["links"] = obj_cyto;
                        res.send(result_cyto[req.params.mix + "_" + req.params.deg]);

                    } else {

                        res.send(result[req.params.mix + "_" + req.params.deg]);
                    }
                });

                break;

            case "Karate":

                // Importing Zachary's karate club network. Supporting Cytoscape.js and D3.js representation.
                result[req.params.mix + "_" + req.params.deg] = require('./uploads/karate_club.json');

                if(req.params.cyto !== "false")  {

                    result_cyto[req.params.mix + "_" + req.params.deg] = require('./uploads/karate_club_cyto.json');
                    res.send(result_cyto[req.params.mix + "_" + req.params.deg]);

                } else {

                    res.send(result[req.params.mix + "_" + req.params.deg]);
                }

                break;

            case "Staph":

                fs.readFile('./uploads/staph_clonalComplex.txt', 'utf8', function (err, data) {

                    if (err) throw err;

                    let node_data = {};
                    let split = data.toString().split("\n");

                    for (let i = 1; i < split.length; i++) {
                        let splitLine = split[i].split(" ");
                        node_data[splitLine[1]] = true;
                    }

                    let include_data = Object.keys(node_data);

                    fs.readFile('./uploads/staph_profile.txt', 'utf8', function (err, data) {

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

                        result[req.params.mix + "_" + req.params.deg] = hamming.jHamming(obj, 1, false);

                        if(req.params.cyto !== "false")  {

                            result_cyto[req.params.mix + "_" + req.params.deg] = hamming.jHamming(obj, 1, true);

                            res.send(result_cyto[req.params.mix + "_" + req.params.deg]);
                        } else {
                            res.send(result[req.params.mix + "_" + req.params.deg]);
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

// ---------------------------------------------- STATS ----------------------------------------------

    let start = new Date('2019-04-11');
    let d = new Date();
    let end = new Date((d.getFullYear).toString() + "-" + (d.getMonth).toString() + "-" + (d.getDate).toString());

    let downloadss = {};
let downloadss_cum = {};
downloadss["time"] = Array.from({length: (d.getDate() - 9)}, (v, k) => k);

    ["infomap", "layered-label-propagation", "normalized-mutual-information", "girvan-newman-benchmark", "louvain-algorithm", "hamming-dist"].map(function (value, index) {
        downloadss[value] = [];
        downloadss[value + "SD"] = [];
        downloadss_cum[value] = 0;
        stats.get(start, end, value)
            .on('error', console.error)
            .on('data', function (data) {
                downloadss_cum[value] = downloadss_cum[value] + data["downloads"];
                downloadss[value].push(downloadss_cum[value]);
                downloadss[value + "SD"].push(0);
            })
            .on('end', function () {
                console.log('done.');

            });
    });

app.get('/stats', function (req, res) {

    str = "";
    str = aux.arrayToString(Object.values(downloadss), str, Object.keys(downloadss));
    fs.writeFileSync("./website/benchmark_data/npm_stats/stats.csv", str);

    res.send(downloadss);

});

// ---------------------------------------------- NMI ACCURACY BENCHMARK ----------------------------------------------
/*
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
*/
    // ---------------------------- NMI x Mix Parameter
/*
    [15, 20, 25].map(function (avg_deg) { //deg

        ["Infomap"].map(function (alg) { //net

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
        //auxii  = aux.arrayToString_plot(final_times, auxii, titles);
        fs.writeFileSync("./website/algorithms/" + req.params.title + "_" + net + ".csv", auxii);

});
*/
// ---------------------------------------------- NMI SPEED BENCHMARK ----------------------------------------------
/*
app.get('/bench_speed', function (req, res) {

    let auxii = "";
    let titles = [];

    // ---------------------------- NMI x Mix Parameter

    [15].map(function (avg_deg) { //deg

       // [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(function (nr_nodes) {

            [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (ii) { // mix

                titles.push("GN_Bench" + "_" + ii + "_" + avg_deg + "_");

           })

      //  });
    });

    auxii  = aux.arrayToString_plot(final_times, auxii, titles);
    fs.writeFileSync("./website/algorithms/GN_speed.csv", auxii);

});
*/
// ---------------------------- LFR
/*
let obj_lfr_com = {};

[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (rep) {

    setTimeout(function () {

       // [128].map(function (nr_nodes) {

           // setTimeout(function () {

                [25].map(function (avg_deg) {

                    //  setTimeout(function () {

                    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (mix_param) {

                        setTimeout(function () {
                            let t1 = performance.now();
                            cmd.get(
                                `
            cd ./website/algorithms/lancichinetti-fortunato-radicchi
            rm network.dat
            rm community.dat
            ./benchmark -N ${128} -k ${avg_deg} -maxk ${avg_deg} -mu ${mix_param} -minc ${32} -maxc ${32}
        `,
                                function () { // err, data, stderr
                                    let t2 = performance.now();
                                    fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/network.dat', 'utf8', function (err, data_net) {

                                        if (err) throw err;

                                        let obj_lfr = [];

                                        let split = data_net.toString().split("\n");

                                        for (let i = 0; i < split.length - 1; i++) {
                                            let splitLine = split[i].split("\t");
                                            obj_lfr.push(aux.edge(splitLine[0], splitLine[1]));

                                        }

                                        fs.readFile('./website/algorithms/lancichinetti-fortunato-radicchi/community.dat', 'utf8', function (err, data_com) {

                                            if (err) throw err;

                                            obj_lfr_com = {};
                                            let split = data_com.toString().split("\n");

                                            for (let i = 0; i < split.length - 1; i++) {
                                                let splitLine = split[i].split("\t");
                                                obj_lfr_com[splitLine[0]] = Number(splitLine[1]);
                                            }

                                            result[mix_param + "_" + avg_deg] = {};
                                            result[mix_param + "_" + avg_deg]["nodes"] = aux.nodify(obj_lfr_com, 0);
                                            result[mix_param + "_" + avg_deg]["links"] = obj_lfr;

                                            final_arr.push(Object.values(obj_lfr_com));
                                            final_arr_titles.push("LFR_Bench" + "_" + mix_param + "_" + avg_deg);
                                            final_times["LFR_Bench" + "_" + mix_param + "_" + avg_deg + "_" + ij] = t2 - t1;
                                            ij++;
                                        });

                                    });

                                });

                        }, 1000 + 2500 * mix_param);

                    });

                    //   }, 300 + 1000 * avg_deg);

               // });

           // }, 300 + 10 * nr_nodes)

        });

    }, 300 + 1000 * rep)

});

*/
// ---------------------------- GN

/*

 [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (rep) {

[15].map(function (avg_deg) {

    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(function (mix_param) {

        let t1 = performance.now();
        result[mix_param + "_" + avg_deg] = girvan.jGirvan_Newman(mix_param, false, avg_deg);
        let t2 = performance.now();

        final_arr.push(result[mix_param + "_" + avg_deg]["communities"]);
        final_arr_titles.push("GN_Bench" + "_" + mix_param + "_" + avg_deg);

        final_times["GN_Bench" + "_" + mix_param + "_" + avg_deg + "_" + ij] = t2 - t1;
        ij++;
    });
});
 });
*/

// ---------------------------------------------- INSaFLU ----------------------------------------------

app.get('/insaflu_tree', function (req, res) {

    fs.readFile('./uploads/insaflu/figtree_TEST.nwk', 'utf8', function (err, data) {

        if (err) throw err;

        let tree_data = data.toString();

        console.log(tree_data);

        res.send(tree_data);
    });
});


app.get('/insaflu_sample', function (req, res) {

    fs.readFile('./uploads/insaflu/Id_test.csv', 'utf8', function (err, data) {

        if (err) throw err;

        let obj = {};
        let split = data.toString().split("\n");
        let metaTitles = split[0].split(";");

        for (let i = 1; i < split.length; i++) {

            let splitLine = split[i].split(";");

            for (let j = 1; j < splitLine.length; j++) {

                obj[splitLine[0]] = obj[splitLine[0]] || {};

                obj[splitLine[0]][metaTitles[j]] = splitLine[j];

            }
        }

        res.send(obj);

        console.log(obj);

    });
});


