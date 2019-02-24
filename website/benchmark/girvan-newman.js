// -------------------------------------------- Girvan-Newman Benchmark --------------------------------------------

// [Description]


jGirvan_Newman = function (mix_param, cyto, avg_deg) { // A function expression can be stored in a variable. After it has been
    // stored this way, it can be used as a function. Functions stored in variables do not need
    // names. They are always invoked using the variable name.

    // Global Variables
    let nodes = [];
    let edges = [];
    let communities = [];
    let result = {};

    // ----------------------------------------- Helpers -----------------------------------------

    function random (prob) {
        return prob >= Math.random();
    }

    // ----------------------------------------- Algorithm -----------------------------------------

    if(cyto === "false") {

        for (let i = 0; i < 128; i++) {

            if (i < 31) {
                nodes[i] = {id: i, group: 1};

            } else if (i < 63) {
                nodes[i] = {id: i, group: 2};

            } else if (i < 95) {
                nodes[i] = {id: i, group: 3};

            } else {
                nodes[i] = {id: i, group: 4};

            }
        }

        for (let i = 0; i < 128; i++) {

            if (i < 31) {
                communities[i] = 1;

            } else if (i < 63) {
                communities[i] = 2;

            } else if (i < 95) {
                communities[i] = 3;

            } else {
                communities[i] = 4;

            }
        }

        for (let i = 0; i < 128; i++) {

            for (let aux = 0; aux < Math.round(4*(avg_deg-mix_param+1)/(1+2*mix_param)); aux++) {

                let j = Math.round(Math.random() * 127);

                if (nodes[i].group === nodes[j].group && j !== i) {
                    if (random(1 - mix_param)) {
                        edges.push({source: i, target: j, value: 1});
                    }
                } else {
                    if (random(mix_param)) {
                        edges.push({source: i, target: j, value: 1});
                    }
                }

            }
        }

    } else {

        for (let i = 0; i < 128; i++) {

            if (i < 31) {
                nodes[i] = {data: {id: i, weight: 1}};

            } else if (i < 63) {
                nodes[i] = {data: {id: i, weight: 2}};

            } else if (i < 95) {
                nodes[i] = {data: {id: i, weight: 3}};

            } else {
                nodes[i] = {data: {id: i, weight: 4}};

            }
        }

        for (let i = 0; i < 128; i++) {
            for (let j = 0; j < 128; j++) {
                if (nodes[i].group === nodes[j].group && j !== i) {
                    if (random(1-mix_param)) {
                        edges.push({data: {source: i, target: j, value: 1}});
                    }
                } else {
                    if (random(mix_param)) {
                        edges.push({data: {source: i, target: j, value: 1}});
                    }
                }
            }
        }

    }

    result["nodes"] = nodes;
    result ["links"] = edges;
    result["communities"] = communities;

    return result;

};

module.exports = {
    girvanVar: jGirvan_Newman
};