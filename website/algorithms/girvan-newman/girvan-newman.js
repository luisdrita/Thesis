// -------------------------------------------- Girvan-Newman Benchmark --------------------------------------------

// [Description]
// The GN benchmark was historically the first one to appear as a result of an effort of Girvan and Newman. In their
// paper, where it was described for the first time, they considered a network of 128 nodes divided in 4 different
// groups, each one with exactly the same number of nodes (32). Then, a mixing parameter chose by the user would
// iteratively be used to connect different pairs of nodes with different probabilities. Precisely, nodes from different
// groups would connect with a probability given by that value (u) and the ones present in different communities with
// 1-u. Nevertheless, the authors consider that each node will exactly be connected to 16 different ones. In spite of
// this, the algorithms I implemented allow not only the mixing parameter to vary, but also the average degree. This was
// useful because allowed an increased number of benchmark tests using these networks.

jGirvan_Newman = function (mix_param, cyto, avg_deg) { // A function expression can be stored in a variable. After it has been
    // stored this way, it can be used as a function. Functions stored in variables do not need
    // names. They are always invoked using the variable name.

    // Global Variables
    let nodes = [], edges = [], nodes_cyto = [], edges_cyto = [], edges2 = [], edges_group = [], communities = [];
    let result = {};
    let matrix = Array(128).fill().map(() => Array(128).fill(0)), matrix2 = Array(128).fill().map(() => Array(128).fill(0)), final_matrix = Array(128).fill().map(() => Array(128).fill(0));
    let rightGroup;
    let i;
    let out_degree = Math.round(mix_param * avg_deg), in_degree = avg_deg - Math.round(mix_param * avg_deg);

    // ----------------------------------------- Auxiliary Functions -----------------------------------------

    // Returns the input vector but randomly shuffled.
    function shuffle(a) {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }

        return a;
    }

    // Joins the nodes that belong to the same group. Group order was randomized.
    function reShuffle(a) {

        let randSequence = shuffle([1,2,3,4]);

        let result = [];

        for (let j = 0; j < 4; j++) {

            for (let i = 0; i < a.length; i++) {

                if (a[i].group === randSequence[j]) result.push(a[i]);
            }
        }

        return result
    }

    // Returns the group of node "node_i".
    function find(node_i, nodes_set) {

        nodes_set.forEach(function (node) {

            if(node.id === node_i.id) return node.group;
        });
    }

    // Returns the number of neighbour nodes of node "node". It excludes itself.
    function number_neighbour_nodes(node, matrix) {

        let neighbours = matrix[node.id];
        let count = 0;

        neighbours.forEach(function (neighbour, index) {

            if(neighbour === 1 && index !== node.id) count++;

        });

        return count;
    }

    // Returns the number of neighbours of node "node". It excludes the ones belonging to the same group.
    function number_neighbour_different_nodes(node, matrix, nodes_set) {

        let neighbours = matrix[node.id];
        let count = 0;

        neighbours.forEach(function (neighbour, index) {

            if(neighbour === 1 && node.group !== find(neighbours[index], nodes_set)) count++;

        });

        return count;
    }

    // Verifies if "node_i" is connected to "node_j".
    function check(node_i, node_j, matrix) {

        return (matrix[node_i.id][node_j.id] === 1);
    }

    // Returns all nodes belonging to a different group of node "node_i".
    function exceptGroup(nodes_set, node_i) {

        let result = [];

        nodes_set.forEach(function (node) {

            if (node.group !== node_i.group) result.push(node);

        });

        return result
    }

    // Returns all nodes belonging to the same group of node "node_i". Except itself.
    function includeGroup(nodes_set, node_i) {

        let result = [];

        nodes_set.forEach(function (node) {

            if (node.group === node_i.group && node_i.id !== node.id) result.push(node);

        });

        return result
    }

    // Excludes "node_i" from "nodes_set" array of nodes.
    function exclude(nodes_set, node_i) {

        let result = nodes_set;

        nodes_set.some(function (node, key) {

            if (node.id === node_i.id) {
                result.splice(key, 1);
                return true;
            } // At position key, remove 1 item.

            return false;

        });

        return result
    }

    // Assesses if all nodes belonging to a given group have all the inside connections in place.
    function complete(matrix, group) {

        let aux = 0;

        let nodes_aux = [];

        nodes.forEach(function (node) {

            if(node.group === group) nodes_aux.push(node);

        });

        nodes_aux.forEach(function (node) {

            aux = aux + (in_degree - number_neighbour_nodes(node, matrix));

        });

        return aux > 0;
    }

    // Sums 2 matrices.
    function matrixAddition(a, b){
        return a.map(function(n, i){
            return n.map(function(o, j){
                return o + b[i][j];
            });
        });
    }

    // Reset mechanism crucial for algorithm sequence of actions.
    function reset(i_input, boolean) {

        if (boolean && (i_input+1)%32 === 0) {

            i = i_input-32;
            edges = [];
            matrix = Array(128).fill().map(() => Array(128).fill(0));

        } else if (!boolean && (i_input+1)%32 === 0) {

            edges_group = edges_group.concat(edges);
            edges = [];
            final_matrix = matrixAddition(matrix, final_matrix);
            matrix = Array(128).fill().map(() => Array(128).fill(0));
        }
    }

    // ----------------------------------------- Algorithm -----------------------------------------

    for (let i = 0; i < 128; i++) { // Simplified representation of all the communities present in the network.

        if (i < 32) {
            communities[i] = 1;

        } else if (i < 64) {
            communities[i] = 2;

        } else if (i < 96) {
            communities[i] = 3;

        } else {
            communities[i] = 4;
        }
    }

    for (let i = 0; i < 128; i++) { // Generating 127 nodes, distributed in 4 groups, from GN benchmark network.

        if (i < 32) {
            nodes[i] = {id: i, group: 1};

        } else if (i < 64) {
            nodes[i] = {id: i, group: 2};

        } else if (i < 96) {
            nodes[i] = {id: i, group: 3};

        } else {
            nodes[i] = {id: i, group: 4};
        }
    }

    nodes = reShuffle(shuffle(nodes)); // Shuffles nodes set, maintaining them organized in blocks of 32.

    for (i = 0; i < 128; i++) { // Establishing connections between nodes from the same groups.

        rightGroup = includeGroup(nodes, nodes[i]); // Restricts possible connections of "nodes[i]" to the ones belonging to the same group and excluding itself.

        loop:
            while (number_neighbour_nodes(nodes[i], matrix) < in_degree) { // Checks if source node "nodes[i]" still have available connections to be made. Iterates until being complete.

                let j = Math.round(Math.random() * (rightGroup.length - 1)); // Trying different target nodes in a randomized way.

                while (check(nodes[i], rightGroup[j], matrix) || number_neighbour_nodes(rightGroup[j], matrix) >= in_degree) { // Checks if target node "rightGroup[j]" still have available connections to be made.

                    rightGroup = exclude(rightGroup, rightGroup[j]); // Excluding non-connectable node "rightGroup[j]" from "rightGroup".

                    if (rightGroup.length === 0) break loop; // In case of being impossible to complete the set of connections of nodes[i], the "loop" cycle is broken.

                    j = Math.round(Math.random() * (rightGroup.length - 1)); // Trying different target nodes in a randomized way.

                }

                if(!cyto) {
                    edges.push({source: nodes[i].id, target: rightGroup[j].id, value: 1}); // Pushing recently formed edges to "edges" array.
                } else {
                    edges.push({data: {source: nodes[i].id, target: rightGroup[j].id, value: 1}}); // Pushing recently formed edges to "edges" array.
                }

                matrix[nodes[i].id][rightGroup[j].id] = 1; // Representing nodes connections in the adjacency matrix.
                matrix[rightGroup[j].id][nodes[i].id] = 1; // Symmetric matrix.

            }

        reset(i, complete(matrix, nodes[i].group)); // Based on the state of the 2 input arguments, it resets the execution in a different way.
    }

    shuffle(nodes); // Completely shuffles nodes present in array "nodes".
    edges = edges_group;

    for (let ii = 0; ii < 128; ii++) { // Establishing connections between nodes from different groups.

        rightGroup = exceptGroup(nodes, nodes[ii]); // Restricts possible connections of "nodes[ii]" to the ones belonging to different groups.

        loop:
            while (number_neighbour_different_nodes(nodes[ii], matrix2, nodes) < out_degree) { // Checks if source node "nodes[ii]" still have available connections to be made. Iterates until being complete.

                let j = Math.round(Math.random() * (rightGroup.length - 1)); // Trying different target nodes in a randomized way.

                while (check(nodes[ii], rightGroup[j], matrix2) || number_neighbour_different_nodes(rightGroup[j], matrix2, nodes) >= out_degree) { // Checks if target node "rightGroup[j]" still have available connections to be made.

                    rightGroup = exclude(rightGroup, rightGroup[j]); // Excluding non-connectable node "rightGroup[j]" from "rightGroup".

                    if (rightGroup.length === 0) { // In case of being impossible to complete the set of connections of nodes[ii], the "loop" cycle is broken and the "ii" variable reset to -1.

                        ii = -1; // The final goal is to reset ii to 0 at the beginning of the outmost cycle.
                        matrix2 = Array(128).fill().map(() => Array(128).fill(0)); // Reset adjacency matrix "matrix2".
                        edges2 = []; // Reset edges array "edges2".
                        break loop;
                    }

                    j = Math.round(Math.random() * (rightGroup.length - 1)); // Trying different target nodes in a randomized way.

                }

                if(!cyto) {
                    edges2.push({source: nodes[ii].id, target: rightGroup[j].id, value: 1}); // Pushing recently formed edges to "edges2" array.
                } else {
                    edges2.push({data: {source: nodes[ii].id, target: rightGroup[j].id, value: 1}}); // Pushing recently formed edges to "edges2" array.
                }

                matrix2[nodes[ii].id][rightGroup[j].id] = 1; // Representing nodes connections in the adjacency matrix.
                matrix2[rightGroup[j].id][nodes[ii].id] = 1; // Symmetric matrix.

            }

    }

    final_matrix = matrixAddition(matrix2, final_matrix); // Adjacency matrix resulting from all the previous established connections.
    edges = edges.concat(edges2); // Concatenates edges from 1st and 2nd cycles (above).

    /*
    let auxii = 0;
    while (auxii < nodes.length) {
        console.log(nodes[auxii].id + "-" + number_neighbour_nodes(nodes[auxii],final_matrix));
        auxii++;
    }
    */
    console.log("Done");

    // Assembling output in a final object compound of nodes, edges and communities arrays.
    if(!cyto) {

        result["nodes"] = nodes;

    } else {

        for (let i = 0; i < 128; i++) { // Generating 127 nodes, distributed in 4 groups, from GN benchmark network.

            if (i < 32) {
                nodes[i] = {data: {id: i, weight: 1}};

            } else if (i < 64) {
                nodes[i] = {data: {id: i, weight: 2}};

            } else if (i < 96) {
                nodes[i] = {data: {id: i, weight: 3}};

            } else {
                nodes[i] = {data: {id: i, weight: 4}};
            }
        }
    }

    result["nodes"] = nodes;
    result["links"] = edges;
    result["communities"] = communities;

    return result;

};

// Exporting results to be used in server.js.
module.exports = {
    jGirvan_Newman: jGirvan_Newman
};