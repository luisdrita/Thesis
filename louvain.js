(function () {
	jLouvain = function () {
		//Constants
		var __PASS_MAX = -1;
		var __MIN = 0.0000001;

		//Local vars
		var original_graph_nodes;
		var original_graph_edges;
		var original_graph = {};
		var partition_init;
		var edge_index = {};

		//Helpers
		function make_set(array) {
			var set = {};
			array.forEach(function (d) {
				set[d] = true;
			});

			return Object.keys(set);
		}
		// Set -> {{1: true}, {2: true}, {3: true}...} Returns an array of the keys.

		function obj_values(obj) {
			var vals = [];
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					vals.push(obj[key]);
				}
			}

			return vals;
		}
		// Returns an array of the values of obj..

		function get_degree_for_node(graph, node) {
			var neighbours = graph._assoc_mat[node] ? Object.keys(graph._assoc_mat[node]) : []; // In case we are looking for a node not connected.
			var weight = 0;
			neighbours.forEach(function (neighbour) {
				var value = graph._assoc_mat[node][neighbour] || 1;
				if (node === neighbour) {
					value *= 2;
				}
				weight += value;
			});

			return weight;
		}
		// Returns ki. Sum of the weights of all links connecting to i.

		function get_neighbours_of_node(graph, node) {
			if (typeof graph._assoc_mat[node] === 'undefined') { // In case we are looking for a node not connected.
				return [];
			}

			var neighbours = Object.keys(graph._assoc_mat[node]);

			return neighbours;
		}
		// Printing all the neighbours of input node.


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

		function add_edge_to_graph(graph, edge) {
			update_assoc_mat(graph, edge); // Updating assoc_mat with the new edge's weight.
			
			if (edge_index[edge.source+'_'+edge.target]) {
				graph.edges[edge_index[edge.source+'_'+edge.target]].weight = edge.weight; // Because it is already in edges from example.html and edge_index (because of the next part). Update of the weight in example.html.
			} else {
				graph.edges.push(edge); // Add to edges file of example.html.
				edge_index[edge.source+'_'+edge.target] = graph.edges.length - 1; // Update edge_index with new value.
			}
		}

		function make_assoc_mat(edge_list) {
			var mat = {}; // It is not an array. It is a list: Object { 1: 3, 2: 4, 3: 7 ...}
			edge_list.forEach(function (edge) {
				mat[edge.source] = mat[edge.source] || {}; // Important because many edges share the same nodes. And, in order to include an element in a 2D matrix, we need to 1st create a
				mat[edge.source][edge.target] = edge.weight;
				mat[edge.target] = mat[edge.target] || {};
				mat[edge.target][edge.source] = edge.weight;
			});
			return mat; // It is not an array (1 object containing others): Object { 1: Object { 2: 3 }, 2: Object { 2: 3 } }
		}
		// Create assoc_mat for the 1st time.

		function update_assoc_mat(graph, edge) {
			graph._assoc_mat[edge.source] = graph._assoc_mat[edge.source] || {};
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

		//Core-Algorithm Related 
		function init_status(graph, status, part) {

			// Defining Status
			status['nodes_to_com'] = {}; // Nodes linked to the communities they belong.
			status['total_weight'] = 0;
			status['internals'] = {}; // Sum of the weights of the links inside each community.
			status['degrees'] = {}; // Sum of the weights of the links incident in each community.
			status['gdegrees'] = {}; // Sum of the weights of the links incident in each node.
			status['loops'] = {}; // Loop weight for each node.
			status['total_weight'] = get_graph_size(graph); //  Sum of the property "weight" of all edges present in the vector edge (that comes from example.html)

			if (typeof part === 'undefined') { // No communities defined among the nodes.
				graph.nodes.forEach(function (node, i) {
					status.nodes_to_com[node] = i;
					var deg = get_degree_for_node(graph, node); // Sum of the weights of all links connecting to i.

					if (deg < 0)
						throw 'Bad graph type, use positive weights!';

					status.degrees[i] = deg; // Sum of the weights of the links incident in each community.
					status.gdegrees[node] = deg; // Sum of the weights of the links incident in each node.
					status.loops[node] = get_edge_weight(graph, node, node) || 0; // Edge weight for the same node.
					status.internals[i] = status.loops[node];
				});
			} else { // If communities are defined in the initial nodes
				graph.nodes.forEach(function (node) {
					var com = part[node];
					status.nodes_to_com[node] = com;
					var deg = get_degree_for_node(graph, node);
					status.degrees[com] = (status.degrees[com] || 0) + deg; // Sum of the weights of the links incident in each community.
					status.gdegrees[node] = deg; // Sum of the weights of the links incident in each node.
					var inc = 0.0;

					var neighbours = get_neighbours_of_node(graph, node); // Printing all the neighbours of input node.
					neighbours.forEach(function (neighbour) {
						var weight = graph._assoc_mat[node][neighbour];

						if (weight <= 0) {
							throw "Bad graph type, use positive weights";
						}

						if (part[neighbour] === com) {
							if (neighbour === node) {
								inc += weight;
							} else {
								inc += weight / 2.0;
							}
						}
					});
					status.internals[com] = (status.internals[com] || 0) + inc;
				});
			}
		}

		function __modularity(status) {
			var links = status.total_weight;
			var result = 0.0;
			var communities = make_set(obj_values(status.nodes_to_com));

			communities.forEach(function (com) {
				var in_degree = status.internals[com] || 0;
				var degree = status.degrees[com] || 0;
				if (links > 0) {
					result = result + in_degree / links - Math.pow((degree / (2.0 * links)), 2);
				}
			});

			return result;
		}

		function __neighcom(node, graph, status) {

			var weights = {};
			var neighboorhood = get_neighbours_of_node(graph, node); //make iterable;

			neighboorhood.forEach(function (neighbour) {
				if (neighbour !== node) {
					var weight = graph._assoc_mat[node][neighbour] || 1;
					var neighbourcom = status.nodes_to_com[neighbour];
					weights[neighbourcom] = (weights[neighbourcom] || 0) + weight;
				}
			});

			return weights; // Array of weights for each group of nodes (belonging to different communities) in the neighborhood of node.
		}

		function __insert(node, com, weight, status) {
			//insert node into com and modify status
			status.nodes_to_com[node] = +com;
			status.degrees[com] = (status.degrees[com] || 0) + (status.gdegrees[node] || 0);
			status.internals[com] = (status.internals[com] || 0) + weight + (status.loops[node] || 0);
		}

		function __remove(node, com, weight, status) {
			//remove node from com and modify status
			status.degrees[com] = ((status.degrees[com] || 0) - (status.gdegrees[node] || 0));
			status.internals[com] = ((status.internals[com] || 0) - weight - (status.loops[node] || 0));
			status.nodes_to_com[node] = -1;
		}

		function __renumber(dict) {
			var count = 0;
			var ret = clone(dict); //deep copy :) 
			var new_values = {};
			var dict_keys = Object.keys(dict);
			dict_keys.forEach(function (key) {
				var value = dict[key];
				var new_value = typeof new_values[value] === 'undefined' ? -1 : new_values[value];
				if (new_value === -1) {
					new_values[value] = count;
					new_value = count;
					count = count + 1;
				}
				ret[key] = new_value;
			});

			return ret;
		}

		function __one_level(graph, status) {
			//Compute one level of the Communities Dendogram.
			var modif = true;
			var nb_pass_done = 0;
			var cur_mod = __modularity(status);
			var new_mod = cur_mod;

			while (modif && nb_pass_done !== __PASS_MAX) {
				cur_mod = new_mod;
				modif = false;
				nb_pass_done += 1

				graph.nodes.forEach(function (node, i) {
					var com_node = status.nodes_to_com[node];
					var degc_totw = (status.gdegrees[node] || 0) / (status.total_weight * 2.0);
					var neigh_communities = __neighcom(node, graph, status);
					__remove(node, com_node, (neigh_communities[com_node] || 0.0), status);
					var best_com = com_node;
					var best_increase = 0;
					var neigh_communities_entries = Object.keys(neigh_communities);//make iterable;

					neigh_communities_entries.forEach(function (com, i) {
						var incr = neigh_communities[com] - (status.degrees[com] || 0.0) * degc_totw;
						if (incr > best_increase) {
							best_increase = incr;
							best_com = com;
						}
					});

					__insert(node, best_com, neigh_communities[best_com] || 0, status);

					if (best_com !== com_node) {
						modif = true;
					}
				});
				new_mod = __modularity(status);
				if (new_mod - cur_mod < __MIN) {
					break;
				}
			}
		}

		function induced_graph(partition, graph) {
			var ret = {nodes: [], edges: [], _assoc_mat: {}};
			var w_prec, weight;
			//add nodes from partition values
			var partition_values = obj_values(partition);
			ret.nodes = ret.nodes.concat(make_set(partition_values)); //make set
			graph.edges.forEach(function (edge, i) {
				weight = edge.weight || 1;
				var com1 = partition[edge.source];
				var com2 = partition[edge.target];
				w_prec = (get_edge_weight(ret, com1, com2) || 0);
				var new_weight = (w_prec + weight);
				add_edge_to_graph(ret, {'source': com1, 'target': com2, 'weight': new_weight});
			});
			
			edge_index = {};

			return ret;
		}

		function partition_at_level(dendogram, level) {
			var partition = clone(dendogram[0]);
			for (var i = 1; i < level + 1; i++) {
				Object.keys(partition).forEach(function (key, j) {
					var node = key;
					var com = partition[key];
					partition[node] = dendogram[i][com];
				});
			}

			return partition;
		}


		function generate_dendogram(graph, part_init) {
			if (graph.edges.length === 0) {
				var part = {};
				graph.nodes.forEach(function (node, i) {
					part[node] = node;
				});
				return part;
			}
			var status = {};

			init_status(original_graph, status, part_init);
			var mod = __modularity(status);
			var status_list = [];
			__one_level(original_graph, status);
			var new_mod = __modularity(status);
			var partition = __renumber(status.nodes_to_com);
			status_list.push(partition);
			mod = new_mod;
			var current_graph = induced_graph(partition, original_graph);
			init_status(current_graph, status);

			while (true) {
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

			return status_list;
		}

		var core = function () {
			var status = {};
			var dendogram = generate_dendogram(original_graph, partition_init);

			return partition_at_level(dendogram, dendogram.length - 1);
		};

		core.nodes = function (nds) {
			if (arguments.length > 0) {
				original_graph_nodes = nds;
			}

			return core;
		};

		core.edges = function (edgs) {
			if (typeof original_graph_nodes === 'undefined')
				throw 'Please provide the graph nodes first!';

			if (arguments.length > 0) {
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

		core.partition_init = function (prttn) {
			if (arguments.length > 0) {
				partition_init = prttn;
			}
			return core;
		};

		return core;
	}
})();