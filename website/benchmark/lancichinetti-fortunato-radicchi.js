// -------------------------------------------- Lancichinetti-Fortunato-Radicchi Benchmark --------------------------------------------

// [Description]

jLFR = function (zeta, gamma, N, mix_param) { // A function expression can be stored in a variable. After it has been
    // stored this way, it can be used as a function. Functions stored in variables do not need
    // names. They are always invoked using the variable name.

    // Global Variables
    let nodes = [];
    let edges = [];
    let result = {};
    let comm = [];
    let aux = 0;

    // Nodes Auxiliary Variables
    let prev = 0;
    let init = 0;

    // Edges Auxiliary Variables
    let edges_deg = [];

    // ----------------------------------------- Helpers -----------------------------------------

    function random (prob) {
        if (prob < Math.random()) {
            return false
        } else {
            return true
        }
    }

    function powerDistribution (prob) {
        if (prob < Math.random()) {
            return false
        } else {
            return true
        }
    }

    // ----------------------------------------- Algorithm -----------------------------------------

    // Communities
    while(aux !== N) {

        let Nc = Math.round(Math.random() * (N-1)) + 1;

        if (Math.random() < Nc ^ (-zeta)) {

            aux = aux + Math.round(Nc);

            if (aux > N) {
                aux = aux - Math.round(Nc);
            } else {
                comm.push(Math.round(Nc));
            }
        }
    }

    // Nodes
    for (let i = 0; i < comm.length; i++) {
        prev = prev + comm[i];
        for (let k = init; k < prev; k++) {
                nodes[k] = {id: k, group: i};
        }
        init = init + comm[i];
    }

    // Edges

    while(aux !== N) {

        let Nc = Math.round(Math.random() * (N-1)) + 1;

        if (Math.random() < Nc ^ (-gamma)) {

            aux = aux + Math.round(Nc);

            if (aux > N) {
                aux = aux - Math.round(Nc);
            } else {
                edges_deg.push(Math.round(Nc));
            }
        }
    }

    for (let i = 0; i < 128; i++) {
        for (let j = 0; j < 128; j++) {
            if (j !== i && random(mix_param)) {
                edges.push({source: i, target: j, value: 1});
            }
        }
    }

    result["nodes"] = nodes;
    result ["links"] = edges;

    return edges_deg;

};

module.exports = {
    lfrVar: jLFR
};