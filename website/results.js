
function results(sheet, svg_input, title) {

    // Define margins, dimensions, and some line colors
    const margin = {top: 40, right: 120, bottom: 50, left: 150};
    const width = 750 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

// Define the scales and tell D3 how to draw the line
    const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
    const line = d3.line().x(d => x(d.year)).y(d => y(d.population));

    const chart = d3.select('#'+svg_input).append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const tooltip = d3.select('#tooltip');
    const tooltipLine = chart.append('line');

// Add the axes and a title
    const xAxis = d3.axisBottom(x).tickFormat(d3.format('.4'));
    const yAxis = d3.axisLeft(y).tickFormat(d3.format('.2'));
    chart.append('g').call(yAxis);
    chart.append('g').attr('transform', 'translate(0,' + height + ')').call(xAxis);
    chart.append('text').html(title).attr('x', 200);

// Load the data and draw a chart
    let states, tipBox;
    d3.json(sheet, d => {
        states = d;
// './benchmark_data/data_visualized/nmi_gamma.json'
        chart.selectAll()
            .data(states).enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', d => d.color)
            .attr('stroke-width', 5)
            .datum(d => d.history)
            .attr('d', line);

        chart.selectAll()
            .data(states).enter()
            .append('text')
            .html(d => d.name)
            .attr('fill', d => d.color)
            .attr('alignment-baseline', 'middle')
            .attr('x', width)
            .attr('dx', '.5em')
            .attr('y', d => y(d.currentPopulation));

        tipBox = chart.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('opacity', 0)
            .on('mousemove', drawTooltip)
            .on('mouseout', removeTooltip);
    });



    function removeTooltip() {
        if (tooltip) tooltip.style('display', 'none');
        if (tooltipLine) tooltipLine.attr('stroke', 'none');
    }

    function drawTooltip() {
        const year = Math.floor((x.invert(d3.mouse(tipBox.node())[0]) + 5) / 10) * 10;

        states.sort((a, b) => {
            return b.history.find(h => h.year === year).population - a.history.find(h => h.year === year).population;
        });

        tooltipLine.attr('stroke', 'black')
            .attr('x1', x(year))
            .attr('x', x(year))
            .attr('y1', 0)
            .attr('y', height);

        tooltip.html(year)
            .style('display', 'block')
            .style('left', d3.event.pageX + 20)
            .style('top', d3.event.pageY - 20)
            .selectAll()
            .data(states).enter()
            .append('div')
            .style('color', d => d.color)
            .html(d => d.name + ': ' + d.history.find(h => h.year === year).population);
    }
}