function d3svgFunc(svg, graph) {
    // if both d3v3 and d3 are loaded, we'll assume
    // that d3 is called d3, otherwise we'll assume
    // that d3 is the default (d3)

    let parentWidth = d3.select('svg').node().parentNode.clientWidth;
    let parentHeight = d3.select('svg').node().parentNode.clientHeight;

    svg = d3.select('#svg_implementation')
        .attr('width', parentWidth)
        .attr('height', parentHeight);

    // remove any previous graphs
    svg.selectAll('.g-main').remove();

    let gMain = svg.append('g').classed('g-main', true);

    gMain.append('rect')
        .attr('width', parentWidth)
        .attr('height', parentHeight)
        .style('fill', 'white');

    let gDraw = gMain.append('g');

    let zoom = d3.zoom().scaleExtent([1/10, 10])
        .on('zoom', zoomed);

    gMain.call(zoom);

    function zoomed() {
        gDraw.attr('transform', d3.event.transform);
    }

    let color = d3.scaleOrdinal(d3.schemeCategory20);

    if (! ("links" in graph)) {
        console.log("Graph is missing links");
        return;
    }

    let nodes = {};
    let i;
    for (i = 0; i < graph.nodes.length; i++) {
        nodes[graph.nodes[i].id] = graph.nodes[i];
        graph.nodes[i].weight = 1.01;
    }

    let link = gDraw.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    let node = gDraw.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) {
            if ('color' in d)
                return d.color;
            else
                return color(d.group);
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


    // add titles for mouseover blurbs
    node.append("title")
        .text(function(d) {
            if ('name' in d)
                return d.name;
            else
                return d.id;
        });

    let simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
            .id(function(d) { return d.id; })
            .distance(function(d) {
                return 30;
            })
        )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(parentWidth / 2, parentHeight / 2))
        .force("x", d3.forceX(parentWidth/2))
        .force("y", d3.forceY(parentHeight/2));

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        // update node and line positions at every step of
        // the force simulation
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.9).restart();

        if (!d.selected) {
            // if this node isn't selected, then we have to unselect every other node
            node.classed("selected", function(p) { return p.selected =  p.previouslySelected = false; });
        }

        d3.select(this).classed("selected", function(p) { d.previouslySelected = d.selected; return d.selected = true; });

        node.filter(function(d) { return d.selected; })
            .each(function(d) {
                d.fx = d.x;
                d.fy = d.y;
            })
    }

    function dragged(d) {

        node.filter(function(d) { return d.selected; })
            .each(function(d) {
                d.fx += d3.event.dx;
                d.fy += d3.event.dy;
            })
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        node.filter(function(d) { return d.selected; })
            .each(function(d) {
                d.fx = null;
                d.fy = null;
            })
    }

    return graph;
}