function cytoscapeFunc(data) {

    cy = cytoscape({

        container: document.getElementById('graphDiv'), // container to render in

     /*   zoomingEnabled: false, */

        minZoom: 0.1,

        maxZoom: 10,

     /*   hideEdgesOnViewport: true, */

    /*    textureOnViewport: true, */

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
                selector: 'edge', /* mapData(weight, 0, 20, blue, red) */
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

        // Called on `layoutready`
        ready: function(){},

        // Called on `layoutstop`
        stop: function(){},

        // Whether to animate while running the layout
        // true : Animate continuously as the layout is running
        // false : Just show the end result
        // 'end' : Animate with the end result, from the initial positions to the end positions
        animate: true,

        // Easing of the animation for animate:'end'
        animationEasing: undefined,

        // The duration of the animation for animate:'end'
        animationDuration: undefined,

        // A function that determines whether the node should be animated
        // All nodes animated by default on animate enabled
        // Non-animated nodes are positioned immediately when the layout starts
        animateFilter: function ( node, i ){ return true; },

        // The layout animates only after this many milliseconds for animate:true
        // (prevents flashing on fast runs)
        animationThreshold: 250,

        // Number of iterations between consecutive screen positions update
        refresh: 20,

        // Whether to fit the network view after when done
        fit: true,

        // Padding on fit
        padding: 30,

        // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        boundingBox: undefined,

        // Excludes the label when calculating node bounding boxes for the layout algorithm
        nodeDimensionsIncludeLabels: false,

        // Randomize the initial positions of the nodes (true) or use existing positions (false)
        randomize: false,

        // Extra spacing between components in non-compound graphs
        componentSpacing: 40,

        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: function( node ){ return 2048; },

        // Node repulsion (overlapping) multiplier
        nodeOverlap: 4,

        // Ideal edge (non nested) length
        idealEdgeLength: function( edge ){ return 32; },

        // Divisor to compute edge forces
        edgeElasticity: function( edge ){ return 32; },

        // Nesting factor (multiplier) to compute ideal edge length for nested edges
        nestingFactor: 1.2,

        // Gravity force (constant)
        gravity: 1,

        // Maximum number of iterations to perform
        numIter: 1000,

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

    /*
    cy.$('node').on('mouseover', function(evt){

        evt.style.label = "qwe";
c
        // console.log( 'tap ' + evt.target.id() );
    });
    */

 /*   cy.on('mouseover', 'node', function(event) {
        var node = event.cyTarget;
        node.qtip({
            content: 'hello',
            show: {
                event: event.type,
                ready: true
            },
            hide: {
                event: 'mouseout unfocus'
            }
        }, event);
    });

    */

}