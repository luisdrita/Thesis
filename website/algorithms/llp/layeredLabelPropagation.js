// --------------------------------------- Layered Label Propagation Algorithm ----------------------------------------

// [Description]
// The update rule distinguishes LLP from Label Propagation. Instead of limiting the community choice to the one that
// is predominant among the nodes in the neighborhood, it takes into account a factor that considers the labeled nodes
// in the complete network. In fact, both algorithm versions are equivalent whenever this factor is considered 0.


jLayeredLabelPropagation = function (nds, edgs, gamma, steps_input) { // A function expression can be stored in a variable. After it has been
    // stored this way, it can be used as a function. Functions stored in variables do not need
    // names. They are always invoked using the variable name.

    // Global Variables
    let original_graph_nodes; // Defined in the core() of the algorithm.
    let original_graph_edges; // Defined in the core() of the algorithm.
    let original_graph = {}; // Defined in the core() of the algorithm.
    let partition_init; // Defined in the core() of the algorithm. May not be used (depending on the user input).
    let steps = 0;

    // ----------------------------------------- Helpers -----------------------------------------

    function get_neighbours_of_node(graph, node) {
        if (typeof graph._assoc_mat[node] === 'undefined') { // In case we are looking for a node not connected, the
            // function returns an empty array.
            return [];
        }
        return Object.keys(graph._assoc_mat[node]); // Returns the position of each value that exists:
        // [2,,0,0,,2] -> Array ["0", "2", "3", "5"].
    }
    // Prints an ARRAY with all neighbours of input node ID.

    function make_assoc_mat(edge_list) {
        let mat = {}; // It is not an array. It is a list:
        // Object { {source: 3, target: 5, weight: 1.5}, {source: 1, target: 2, weight: 1.99}, {source: 30, target: 2, weight: 3.14} ...}
        edge_list.forEach(function (edge) {
            mat[edge.source] = mat[edge.source] || {}; // Important because many edges share the same nodes. In
            // order to include an element in a 2D matrix, we need to 1st create a list to insert it.
            mat[edge.source][edge.target] = 1;
            mat[edge.target] = mat[edge.target] || {};
            mat[edge.target][edge.source] = 1;
        });
        return mat; // It is not an array (1 object containing others): Object { 1: Object { 2: 3 }, 2: Object { 2: 3 } }
    }
    // make_assoc_mat is used once in the core.edges (to create _assoc_mat). Do not forget even objects inside objects are key/value pairs.

    function clone(obj) {
        if (obj === null || typeof(obj) !== 'object')
            return obj;

        let temp = obj.constructor();

        for (let key in obj) {
            temp[key] = clone(obj[key]);
        }

        return temp;
    }
    // Copy paste operation. This is important because: I have an object x. I'd like to copy it as object y, such that changes to y do not modify x.

    function getAllKeys(obj) {
        let values = Object.values(obj);
        let max = Math.max.apply(null, values);
        let keys = Object.keys(obj);
        let result = [];
        keys.forEach(function (key) {
            if(obj[key]===max) {
                result.push(key);
            }
        });

        return result;
    }
    // Returns an array with the keys of the maximum values present in the input object.

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
    // Returns the input vector but randomly shuffled.

    function counter(obj) {

        let nodes = Object.keys(obj);
        let result = {};

        nodes.forEach(function (node) {

            let com = obj[node];

            result[com] = (result[com] || 0) + 1;

        });

        return result;
    }
    // Returns an object in which each key is a different community and each value is the number of members.

    // ----------------------------------------- Algorithm -----------------------------------------
    function __init_status(graph, status, part) { // Aim of this function is to initialize network properties. This
        // means, attribute one different community to every node.
        // Part refers to an initial partition that may be input by the user with the initial graph data.

        // Defining Status
        status['nodes_to_com'] = {}; // Nodes linked to the communities they belong to. Key/value pairs. It takes the
        // value of -1 if a node is not assigned to a community.

        // Goal of next if condition is to update status['nodes_to_com'].
        if (typeof part === 'undefined') { // No part input.
            graph.nodes.forEach(function (node, i) {
                status.nodes_to_com[node] = i; // Each node belongs to a different community.
            });
        } else { // In case there is a partition as function argument.
            graph.nodes.forEach(function (node) { // There are status features that are node specific.
                status.nodes_to_com[node] = part[node];
            });
        }
    }

    function __modifiedNeighCom(node, graph, status) { // Communities in the neighborhood of a given node.

        let weights = {};
        let neighborhood = get_neighbours_of_node(graph, node);
        let result = {};

        neighborhood.forEach(function (neighbour) {
            if (neighbour !== node) {
                let weight = graph._assoc_mat[node][neighbour] || 1; // weight is a number.
                let neighbourcom = status.nodes_to_com[neighbour];
                weights[neighbourcom] = (weights[neighbourcom] || 0) + weight; // weights is an array.
            }
        });

        let neighbourWeights = weights; // Each key corresponds to a different community. The respective value is the sum of all links
        // connecting "node" to other nodes present in the respective cluster.
        let communities = Object.keys(neighbourWeights);

        communities.forEach(function (com) {

            result[com] = neighbourWeights[com] - gamma*(counter(status.nodes_to_com)[com]-neighbourWeights[com]);

        });

        return result;

    }

    function __dominates(node, graph, status) {

        let result = __modifiedNeighCom(node, graph, status);

        return result[status.nodes_to_com[node]] === Math.max(result);

    }
    // It returns a Boolean dependent on the community the node belongs to (whether it maximizes LLP equation).

    function __dominantCommunity(node, graph, status) {

        let nrLabeledNodes = __modifiedNeighCom(node, graph, status);
        let result = getAllKeys(nrLabeledNodes);

        return result[Math.floor(Math.random()*(result.length))];

    }
    // Randomly returns one of the dominant communities.


    // After inserting or removing a node from a community it is fundamental to update community ID. When node is removed, it will be placed in community -1.
    function __renumber(dict) { // dict = status.nodes_to_com
        let count = 0;
        let ret = clone(dict); // Function output (deep copy)
        let new_values = {};
        let dict_keys = Object.keys(dict); // Getting node IDs. {1: 1, 2: 2, 3: 3...}
        dict_keys.forEach(function (key) {
            let value = dict[key]; // Node's community.
            let new_value = typeof new_values[value] === 'undefined' ? -1 : new_values[value];
            if (new_value === -1) {
                new_values[value] = count;
                new_value = count;
                count = count + 1;
            }
            ret[key] = new_value; // {1: , 2: , 3: ,...}
        });

        return ret; // Returns an object similar to nodes_to_com. Although, each node's community is defined in an
        // ordered way like the nodes. Every single community will come across count. Communities already identified
        // in previous nodes will be assigned to future ones.
    }

    function __algorithmIteration(graph, part_init) { // Layered Label Propagation iteration.

        let status = {};

        __init_status(original_graph, status, part_init);

        while (true) { // This cycle is not the one that removes or inserts nodes.

            let prev_nodes_to_com = status.nodes_to_com;
            let shuffledNodes = shuffle(graph.nodes);

            shuffledNodes.forEach(function (node) {

                if(__dominates(node, graph, status) === false) {

                    let best_com = __dominantCommunity(node, graph, status);

                    status.nodes_to_com[node] = +best_com;

                }

            });

            console.log("Working...");

            let next_nodes_to_com = status.nodes_to_com;

            steps++;

            if(prev_nodes_to_com===next_nodes_to_com || steps === steps_input) break;

        }

        return __renumber(status.nodes_to_com) // At the end, the initial number of communities decreased. Thus, a numbering update was needed.

    }

        if (nds.length > 0) {

            original_graph_nodes = nds;
            original_graph_edges = edgs; // Global variable.

            let assoc_mat = make_assoc_mat(edgs);
            original_graph = { // Global variable. Graph is an object with node (node), edge (edges) and weight (_assoc_mat) data.
                'nodes': original_graph_nodes,
                'edges': original_graph_edges,
                '_assoc_mat': assoc_mat
            };
        }

    return __algorithmIteration(original_graph, partition_init);
};

module.exports = {
    jLayeredLabelPropagation: jLayeredLabelPropagation
};