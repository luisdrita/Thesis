 // Self-Invoking Function -> Anonymous self-invoking function (function without name): (function () {...}) ()
	jLouvain = function () { // A function expression can be stored in a variable. After a function expression has been stored in a variable, the variable can be used as a function. Functions stored in variables do not need function names. They are always invoked (called) using the variable name.
		//Constants
		var __PASS_MAX = -1; // Needed in "Algorithm" section.
		var __MIN = 0.0000001; // Below this value

		//Local vars
		var original_graph_nodes;
		var original_graph_edges;
		var original_graph = {};
		var partition_init;
		var edge_index = {}; // edge_index[edge.source+'_'+edge.target] = ... Attributes an index to each edge.

		// ----------------------------------------- Helpers -----------------------------------------
		function make_set(array) { // Receives array with repeated values. Returns one filtered (and ordered) with only the different ones.
			var set = {};
			array.forEach(function (d) {
				set[d] = true;
			});

			return Object.keys(set); // Object key receives an array or an object. It returns an array with the respective array's position or keys, respectively. Moreover, it eliminates repeated values (present in array) in the final set.
		}
		// Set -> {{1: true}, {2: true}, {3: true}...} Returns an ARRAY of the keys (each key corresponds to a node).

		function obj_values(obj) {
			var vals = [];
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					vals.push(obj[key]);
				}
			}
			return vals;
		}
		// Returns an ARRAY of the values of the input object (in the same initial order). hasOwnProperty returns true or false depending on the presence of such property in obj.

		function get_degree_for_node(graph, node) { // Node is a number ID.
			var neighbours = graph._assoc_mat[node] ? Object.keys(graph._assoc_mat[node]) : []; // In case we are looking for a node not connected, it defines neighbours as an empty array.
			var weight = 0;
			neighbours.forEach(function (neighbour) {
				var value = graph._assoc_mat[node][neighbour] || 1;
				if (node === neighbour) { // In case we are in community aggregation phase.
					value *= 2;
				}
				weight += value;
			});

			return weight;
		}
		// Returns ki. Sum of the weights of all links connecting to i (including itself).

		function get_neighbours_of_node(graph, node) {
			if (typeof graph._assoc_mat[node] === 'undefined') { // In case we are looking for a node not connected. In other words, for an empty array inside the _assoc_mat array.
				return []; // Returns an empty array of neighbours.
			}

			var neighbours = Object.keys(graph._assoc_mat[node]); // Returns the position of each value that exists: var object1 = [2,,0,0,,2] -> Array ["0", "2", "3", "5"]

			return neighbours;
		}
		// Printing an ARRAY with all neighbours of input node ID.


		function get_edge_weight(graph, node1, node2) {
			return graph._assoc_mat[node1] ? graph._assoc_mat[node1][node2] : undefined;
		}
		// Returning specific weight of the edge defined by node1 and node2.

		function get_graph_size(graph) {
			var size = 0;
			graph.edges.forEach(function (edge) {
				size += edge.weight;
			});

			return size;
		}
		// Returning the sum of the property "weight" of all edges present in the vector edge (that comes from example.html)

		function add_edge_to_graph(graph, edge) { // Edge is an object that specifies the source node, target node, and weight.
			update_assoc_mat(graph, edge); // Updating assoc_mat with the new edge's weight.
			
			if (edge_index[edge.source+'_'+edge.target]) {
				graph.edges[edge_index[edge.source+'_'+edge.target]].weight = edge.weight; // Because it is already in edges from example.html and edge_index (because of the next part). Update of the weight in example.html.
			} else {
				graph.edges.push(edge); // Add to edges file of example.html.
				edge_index[edge.source+'_'+edge.target] = graph.edges.length - 1; // Update edge_index with new value.
			}
		}
		// edge_index accumulates only the new edges that are added to edges (from index.html)

		function make_assoc_mat(edge_list) {
			var mat = {}; // It is not an array. It is a list: Object { {source: 3, target: 5, weight: 1.5}, {source: 1, target: 2, weight: 1.99}, {source: 30, target: 2, weight: 3.14} ...}
			edge_list.forEach(function (edge) {
				mat[edge.source] = mat[edge.source] || {}; // Important because many edges share the same nodes. And, in order to include an element in a 2D matrix, we need to 1st create a
				mat[edge.source][edge.target] = edge.weight;
				mat[edge.target] = mat[edge.target] || {};
				mat[edge.target][edge.source] = edge.weight;
			});
			return mat; // It is not an array (1 object containing others): Object { 1: Object { 2: 3 }, 2: Object { 2: 3 } }
		}
		// Create assoc_mat for the 1st time. Do not forget even objects inside objects are key:value pairs.

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

			var temp = obj.constructor();

			for (var key in obj) {
				temp[key] = clone(obj[key]);
			}

			return temp;
		}
		// It only returns the structure of the input object (not the content).

		// ----------------------------------------- Algorithm -----------------------------------------
		function init_status(graph, status, part) { // Aim of this function is to keep an up to date status of the
			// network through the following value calculations. Part refers only to an initial partition. It may not receive this argument. In this case, first if condition (below) applies.

			// Defining Status
			status['nodes_to_com'] = {}; // Nodes linked to the communities they belong. Key: Value pair. It takes the value of -1 if node is not assigned to a community.
			status['total_weight'] = 0;
			status['internals'] = {}; // Sum of the weights of the links inside each community.
			status['degrees'] = {}; // Sum of the weights of the links incident in each community.
			status['gdegrees'] = {}; // Sum of the weights of the links incident in each node.
			status['loops'] = {}; // Loop weight for each node.
			status['total_weight'] = get_graph_size(graph); //  Sum of the property "weight" of all edges present in the vector edge (that comes from index.html)

			if (typeof part === 'undefined') { // No communities defined among the nodes.
				graph.nodes.forEach(function (node, i) {
					status.nodes_to_com[node] = i; // Attributing each node to a different community.
					var deg = get_degree_for_node(graph, node); // Sum of the weights of all links connecting to i.

					if (deg < 0)
						throw 'Bad graph type, use positive weights!';

					status.degrees[i] = deg; // Sum of the weights of the links incident in each community.
					status.gdegrees[node] = deg; // Sum of the weights of the links incident in each node.
					// When every node is part of a different community, degrees = gdegrees.

					status.loops[node] = get_edge_weight(graph, node, node) || 0; // Inner loop edge weight.
					status.internals[i] = status.loops[node]; // This condition of if should be satisfied during community aggregation phase.
					// i is used for community calculations and node for node specific variables.
				});
			} else { // If communities are defined in the initial nodes
				graph.nodes.forEach(function (node) {
					var com = part[node];
					status.nodes_to_com[node] = com;
					var deg = get_degree_for_node(graph, node);
					status.degrees[com] = (status.degrees[com] || 0) + deg; // Sum of the weights of the links incident in each community is calculated by summing the weights of the edges incident in each node of the community.
					status.gdegrees[node] = deg; // Sum of the weights of the links incident in each node.
					var inc = 0.0;

					var neighbours = get_neighbours_of_node(graph, node); // Printing all the neighbours of input node.
					neighbours.forEach(function (neighbour) {
						var weight = graph._assoc_mat[node][neighbour];

						if (weight <= 0) {
							throw "Bad graph type, use positive weights";
						}

						if (part[neighbour] === com) { // Following calculations are done only if the neighbour belongs to the same community as the input node under analysis.
							if (neighbour === node) {
								inc += weight;
							} else {
								inc += weight / 2.0; // Next time, neighbor will be the node and vice-versa.
							}
						}
					});
					status.internals[com] = (status.internals[com] || 0) + inc; // With inc we calculate the sum of the weights inside each community by summing the edges between connected nodes and belonging to the same community.
				});
			}
		}

		function __modularity(status) {
			var links = status.total_weight; // Total weight of the graph's edges.
			var result = 0.0;
			var communities = make_set(obj_values(status.nodes_to_com)); // Array with all the (non-repeated) communities present in the graph.

			communities.forEach(function (com) {
				var in_degree = status.internals[com] || 0; // Sum of the weights of the links inside each community.
				var degree = status.degrees[com] || 0; // Sum of the weights of the links incident in each community.
				if (links > 0) {
					result = result + in_degree / links - Math.pow((degree / (2.0 * links)), 2);
				}
			});

			return result;
		}

		function __neighcom(node, graph, status) {

			var weights = {};
			var neighboorhood = get_neighbours_of_node(graph, node);

			neighboorhood.forEach(function (neighbour) {
				if (neighbour !== node) {
					var weight = graph._assoc_mat[node][neighbour] || 1; // weight is a number!
					var neighbourcom = status.nodes_to_com[neighbour];
					weights[neighbourcom] = (weights[neighbourcom] || 0) + weight; // weights is an array!
				}
			});

			return weights; // Each value of the 1D array correspond to the sum of the weights of the edges connecting node to the respective community they belong. Import for defining the weight of links between communities (step 2 of the algorithm)
		}

		function __insert(node, com, weight, status) {
			// Inserting node in a community and modifying status.
			status.nodes_to_com[node] = +com; // Updating node community.
			status.degrees[com] = (status.degrees[com] || 0) + (status.gdegrees[node] || 0); // Updating the sum of the edges incident in community c.
			status.internals[com] = (status.internals[com] || 0) + weight + (status.loops[node] || 0); // Updating the sum of internal edges.
		}

		function __remove(node, com, weight, status) {
            // Removing node from community com and modifying status.
			status.degrees[com] = ((status.degrees[com] || 0) - (status.gdegrees[node] || 0));
			status.internals[com] = ((status.internals[com] || 0) - weight - (status.loops[node] || 0));
			status.nodes_to_com[node] = -1;
		}

		function __renumber(dict) { // dict = status.nodes_to_com
			var count = 0;
			var ret = clone(dict); // Function output (deep copy)
			var new_values = {};
			var dict_keys = Object.keys(dict); // Getting node IDs. {1: 1, 2: 2, 3: 3...}
			dict_keys.forEach(function (key) {
				var value = dict[key]; // Node's community.
				var new_value = typeof new_values[value] === 'undefined' ? -1 : new_values[value];
				if (new_value === -1) {
					new_values[value] = count;
					new_value = count;
					count = count + 1;
				}
				ret[key] = new_value; // {1: , 2: , 3: ,...}
			});

			return ret; // Returns an object similar to nodes_to_com. Although, each node's community is defined in an ordered way like the nodes.
		}

		function __one_level(graph, status) { //Computes one level of the Communities Dendogram.

			var modif = true; // Modifications made in terms of community members.
			var nb_pass_done = 0; // Number of passes done.
			var cur_mod = __modularity(status); // Current modularity.
			var new_mod = cur_mod; // New modularity value (between -1 and 1).

			while (modif && nb_pass_done !== __PASS_MAX) { // __PASS_MAX = -1. Number of passes done.
				cur_mod = new_mod;
				modif = false;
				nb_pass_done += 1; // Counting number of tries involving all nodes trying to integrate every community.

				graph.nodes.forEach(function (node, i) {
					var com_node = status.nodes_to_com[node]; // Returning community of the input node.
					var degc_totw = (status.gdegrees[node] || 0) / (status.total_weight * 2.0); // CHECK OUT LATER!!
					var neigh_communities = __neighcom(node, graph, status); // Returning an array of the communities in the neighborhood of input node.
					__remove(node, com_node, (neigh_communities[com_node] || 0.0), status); // function __remove(node, com, weight, status) {}
					var best_com = com_node;
					var best_increase = 0;
					var neigh_communities_entries = Object.keys(neigh_communities); // Make Iterable;

					// Checking whether modularity increased be inserting removed node in each neighbor community (once at a time)
					neigh_communities_entries.forEach(function (com) {
						var incr = neigh_communities[com] - (status.degrees[com] || 0.0) * degc_totw; // DeltaQ - Fundamental equation.
						if (incr > best_increase) { // Only the placement of the node in the community with higher increase will remain.
							best_increase = incr;
							best_com = com; // Identifying the community the node fits the best.
						}
					});

					__insert(node, best_com, neigh_communities[best_com] || 0, status); // We insert the node in the community there was a greater global modularity improvement.

					if (best_com !== com_node) {
						modif = true; // Only in this situation the algorithm will start from the beginning trying to assess every node in every community.
					}
				});
				new_mod = __modularity(status);
				if (new_mod - cur_mod < __MIN) { // var __MIN = 0.0000001; This condition may not be enough. This is why part of the loop guard is nb_pass_done !== __PASS_MAX. __PASS_MAX = -1
					break;
				}
			}
		}

		// Community aggregation:
		function induced_graph(partition, graph) { // partition = __renumber(status.nodes_to_com) | current_graph/induced_graph
			var ret = {nodes: [], edges: [], _assoc_mat: {}}; // Output
			var w_prec, weight;

			// Add nodes from partition values
			var partition_values = obj_values(partition); // obj_values returns an array.
			ret.nodes = ret.nodes.concat(make_set(partition_values)); // Returns an ordered array without repeated values as in the input. array1.concat(array2) -> returns an array which is array1 and array2 joined.
			graph.edges.forEach(function (edge) {
				weight = edge.weight || 1;
				var com1 = partition[edge.source]; // Source node community.
				var com2 = partition[edge.target]; // Target node community.
				w_prec = (get_edge_weight(ret, com1, com2) || 0); // get_edge_weight(graph, node1, node2) {}
				var new_weight = (w_prec + weight);
				add_edge_to_graph(ret, {'source': com1, 'target': com2, 'weight': new_weight});
			});
			
			edge_index = {}; // Reset edge_index.

			return ret;
		}

		// Partitioning drawn dendogram at an input level.
		function partition_at_level(dendogram, level) {
			var partition = clone(dendogram[0]); // partition = __renumber(status.nodes_to_com)
			for (var i = 1; i < level + 1; i++) {
				Object.keys(partition).forEach(function (key) {
					var node = key;
					var com = partition[key];
					partition[node] = dendogram[i][com];
				});
			}

			return partition; // partition = __renumber(status.nodes_to_com). A graph can be partitioned in different ways.
		}


		// Mother Function.
		function generate_dendogram(graph, part_init) {
			if (graph.edges.length === 0) { // In case we have a graph with no edges. Each node is a community.
				var part = {};
				graph.nodes.forEach(function (node) {
					part[node] = node;
				});
				return part;
			}
			var status = {};

			init_status(original_graph, status, part_init);
			var mod = __modularity(status); // Modularity before 1 level partition.
			var status_list = [];
			__one_level(original_graph, status); // Computes 1 level of the Communities Dendogram.
			var new_mod = __modularity(status); // Modularity after 1 level partition.
			var partition = __renumber(status.nodes_to_com); // Decreasing number of communites due to one level dendogram.
			status_list.push(partition);
			mod = new_mod;
			var current_graph = induced_graph(partition, original_graph); // Graph that results from partitioning the original. Graph after 1st pass.
			init_status(current_graph, status); // Updating status.

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

		var core = function () {
			var status = {};
			var dendogram = generate_dendogram(original_graph, partition_init); // Global variables.

			return partition_at_level(dendogram, dendogram.length - 1);
		};

		core.nodes = function (nds) { // Nodes
			if (nds.length > 0) { // Calling arguments of the function.
				original_graph_nodes = nds; // Global variables.
			}

			return core;
		};

		core.edges = function (edgs) { // Edges
			if (typeof original_graph_nodes === 'undefined')
				throw 'Please provide the graph nodes first!';

			if (edgs.length > 0) { // Calling arguments of the function.
				original_graph_edges = edgs;
				var assoc_mat = make_assoc_mat(edgs);
				original_graph = {
					'nodes': original_graph_nodes,
					'edges': original_graph_edges,
					'_assoc_mat': assoc_mat
				};
			}

			return core;

		};

		core.partition_init = function (prttn) { // Partitions
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