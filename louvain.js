// -------------------------------------------- Louvain Algorithm --------------------------------------------

// Self-Invoking Function (It is not anymore) -> Anonymous self-invoking function (function without name): (function () {...}) ()
jLouvain = function () { // A function expression can be stored in a variable. After a function expression has been
    // stored in a variable, the variable can be used as a function. Functions stored in variables do not need function
    // names. They are always invoked (called) using the variable name.
    //Constants
    let __MIN = 0.0000001; // Below this difference of actual versus previous modularity generate_dendogram() function stops.

    // Global Variables
    let original_graph_nodes; // Input in the core() of the algorithm.
    let original_graph_edges; // Input in the core() of the algorithm.
    let original_graph = {}; // Input in the core() of the algorithm.
    let partition_init; // Input in the core() of the algorithm. May not be used (depending if it is used in the HTML file or not).
    let edge_index = {}; // edge_index[edge.source+'_'+edge.target] = ... Attributes an index to each edge. F


    // ----------------------------------------- Helpers -----------------------------------------
    function make_set(array) { // Receives array with repeated values. Returns one filtered (and ordered) with only the different ones.
        let set = {};
        array.forEach(function (d) {
            set[d] = true;
        });

        return Object.keys(set); // Object key receives an array or an object. It returns an array with the respective
        // array's position or keys, respectively. Moreover, it eliminates repeated values (present in array) in the final set.
    }
    // Set -> {{1: true}, {2: true}, {3: true}...} Returns an ARRAY of the keys (each key corresponds to a node).

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
    // false depending on the presence of such property in obj.

    function get_degree_for_node(graph, node) { // Node is a number ID. Graph is an object with 3 properties (nodes,
        // edges and _assoc_mat)
        let neighbours = graph._assoc_mat[node] ? Object.keys(graph._assoc_mat[node]) : []; // In case we are looking
        // for a node not connected, it defines neighbours as an empty array.
        let weight = 0;
        neighbours.forEach(function (neighbour) {
            let value = graph._assoc_mat[node][neighbour] || 1;
            if (node === neighbour) { // In case we are in community aggregation phase.
                value *= 2;
            }
            weight += value;
        });

        return weight;
    }
    // Returns ki. Sum of the weights of all links connecting to i (including itself).

    function get_neighbours_of_node(graph, node) {
        if (typeof graph._assoc_mat[node] === 'undefined') { // In case we are looking for a node not connected. In
            // other words, for an empty array inside the _assoc_mat array.
            return []; // Returns an empty array of neighbours.
        }

        return Object.keys(graph._assoc_mat[node]); // Returns the position of each value that exists:
        // var object1 = [2,,0,0,,2] -> Array ["0", "2", "3", "5"]
    }
    // Printing an ARRAY with all neighbours of input node ID.


    function get_edge_weight(graph, node1, node2) {
        return graph._assoc_mat[node1] ? graph._assoc_mat[node1][node2] : undefined;
    }
    // Returning specific weight of the edge defined by node1 and node2.

    function get_graph_size(graph) {
        let size = 0;
        graph.edges.forEach(function (edge) {

            size += edge.weight;

        });

        return size;
    }
    // Returning the sum of the property "weight" of all edges present in the vector edge (that comes from example.html)

    function add_edge_to_graph(graph, edge) { // Edge is an object that specifies the source node, target node, and weight.
        update_assoc_mat(graph, edge); // Updating assoc_mat with the new edge's weight.

        if (edge_index[edge.source+'_'+edge.target]) { // There is no weight to update in edge_index.
            graph.edges[edge_index[edge.source+'_'+edge.target]].weight = edge.weight; // Because it is already in edges
            // from example.html and edge_index (because of the next part). Update of the weight in example.html.
        } else {
            graph.edges.push(edge); // Add to edges file of example.html.
            edge_index[edge.source+'_'+edge.target] = graph.edges.length - 1; // Update edge_index with new value.
        }
    }
    // edge_index accumulates only the new edges that are added to edges (from index.html)

    function make_assoc_mat(edge_list) {
        let mat = {}; // It is not an array. It is a list:
        // Object { {source: 3, target: 5, weight: 1.5}, {source: 1, target: 2, weight: 1.99}, {source: 30, target: 2, weight: 3.14} ...}
        edge_list.forEach(function (edge) {
            mat[edge.source] = mat[edge.source] || {}; // Important because many edges share the same nodes. And, in
            // order to include an element in a 2D matrix, we need to 1st create a
            mat[edge.source][edge.target] = edge.weight;
            mat[edge.target] = mat[edge.target] || {};
            mat[edge.target][edge.source] = edge.weight;
        });
        return mat; // It is not an array (1 object containing others): Object { 1: Object { 2: 3 }, 2: Object { 2: 3 } }
    }
    // make_assoc_mat is only used once in the core.edges (to create _assoc_mat). Do not forget even objects inside objects are key:value pairs.

    function update_assoc_mat(graph, edge) {
        graph._assoc_mat[edge.source] = graph._assoc_mat[edge.source] || {}; // In case we are updating a node without connections.
        graph._assoc_mat[edge.source][edge.target] = edge.weight;
        graph._assoc_mat[edge.target] = graph._assoc_mat[edge.target] || {};
        graph._assoc_mat[edge.target][edge.source] = edge.weight;
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

    // ----------------------------------------- Algorithm -----------------------------------------
    function init_status(graph, status, part) { // Aim of this function is to keep an up to date status of the
        // network through the following value calculations. Part refers only to an initial partition. It may not
        // receive this argument. In this case, first if condition (below) applies.
        // Only needed because of community aggregation (update needed).

        // Defining Status
        status['nodes_to_com'] = {}; // Nodes linked to the communities they belong. Key: Value pair. It takes the
        // value of -1 if node is not assigned to a community.
        status['internals'] = {}; // Sum of the weights of the links inside each community.
        status['degrees'] = {}; // Sum of the weights of the links incident in each community.
        status['gdegrees'] = {}; // Sum of the weights of the links incident in each node.
        status['loops'] = {}; // Loop weight for each node.
        status['total_weight'] = get_graph_size(graph); //  Sum of the property "weight" of all edges present in the
        // vector edge (that comes from index.html)

        // Only goal of next if condition is to update the status features above.
        if (typeof part === 'undefined') { // No communities defined among the nodes.
            graph.nodes.forEach(function (node, i) {
                status.nodes_to_com[node] = i; // Attributing each node to a different community.
                let deg = get_degree_for_node(graph, node); // Sum of the weights of all links connecting to i.

                if (deg < 0)
                    throw 'Bad graph type, use positive weights!';

                status.degrees[i] = deg; // Sum of the weights of the links incident in each community.
                status.gdegrees[node] = deg; // Sum of the weights of the links incident in each node.
                // When every node is part of a different community, degrees = gdegrees.

                status.loops[node] = get_edge_weight(graph, node, node) || 0; // Inner loop edge weight.
                status.internals[i] = status.loops[node]; // This condition of if should be satisfied during community aggregation phase.
                // i is used for community calculations and node for node specific variables.
            });
        } else { // In case there is a partition as function argument:
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

    function __modularity(status) { // Only with graph.status, it is possible to calculate the respective modularity.
        let links = status.total_weight; // Total weight of the graph's edges.
        let result = 0.0;
        let communities = make_set(obj_values(status.nodes_to_com)); // Array with all the (non-repeated & ordered) communities present in the graph.

        communities.forEach(function (com) { // Iterating over all different communities.
            let in_degree = status.internals[com] || 0; // Sum of the weights of the links inside each community.
            let degree = status.degrees[com] || 0; // Sum of the weights of the links incident in each community.
            if (links !== 0) {
                result = result + in_degree / links - Math.pow((degree / (2.0 * links)), 2);
            }

        });

        return result; // Modularity of a given partition (defined by status).
    }

    function __neighcom(node, graph, status) { // Communities in the neighborhood of a given node.

        let weights = {};
        let neighborhood = get_neighbours_of_node(graph, node);

        neighborhood.forEach(function (neighbour) {
            if (neighbour !== node) {
                let weight = graph._assoc_mat[node][neighbour] || 1; // weight is a number!
                let neighbourcom = status.nodes_to_com[neighbour];
                weights[neighbourcom] = (weights[neighbourcom] || 0) + weight; // weights is an array!
            }
        });

        return weights; // Each value of the object correspond to the sum of the weights of the edges connecting
        // node to the respective community they belong. Each key is a different (ordered) community. Important for defining
        // the weight of links between communities (step 2 of the algorithm).
    }

    function __insert(node, com, weight, status) {
        // Inserting a node in a community (connected by a given weight) and modifying graph status.
        status.nodes_to_com[node] = +com; // Updating node community.
        status.degrees[com] = (status.degrees[com] || 0) + (status.gdegrees[node] || 0); // Updating the sum of the edges incident in community c.
        status.internals[com] = (status.internals[com] || 0) + weight + (status.loops[node] || 0); // Updating the sum of internal edges.
    }

    function __remove(node, com, weight, status) {
        // Removing node from community com and modifying status.
        status.degrees[com] = ((status.degrees[com] || 0) - (status.gdegrees[node] || 0));
        status.internals[com] = ((status.internals[com] || 0) - weight - (status.loops[node] || 0));
        status.nodes_to_com[node] = -1; // Important to renumber communities after removing an edge.
    }

    // After inserting or removing a node from a community is fundamental to update community ID. When node is removed, it will be placed in community -1.
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

    function __one_level(graph, status) { //Computes one level of the communities dendogram (without community aggregation).

        let modif = true; // Modifications made in terms of community members.
        let cur_mod = __modularity(status); // Current modularity.
        console.log(cur_mod);
        let new_mod = cur_mod; // New modularity value (between -1 and 1).

        while (modif) { // This cycle is not the one that removes or inserts nodes.
            cur_mod = new_mod;
            modif = false; // Only if best community is different from the actual one, the cycle will proceed.

            graph.nodes.forEach(function (node) {
                let com_node = status.nodes_to_com[node]; // Returning community of the input node.
                let degc_totw = (status.gdegrees[node] || 0) / (status.total_weight * 2.0); // To be used below. Defined here because it is node
                // /whole network specific.
                let neigh_communities = __neighcom(node, graph, status); // Returning an array of the communities in the neighborhood of input node.
                __remove(node, com_node, (neigh_communities[com_node] || 0.0), status); // function __remove(node, com, weight, status) {}. Status (which
                // includes nodes_to_com) is updated (inside __remove).
                let best_com = com_node;
                let best_increase = 0;
                let neigh_communities_entries = Object.keys(neigh_communities); // Make iterable;

                // Checking whether modularity increased by inserting removed node in each neighbor community (once at a time).
                neigh_communities_entries.forEach(function (com) {
                    let incr = neigh_communities[com] - (status.degrees[com] || 0.0) * degc_totw; // DeltaQ - Fundamental equation. This way,
                    // it is only needed to calculate those 2 community specific values.
                    if (incr > best_increase) { // Only the placement of the node in the community with higher increase will remain.
                        best_increase = incr;
                        best_com = com; // Identifying the community the node fits the best.
                    }
                });

                __insert(node, best_com, neigh_communities[best_com] || 0, status); // We insert the node in the
                // community there was a greater global modularity improvement. Status (which includes nodes_to_com) is updated (inside __insert).

                if (best_com !== com_node) {
                    modif = true; // Only in this situation the algorithm will keep looking for new ways of
                    // improving modularity (by inserting nodes into different communities).
                }
            });
            new_mod = __modularity(status);
            console.log(new_mod);


            if (new_mod - cur_mod < __MIN) { // var __MIN = 0.0000001; Even if best_com !== com_node, if new_mod - cur_mod < __MIN while
                // cycle is broken (after executing 1 complete cycle of tries).
                break;
            }
        }
    }

    // Community aggregation:
    function induced_graph(partition, graph) { // partition = __renumber(status.nodes_to_com) | current_graph/induced_graph
        let ret = {nodes: [], edges: [], _assoc_mat: {}}; // Output
        let w_prec, weight;

        // Add nodes from partition values
        let partition_values = obj_values(partition); // obj_values returns an array with each node community.
        ret.nodes = ret.nodes.concat(make_set(partition_values)); // Returns an ordered array without repeated values. Inserting community aggregated nodes
        // as in the input. array1.concat(array2) -> returns an array which is array1 and array2 joined.
        graph.edges.forEach(function (edge) {
            weight = edge.weight || 1; // For every edge placed between the same 2 nodes, the final weight is summed.
            let com1 = partition[edge.source]; // Source node community.
            let com2 = partition[edge.target]; // Target node community.
            w_prec = (get_edge_weight(ret, com1, com2) || 0); // get_edge_weight(graph, node1, node2) {}
            let new_weight = (w_prec + weight); // new_weight is not summing to itself.
            add_edge_to_graph(ret, {'source': com1, 'target': com2, 'weight': new_weight}); // Inserting community aggregated edges.
        });

        edge_index = {}; // Reset edge_index.

        return ret; // Returns final graph (ret) after community aggregation pass. This has updated nodes and edges.
    }

    // Partitioning drawn dendogram at an input level.
    function partition_at_level(dendogram, level) {
        let partition = clone(dendogram[0]); // partition = __renumber(status.nodes_to_com)
        for (let i = 1; i < level + 1; i++) { // If it is not possible to cut at the specified level, the function will
            // cut at the nearest below.
            Object.keys(partition).forEach(function (key) {
                let node = key;
                partition[node] = dendogram[i][key]; // CHANGE: com -> key. Once there is an init_status() before
                // partition_at_level(), it is the same. var com = partition[key];
            });
        }

        return partition; // partition = __renumber(status.nodes_to_com). A graph can be partitioned in different ways.
    }

    // Mother Function.
    function generate_dendogram(graph, part_init) {
        if (graph.edges.length === 0) { // In case we have a graph with no edges. Each node is a community.
            let part = {};
            graph.nodes.forEach(function (node) {
                part[node] = node;
            });
            return part;
        }
        let status = {};

        init_status(original_graph, status, part_init);
        let mod; // Modularity before 1 level partition.
        let status_list = []; // Set of partitions: dendogram.
        __one_level(original_graph, status); // Computes 1 level of the communities dendogram. Current status to determine when to stop.
        let new_mod = __modularity(status); // Modularity after 1 level partition.
        console.log(status.degrees); ///////////////////////
        let partition = __renumber(status.nodes_to_com); // Decreasing number of communities due to __one_level.
        status_list.push(partition);
        mod = new_mod;
        let current_graph = induced_graph(partition, original_graph); // Graph that results from partitioning the original. Graph
        // after 1st pass. Community aggregation.
        init_status(current_graph, status); // Resetting status.

        while (true) { // Keeps partitioning the graph until no significant modularity increase.
            __one_level(current_graph, status);
            new_mod = __modularity(status);
            if (new_mod - mod < __MIN) {
                break;
            }

            partition = __renumber(status.nodes_to_com);
            status_list.push(partition);

            mod = new_mod;
            current_graph = induced_graph(partition, current_graph);
            init_status(current_graph, status);
        }

        return status_list; // Dendogram is a set of ordered partitions.
    }

    let core = function () {
        let dendogram = generate_dendogram(original_graph, partition_init); // Global variables.

        return partition_at_level(dendogram, dendogram.length - 1);
    };

    core.nodes = function (nds) { // nds are the input nodes coming from the html file.
        if (nds.length > 0) { // Calling arguments of the function.
            original_graph_nodes = nds; // Global variable.
        }

        return core;
    };

    core.edges = function (edgs) { // edgs are the input edges coming from the html file.
        if (typeof original_graph_nodes === 'undefined')
            throw 'Please provide the graph nodes first!';

        if (edgs.length > 0) { // Calling arguments of the function.
            original_graph_edges = edgs; // Global variable.
            let assoc_mat = make_assoc_mat(edgs);
            original_graph = { // Global variable. Graph is an object with node (node), edge (edges) and weight (_assoc_mat) data.
                'nodes': original_graph_nodes,
                'edges': original_graph_edges,
                '_assoc_mat': assoc_mat
            };
        }

        return core;

    };

    core.partition_init = function (prttn) { // Initial partition input in index.html (not present).
        if (prttn.length > 0) { // Calling arguments of the function.
            partition_init = prttn;
        }
        return core;
    };

    // Final output of Louvain algorithm.
    return core;
};


// Accessing a function without () will return the function definition instead of the function result.

// (function () {
//   var x = "Hello!!";      // I will invoke myself
// })(); -> Self-Invoking Function

// The code inside a function is not executed when the function is defined. The code inside a function is executed when the function is invoked.

// Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope.
// Hoisting applies to variable declarations and to function declarations.
// Because of this, JavaScript functions can be called before they are declared:

// A JavaScript method is a property containing a function definition:
// var person = {
//   firstName: "John",
//   lastName : "Doe",
//   id       : 5566,
//   fullName : function() {
//     return this.firstName + " " + this.lastName;
//   }
// };