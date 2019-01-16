// --------------------------------------- Layered Label Propagation Algorithm ----------------------------------------

// The algorithms execute in rounds, and at the beginning of each
// round every node has a label representing the cluster that the node currently belongs (at the beginning, every node
// has a different label). At each round, every node will update its label according to some rule, the update order being
// chosen at random at the beginning of the round; the algorithm terminates as soon as no more updates take place. Label
// propagation algorithms differ from each other on the basis of the update rule.

// Self-Invoking Function (It is not anymore) -> Anonymous self-invoking function (function without name): (function () {...}) ()
jLayeredLabelPropagation = function () { // A function expression can be stored in a variable. After a function expression has been
    // stored in a variable, the variable can be used as a function. Functions stored in variables do not need function
    // names. They are always invoked (called) using the variable name.

    //Constant
    let __MIN = 0.0000001; // Below this difference of actual versus previous modularity generate_dendogram() function stops.

    // Global Variables
    let original_graph_nodes; // Input in the core() of the algorithm.
    let original_graph_edges; // Input in the core() of the algorithm.
    let original_graph = {}; // Input in the core() of the algorithm.
    let partition_init; // Input in the core() of the algorithm. May not be used (depending if it is used in the HTML file or not).

    // ----------------------------------------- Helpers -----------------------------------------

    function get_neighbours_of_node(graph, node) {
        if (typeof graph._assoc_mat[node] === 'undefined') { // In case we are looking for a node not connected. In
            // other words, for an empty array inside the _assoc_mat array.
            return []; // Returns an empty array of neighbours.
        }
        return Object.keys(graph._assoc_mat[node]); // Returns the position of each value that exists:
        // var object1 = [2,,0,0,,2] -> Array ["0", "2", "3", "5"].
    }
    // Printing an ARRAY with all neighbours of input node ID.

    function make_assoc_mat(edge_list) {
        let mat = {}; // It is not an array. It is a list:
        // Object { {source: 3, target: 5, weight: 1.5}, {source: 1, target: 2, weight: 1.99}, {source: 30, target: 2, weight: 3.14} ...}
        edge_list.forEach(function (edge) {
            mat[edge.source] = mat[edge.source] || {}; // Important because many edges share the same nodes. And, in
            // order to include an element in a 2D matrix, we need to 1st create a
            mat[edge.source][edge.target] = 1;
            mat[edge.target] = mat[edge.target] || {};
            mat[edge.target][edge.source] = 1;
        });
        return mat; // It is not an array (1 object containing others): Object { 1: Object { 2: 3 }, 2: Object { 2: 3 } }
    }
    // make_assoc_mat is only used once in the core.edges (to create _assoc_mat). Do not forget even objects inside objects are key:value pairs.

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

    function counter(obj) {

        let nodes = Object.keys(obj);
        let result = {};

        nodes.forEach(function (node) {

            let com = obj[node];

            result[com] = result[com] + 1 || 1;

        });

        return result;

    }

    // ----------------------------------------- Algorithm -----------------------------------------
    function __init_status(graph, status, part) { // Aim of this function is to keep an up to date status of the
        // network through the following value calculations. Part refers only to an initial partition. It may not
        // receive this argument. In this case, first if condition (below) applies.

        // Defining Status
        status['nodes_to_com'] = {}; // Nodes linked to the communities they belong. Key: Value pair. It takes the
        // value of -1 if node is not assigned to a community.

        // Only goal of next if condition is to update the status features above.
        if (typeof part === 'undefined') { // No communities defined among the nodes.
            graph.nodes.forEach(function (node, i) {
                status.nodes_to_com[node] = i; // Attributing each node to a different community.
            });
        } else { // In case there is a partition as function argument:
            graph.nodes.forEach(function (node) { // There are status features that are node specific.
                status.nodes_to_com[node] = part[node];
            });
        }
    }

    function __neighcom(node, graph, status) { // Communities in the neighborhood of a given node.

        let weights = {};
        let neighborhood = get_neighbours_of_node(graph, node);

        neighborhood.forEach(function (neighbour) {
            if (neighbour !== node) {
                let weight = graph._assoc_mat[node][neighbour] || 1; // weight is a number!
                let neighbourcom = status.nodes_to_com[neighbour];
                weights[neighbourcom] = (weights[neighbourcom] || 0) + weight;
            }
        });

        return weights; // Each value of the object correspond to the sum of the weights of the edges connecting
        // node to the respective community they belong. Each key is a different (ordered) community. Important for defining
        // the weight of links between communities (step 2 of the algorithm).
    }

    function __modifiedNeighCom(node, graph, status) { // Communities in the neighborhood of a given node.

        let neighbourWeights = __neighcom(node, graph, status);

        let communities = Object.keys(neighbourWeights);

        let result = {};

        let gamma = 0.5;

        communities.forEach(function (com) {

            result[com] = neighbourWeights[com] - gamma*(counter(status.nodes_to_com)[com]-neighbourWeights[com]);

        });

        return result;

    }

    function __dominates(node, graph, status) { // Communities in the neighborhood of a given node.

        let result = __modifiedNeighCom(node, graph, status);

        return result[status.nodes_to_com[node]] === Math.max(result);

    }

    function __dominantCommunity(node, graph, status) { // Communities in the neighborhood of a given node.

        let nrLabeledNodes = __modifiedNeighCom(node, graph, status);

        let result = getAllKeys(nrLabeledNodes);

        return result[Math.floor(Math.random()*(result.length))];

    }

    // After inserting or removing a node from a community is fundamental to update community ID. When node is removed, it will be place in community -1.
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

    function algorithmIteration(graph, part_init) {

        let status = {};

        __init_status(original_graph, status, part_init);

        let aux2 = 0;

        while (true) { // This cycle is not the one that removes or inserts nodes.
            let aux = false;

            let prev_nodes_to_com = status.nodes_to_com;

            let shuffledNodes = shuffle(graph.nodes);

            shuffledNodes.forEach(function (node) {

                if(__dominates(node, graph, status) === false) {

                    let best_com = __dominantCommunity(node, graph, status);

                    status.nodes_to_com[node] = +best_com;

                    aux = true;

                }

            });

            let next_nodes_to_com = status.nodes_to_com;

            if(prev_nodes_to_com===next_nodes_to_com) {break;}

            aux2++;

        }

        return __renumber(status.nodes_to_com)

    }

    let core = function () {

        return algorithmIteration(original_graph, partition_init); // Final output of the Label Propagation algorithm.

    };

    core.nodes = function (nodes) { // nodes are the input nodes coming from the HTML file.
        if (nodes.length > 0) { // Calling arguments of the function.
            original_graph_nodes = nodes; // Global variable.
        }

        return core;
    };

    core.edges = function (edges) { // edges are the input edges coming from the HTML file.
        if (typeof original_graph_nodes === 'undefined')
            throw 'Please provide the graph nodes first!';

        if (edges.length > 0) { // Calling arguments of the function.
            original_graph_edges = edges; // Global variable.
            let assoc_mat = make_assoc_mat(edges);
            original_graph = { // Global variable. Graph is an object with node (node), edge (edges) and weight (_assoc_mat) data.
                'nodes': original_graph_nodes,
                'edges': original_graph_edges,
                '_assoc_mat': assoc_mat
            };
        }

        return core;

    };

    core.partition_init = function (partition) { // Initial partition input in index.html.
        if (partition.length > 0) { // Calling arguments of the function.
            partition_init = partition;
        }
        return core;
    };

    return core;
};