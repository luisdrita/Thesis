// -------------------------------------------- Infomap Algorithm --------------------------------------------

// [Description]
// The execution of this algorithm is also divided in 2 phases like in Louvain. Although, the optimization function is not the same.
// This time, instead of maximizing network's modularity, the goal is to find the minimum description length of the network. To calculate
// this quantity, map equation was used.

jInfomap = function (nds, edgs, __MIN) { // A function expression can be stored in a variable. After it has been
    // stored this way, it can be used as a function. Functions stored in variables do not need
    // names. They are always invoked using the variable name.

    //Constants
    //let __MIN = 0.0000001; // Below this difference of minimum description lengths, generate_dendogram() stops. And a tree is returned to the user.

    // Global Variables
    let original_graph_nodes; // Defined in the core() of the algorithm.
    let original_graph_edges; // Defined in the core() of the algorithm.
    let original_graph = {}; // Defined in the core() of the algorithm.
    let partition_init; // Defined in the core() of the algorithm. May not be used (depending on the user input).
    let edge_index = {}; // edge_index[edge.source+'_'+edge.target] = ... Attributes an index to each edge.

    // ----------------------------------------- Helpers -----------------------------------------
    function make_set(array) { // Receives an array with repeated values. Returns one filtered (and ordered) with only the different ones.
        let set = {};
        array.forEach(function (d) {
            set[d] = true;
        });

        return Object.keys(set); // Object.keys receives an array or an object. It returns an array with the respective
        // array's position or keys, respectively. Moreover, it eliminates repeated values (present in array) in the final set.
    }
    // Set -> {1: true, 2: true, 3: true...} Returns an ARRAY of the keys (each key corresponds to a node).

    function obj_values(obj) {
        let vals = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                vals.push(obj[key]);
            }
        }
        return vals;
    }
    // Returns an ARRAY of the values of the input object (in the same initial order). hasOwnProperty returns true or
    // false depending on the presence of such property in obj..

    function get_degree_for_node(graph, node) { // Node is a number ID. Graph is an object with 3 properties (nodes,
        // edges and _assoc_mat).
        let neighbours = graph._assoc_mat[node] ? Object.keys(graph._assoc_mat[node]) : []; // In case we are looking
        // for a node not connected, it defines neighbours as an empty array.
        let weight = 0;
        neighbours.forEach(function (neighbour) {
            let value = graph._assoc_mat[node][neighbour] || 1;
            if (node === neighbour) { // In case we have already performed 1 community aggregation step, Infomap
                // algorithm does not not consider self-loops during execution.
                value *= 2; // DIFFERENT!!!!
            }
            weight += value;
        });

        return weight;
    }
    // Returns the sum of the weights of all links connecting to node (again, there are not self-links in Infomap).

    function get_neighbours_of_node(graph, node) {
        if (typeof graph._assoc_mat[node] === 'undefined') { // In case we are looking for a node not connected, the
            // function returns an empty array.
            return [];
        }

        return Object.keys(graph._assoc_mat[node]); // Returns the position of each value that exists:
        // [2,,0,0,,2] -> Array ["0", "2", "3", "5"].
    }
    // Prints an ARRAY with all neighbours of input node ID.

    function get_edge_weight(graph, node1, node2) {
        return graph._assoc_mat[node1] ? graph._assoc_mat[node1][node2] : undefined;
    }
    // Returns specific weight of the edge defined by node1 and node2.

    function get_graph_size(graph) {
        let size = 0;
        graph.edges.forEach(function (edge) {
            size += edge.weight; // SHOULD NOT BE NECESSARY!!!
        });

        return size;
    }
    // Returns the sum of the property "weight" of all edges present in graph.edges.

    function add_edge_to_graph(graph, edge) { // Edge is an object that specifies the source node, target node, and weight.
        update_assoc_mat(graph, edge); // Updating assoc_mat with the new edge's weight.

        if (edge_index[edge.source+'_'+edge.target]) { // There is no weight to update in edge_index.
            graph.edges[edge_index[edge.source+'_'+edge.target]].weight = edge.weight; // Because it is already in edges
            // from example.html and edge_index (because of the next part). Update the weight in graph.edges.
        } else {
            graph.edges.push(edge); // Add edge to graph.edges.
            edge_index[edge.source+'_'+edge.target] = graph.edges.length - 1; // Update edge_index with new value.
        }
    }
    // edge_index accumulates only the new edges that are added to graph.edges.

    function make_assoc_mat(edge_list) {
        let mat = {}; // It is not an array. It is a list:
        // Object { {source: 3, target: 5, weight: 1.5}, {source: 1, target: 2, weight: 1.99}, {source: 30, target: 2, weight: 3.14} ...}
        edge_list.forEach(function (edge) {
            mat[edge.source] = mat[edge.source] || {}; // Important because many edges share the same nodes. In
            // order to include an element in a 2D matrix, we need to 1st create a list to insert it.
            mat[edge.source][edge.target] = edge.weight || 1;
            mat[edge.target] = mat[edge.target] || {};
            mat[edge.target][edge.source] = edge.weight || 1;
        });
        return mat; // It is not an array (1 object containing others): Object { 1: Object { 2: 3 }, 2: Object { 2: 3 } }
    }
    // make_assoc_mat is used once in the core.edges (to create _assoc_mat). Do not forget even objects inside objects are key/value pairs.

    function update_assoc_mat(graph, edge) {
        graph._assoc_mat[edge.source] = graph._assoc_mat[edge.source] || {}; // In case we are updating a node without
        // connections. Skip this step if updating weight value only.
        graph._assoc_mat[edge.source][edge.target] = edge.weight; // After community aggregation there always are weighted edges.
        graph._assoc_mat[edge.target] = graph._assoc_mat[edge.target] || {};
        graph._assoc_mat[edge.target][edge.source] = edge.weight; // After community aggregation there always are weighted edges.
    }
    // Matrix where i is the source and j the target node of the respective edge. The numeric value corresponds to the edge weight.

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

    // ----------------------------------------- Algorithm -----------------------------------------
    function init_status(graph, status, part) { // Aim of this function is to initialize network properties after Infomap
        // first execution or to update them after community aggregation.
        // Part refers to an initial partition that may be input by
        // the user with the initial graph data.

        // Defining Status
        status['nodes_to_com'] = {}; // Nodes linked to the communities they belong. Key: Value pair. It takes the
        // value of -1 if node is not assigned to a community.
        status['internals'] = {}; // Sum of the weights of all links inside a specified community.
        status['degrees'] = {}; // Sum of the weights of the links incident in each community.
        status['gdegrees'] = {}; // Sum of the weights of the links incident in each node.
        status['loops'] = {}; // Loop weight for each node.
        status['total_weight'] = get_graph_size(graph); //  Sum of the property "weight" of all edges present in graph.

        // Goal of next if condition is to update the status features above.
        if (typeof part === 'undefined') { // No part input.
            graph.nodes.forEach(function (node, i) {
                status.nodes_to_com[node] = i; // Each node belongs to a different community.
                let deg = get_degree_for_node(graph, node); // Sum of the weights of all links connecting to i.

                if (deg < 0)
                    throw 'Bad graph type, use positive weights!';

                status.degrees[i] = deg; // Sum of the weights of the links incident in each community.
                status.gdegrees[node] = deg; // Sum of the weights of the links incident in each node.
                // When every node is part of a different community, degrees = gdegrees.

                status.loops[node] = get_edge_weight(graph, node, node) || 0; // Inner loop edge weight.
                status.internals[i] = status.loops[node]; // After community aggregation step (and at the beginning of infomap algorithm execution), community internals are set to 0.
                // Variable "i" is used for community assignments and "node" for node specific variables.
            });
        } else { // In case there is a partition as function argument.
            graph.nodes.forEach(function (node) { // There are status features that are node specific.
                let com = part[node];
                status.nodes_to_com[node] = com;
                let deg = get_degree_for_node(graph, node);
                status.degrees[com] = (status.degrees[com] || 0) + deg; // Sum of the weights of the links incident in
                // each community is calculated by summing the weights of the edges incident in each node of the community.
                status.gdegrees[node] = deg; // Sum of the weights of the links incident in each node.
                let inc = 0.0;

                let neighbours = get_neighbours_of_node(graph, node); // Printing all the neighbours of input node.
                neighbours.forEach(function (neighbour) {
                    let weight = graph._assoc_mat[node][neighbour];

                    if (weight <= 0) {
                        throw "Bad graph type, use positive weights";
                    }

                    if (part[neighbour] === com) { // Following calculations are done only if the neighbour belongs to
                        // the same community as the input node under analysis.
                        if (neighbour === node) {
                            inc += weight;
                        } else {
                            inc += weight / 2.0; // Next time, neighbor will be the node and vice-versa.
                        }
                    }
                });
                status.internals[com] = (status.internals[com] || 0) + inc; // With inc we calculate the sum of the
                // weights inside each community by summing the edges between connected nodes and belonging to the same community.
            });
        }

    }

    function __mdl222(status) { // Minimum description length calculation. It is only needed status values to perform it.
        let links = status.total_weight; // Total weight of the graph's edges.
        let communities = make_set(obj_values(status.nodes_to_com)); // Array with all the (non-repeated & ordered) communities present in the graph.

        let nodes = make_set(Object.keys(status.nodes_to_com)); // Array with all the (non-repeated & ordered) node IDs present in the graph.

        // 4 integrating parts of the map equation.
        let mdl_a = 0;
        let mdl_b = 0;
        let mdl_c = 0;
        let mdl_d = 0;

        nodes.forEach(function (node) { // Iterating over each node in the network.
            let gdegree = status.gdegrees[node] || 0;

            if (links > 0) {

                mdl_c = mdl_c + ((gdegree) / (2 * links)) * Math.log((gdegree) / (2 * links));

            }

        });

        communities.forEach(function (com) { // Iterating over each community in the network.
            let in_degree = status.internals[com] || 0; // Sum of the weights of the links inside each community.
            let degree = status.degrees[com] || 0; // Sum of the weights of the links incident in each community.

            if (links > 0) {

                mdl_b = mdl_b + ((degree - 2 * in_degree) / (2 * links)) * Math.log((degree - 2 * in_degree) / (2 * links));
                mdl_a = mdl_a + (degree - 2 * in_degree) / (2 * links);
                mdl_d = mdl_d + ((degree - 2 * in_degree) / (2 * links) + degree / (2 * links)) * Math.log((degree - 2 * in_degree) / (2 * links) + degree / (2 * links));

            }

        });

        console.log(mdl_a*Math.log(mdl_a) - 2*mdl_b - mdl_c + mdl_d);

        return mdl_a*Math.log(mdl_a) - 2*mdl_b - mdl_c + mdl_d; // Minimum description length of a given partition (defined by status).

    }

    function __mdl22(status) { // Minimum description length calculation. It is only needed status values to perform it.
        let links = status.total_weight; // Total weight of the graph's edges.
        let result = 0.0;
        let communities = make_set(obj_values(status.nodes_to_com)); // Array with all the (non-repeated & ordered) communities present in the graph.

        communities.forEach(function (com) { // Iterating over all different communities.
            let in_degree = status.internals[com] || 0; // Sum of the weights of the links inside each community.
            let degree = status.degrees[com] || 0; // Sum of the weights of the links incident in each community.
            if (links > 0) {
                result = result + in_degree / links - Math.pow((degree / (2.0 * links)), 2);
            }

        });

        console.log(result);

        return result; // Modularity of a given partition (defined by status).

    }

    function __neighcom(node, graph, status) { // Communities in the neighborhood of a given node.

        let weights = {};
        let neighborhood = get_neighbours_of_node(graph, node);

        neighborhood.forEach(function (neighbour) {
            if (neighbour !== node) {
                let weight = graph._assoc_mat[node][neighbour] || 1; // weight is a number.
                let neighbourcom = status.nodes_to_com[neighbour];
                weights[neighbourcom] = (weights[neighbourcom] || 0) + weight; // weights is an array.
            }
        });

        return weights; // Each key corresponds to a different community. The respective value is the sum of all links
        // connecting "node" to other nodes present in the respective cluster.
    }

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

    function __one_level(graph, status) { // Computes one level of the communities dendogram (without community aggregation).

        let modif = true; // Modifications made in terms of community members.
        let cur_mdl = __mdl22(status); // Current description length.
        let new_mdl = cur_mdl; // New description length.

        while (modif) { // This cycle is not the one that removes or inserts nodes.
            cur_mdl = new_mdl;
            modif = false; // Only if best community is different from the actual one, the cycle may proceed.

            let shuffledNodes = shuffle(graph.nodes);

            shuffledNodes.forEach(function (node) {
                let com_node = status.nodes_to_com[node]; // Returning community of the input node.
                // /whole network specific.
                let neigh_communities = __neighcom(node, graph, status); // Returning an array of the communities in the neighborhood of input node.
                 // function __remove(node, com, weight, status) {}. Status (which
                // includes nodes_to_com) is updated (inside __remove).
             //   let best_increase = __mdl22(status);

                status.degrees[com_node] = (status.degrees[com_node] || 0) - (status.gdegrees[node] || 0);
                status.internals[com_node] = (status.internals[com_node] || 0) - (neigh_communities[com_node] || 0) - (status.loops[node] || 0);
                status.nodes_to_com[node] = -1; // Updating node community.

                let best_com = com_node;
                 let best_increase = 0;
                let neigh_communities_entries = Object.keys(neigh_communities); // Make iterable;
                // Checking whether description length increased by inserting removed node in each neighbor community (once at a time).

                neigh_communities_entries.forEach(function (com) {
                    status.nodes_to_com[node] = +com; // Updating node community.
                    status.degrees[com] = (status.degrees[com] || 0) + (status.gdegrees[node] || 0); // Updating the sum of the edges incident in community c.
                    status.internals[com] = (status.internals[com] || 0) + (neigh_communities[com] || 0) + (status.loops[node] || 0); // Updating the sum of internal edges.
                    let incr = __mdl22(status); // DeltaQ - Fundamental equation. This way,
                    // it is only needed to calculate those 2 community specific values.

                    if (incr > best_increase) { // Only the placement of the node in the community with higher increase will remain.
                        best_increase = incr;
                        best_com = com; // Identifying the community
                        // the node fits the best.
                    }

                    status.degrees[com] = ((status.degrees[com] || 0) - (status.gdegrees[node] || 0));
                    status.internals[com] = (status.internals[com] || 0) - (neigh_communities[com] || 0) - (status.loops[node] || 0);
                    status.nodes_to_com[node] = -1;

                });

                status.nodes_to_com[node] = +best_com;
                status.degrees[best_com] = (status.degrees[best_com] || 0) + (status.gdegrees[node] || 0);
                status.internals[best_com] = (status.internals[best_com] || 0) + (neigh_communities[best_com] || 0) + (status.loops[node] || 0);

                if (best_com !== com_node) {
                    modif = true; // Only in this situation the algorithm will keep looking for new ways of
                    // minimizing MAP equation.
                }
            });
            new_mdl = __mdl22(status);

            if (new_mdl - cur_mdl < 0.00000001) { // Even if best_com !== com_node, if new_mdl - cur_mdl < __MIN
                // cycle is broken.
                break;
            }

        }
    }

    // Community aggregation:
    function induced_graph(partition, graph) { // partition has status.nodes_to_com format.
        let ret = {nodes: [], edges: [], _assoc_mat: {}}; // Output.
        let w_prec, weight;

        // Add nodes from partition values
        let partition_values = obj_values(partition); // obj_values returns an array with each node community.
        ret.nodes = ret.nodes.concat(make_set(partition_values)); // Returns an ordered array without repeated values. Inserting community aggregated nodes
        // as in the input. array1.concat(array2) -> returns an array which is array1 and array2 joined.
        graph.edges.forEach(function (edge) {
            weight = edge.weight || 1; // For every edge placed between the same 2 nodes, the final weight is summed.
            let com1 = partition[edge.source]; // Source node community.
            let com2 = partition[edge.target]; // Target node community.
            w_prec = (get_edge_weight(ret, com1, com2) || 0); // get_edge_weight(graph, node1, node2) {}.
            let new_weight = (w_prec + weight); // new_weight is not summing to itself.
            add_edge_to_graph(ret, {'source': com1, 'target': com2, 'weight': new_weight}); // Inserting community aggregated edges.
        });

        edge_index = {}; // Reset edge_index.

        return ret; // Returns final graph (ret) after community aggregation pass. This has updated nodes and edges.
    }

    // Partitioning drawn dendogram at an input level.
    function partition_at_level(dendogram, level) {
        let partition = clone(dendogram[0]);
        for (let i = 1; i < level + 1; i++) { // If it is not possible to cut at the specified level, the function will
            // cut at the nearest below.
            Object.keys(partition).forEach(function (key) {
                partition[key] = dendogram[i][key]; // CHANGE: com -> key. Once there is an init_status() before
                // partition_at_level(), it is the same. var com = partition[key];
            });
        }

        return partition; // A graph can be partitioned in different ways.
    }

    // Mother Function.
    function generate_dendogram(graph, part_init) {
        if (graph.edges.length === 0) { // In case we have a graph with no edges. Each node is a different community.
            let part = {};
            graph.nodes.forEach(function (node) {
                part[node] = node;
            });
            return part;
        }
        let status = {};

        init_status(original_graph, status, part_init);
        let mdl; // Description length before 1 level partition.
        let status_list = []; // Set of partitions: dendogram.
        __one_level(original_graph, status); // Computes 1 level of the communities dendogram. Current status to determine when to stop.
        let new_mdl = __mdl22(status); // Description length after 1 level partition.
        let partition = __renumber(status.nodes_to_com); // Decreasing number of communities due to __one_level.
        status_list.push(partition);
        mdl = new_mdl;
        let current_graph = induced_graph(partition, original_graph); // Graph that results from partitioning the original. Graph
        // after 1st pass. Community aggregation.
        init_status(current_graph, status); // Resetting status.

        while (true) { // Keeps partitioning the graph while minimum description length remains real.
            __one_level(current_graph, status);
            new_mdl = __mdl22(status);
            if (new_mdl - mdl < 0.00000001) {
                break;
            }

            partition = __renumber(status.nodes_to_com);
            status_list.push(partition);

            mdl = new_mdl;
            current_graph = induced_graph(partition, current_graph);
            init_status(current_graph, status);
        }

        return status_list; // Dendogram is a set of ordered partitions.
    }

    if (nds.length > 0) {
        original_graph_nodes = nds; // Global variable.
        original_graph_edges = edgs; // Global variable.

        let assoc_mat = make_assoc_mat(edgs);
        original_graph = { // Global variable. Graph is an object with node (node), edge (edges) and weight (_assoc_mat) properties.
            'nodes': original_graph_nodes,
            'edges': original_graph_edges,
            '_assoc_mat': assoc_mat
        };
    }

    let dendogram = generate_dendogram(original_graph, partition_init); // Global variables.

    // Output of Infomap algorithm.
    return partition_at_level(dendogram, dendogram.length - 1);
};

module.exports = {
    jInfomap: jInfomap
};