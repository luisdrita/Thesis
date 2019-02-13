// -------------------------------------------- Girvan-Newman Benchmark --------------------------------------------

// [Description]


jGirvan_Newman = function (mix_param) { // A function expression can be stored in a variable. After it has been
    // stored this way, it can be used as a function. Functions stored in variables do not need
    // names. They are always invoked using the variable name.

    // Global Variables
    let nodes = [];
    let edges = [];
    let result = {};

    // ----------------------------------------- Helpers -----------------------------------------

    function random (prob) {
        return prob >= Math.random();
    }

    // ----------------------------------------- Algorithm -----------------------------------------

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
        for (let j = 0; j < 128; j++) {
            if (j !== i && random(mix_param)) {
                edges.push({source: i, target: j, value: 1});
            }
        }
    }

    result["nodes"] = nodes;
    result ["links"] = edges;

    return result;

};

module.exports = {
    girvanVar: jGirvan_Newman
};