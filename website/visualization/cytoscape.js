function cytoscapeFunc(data) {

    cy = cytoscape({

        container: document.getElementById('graphDiv'), // container to render in

        minZoom: 0.1,

        maxZoom: 10,

        pixelRatio: 2,

        elements: {
            nodes: data.nodes,
            edges: data.links
        },

        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'background-color': function (ele) {

                        let r = 255*Math.abs(Math.sin(ele.data().weight));
                        let g = 255*Math.abs(Math.sin(ele.data().weight + 1));
                        let b = 255*Math.abs(Math.sin(ele.data().weight + 2));
                        return 'rgb(' + r + ',' + g + ',' + b + ')';

                    },
                    'label': 'data(id)'
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'haystack'
                }
            }
        ],

    });

    let options = {
        name: 'cose',

        // Number of iterations between consecutive screen positions update
        refresh: 20,

        // Whether to fit the network view after when done
        fit: true,

        // Padding on fit
        padding: 5,

        // Excludes the label when calculating node bounding boxes for the layout algorithm
        nodeDimensionsIncludeLabels: false,

        // Randomize the initial positions of the nodes (true) or use existing positions (false)
        randomize: true,

        // Extra spacing between components in non-compound graphs
        componentSpacing: 40,

        // Node repulsion (overlapping) multiplier
        nodeOverlap: 256,

        // Nesting factor (multiplier) to compute ideal edge length for nested edges
        nestingFactor: 1.2,

        // Gravity force (constant)
        gravity: 20,

        // Maximum number of iterations to perform
        numIter: 1000, // Before: 1000

        // Initial temperature (maximum node displacement)
        initialTemp: 1000,

        // Cooling factor (how the temperature is reduced between consecutive iterations
        coolingFactor: 0.99,

        // Lower temperature threshold (below this point the layout will end)
        minTemp: 1.0,

        // Pass a reference to weaver to use threads for calculations
        weaver: false,

    };

    let layout = cy.layout(options);
    layout.start();

}