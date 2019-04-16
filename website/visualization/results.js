function results(sheet, svg_input, title, div, y_max, x_max, width_input) {

    // set the dimensions and margins of the graph
    const margin = {top: 40, right: 160, bottom: 50, left: 150},
        width = width_input - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select(div).append("svg")
        .attr("id",svg_input)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append('text').html(title).attr('x', width_input/2 - 180).attr('y', 10).style("font-size", "11px");

    //Read the data
    d3.csv(sheet, function(data) {

        let data2 = [];

        for (let i = 2; i < Object.keys(data[0]).length; i = i + 2) {

            for (let j = 0; j < data.length; j++) {

                data2.push({
                    x: Number(data[j][Object.keys(data[0])[0]]),
                    y: Number(data[j][Object.keys(data[0])[i-1]]),
                    e: Number(data[j][Object.keys(data[0])[i]]),
                    group: Object.keys(data[0])[i-1],
                    title: title
                });
            }

        }

        // List of groups (here I have one group per column)
        let allGroup = [];
        let allGroup_errors = [];

        for(let i = 1; i < Object.keys(data[0]).length; i++) {

            if((i+1)%2 === 0) {
                allGroup.push(Object.keys(data[0])[i])
            } else {
                allGroup_errors.push(Object.keys(data[0])[i])
            }
        }

        // Reformat the data: we need an array of arrays of {x, y} tuples
        let dataReady = allGroup.map(function (grpName, i) { // .map allows to do something for each element of the list
                return {
                    name: grpName,
                    title: title,
                    values: data.map(function (d) {
                            return {time: d.time, value: +d[grpName], error: +d[allGroup_errors[i]], name: grpName, title: title};
                        })
                    }
            });

        // I strongly advise to have a look to dataReady with

        // A color scale: one color for each group
        let myColor = d3.scaleOrdinal().domain(allGroup).range(d3.schemeCategory20);

        // Add X axis --> it is a date format
        let x = d3.scaleLinear()
            .domain([0,x_max])
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        let y = d3.scaleLinear()
            .domain( [0,y_max])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        let mouseover_line = function(d) {

            for (let i = 0; i < document.getElementsByClassName("error-line" + d.name + d.title).length; i++) {

                document.getElementsByClassName("error-line" + d.name + d.title)[i].setAttribute("opacity", "1");

            }

            for (let i = 0; i < document.getElementsByClassName("error-cap" + d.name + d.title).length; i++) {

                document.getElementsByClassName("error-cap" + d.name + d.title)[i].setAttribute("opacity", "1");

            }

            for (let i = 0; i < allGroup.length; i++) {

                if(allGroup[i] !== d.name) {

                    document.getElementById("myLine" + allGroup[i] + d.title).setAttribute("opacity", "0.1");
                    document.getElementById("myLabel" + allGroup[i] + d.title).setAttribute("opacity", "0.1");

                    for (let j = 0; j < document.getElementsByClassName("myCircle" + d.name + d.title).length; j++) {

                        document.getElementsByClassName("myCircle" + allGroup[i] + d.title)[j].setAttribute("opacity", "0.1");

                    }
                }
            }
        };

        let mouseleave_line = function(d) {

            for (let i = 0; i < document.getElementsByClassName("error-line" + d.name + d.title).length; i++) {

                document.getElementsByClassName("error-line" + d.name + d.title)[i].setAttribute("opacity", "0");

            }

            for (let i = 0; i < document.getElementsByClassName("error-cap" + d.name + d.title).length; i++) {

                document.getElementsByClassName("error-cap" + d.name + d.title)[i].setAttribute("opacity", "0");

            }

            for (let i = 0; i < allGroup.length; i++) {

                document.getElementById("myLine" + allGroup[i] + d.title).setAttribute("opacity", "1");
                document.getElementById("myLabel" + allGroup[i] + d.title).setAttribute("opacity", "1");

                for (let j = 0; j < document.getElementsByClassName("myCircle" + d.name + d.title).length; j++) {

                    document.getElementsByClassName("myCircle" + allGroup[i] + d.title)[j].setAttribute("opacity", "1");

                }
            }
        };

        // Add the lines
        let line = d3.line()
            .x(d => x(+d.time))
            .y(d => y(+d.value));
        svg.selectAll("myLines")
            .data(dataReady)
            .enter()
            .append("path")
            .attr("d", d => line(d.values))
            .attr("stroke", d => myColor(d.name))
            .attr("opacity", 1)
            .attr("id", d => "myLine" + d.name + d.title)
            .style("stroke-width", 3)
            .style("fill", "none")
            .on("mouseover", mouseover_line)
            .on("mouseleave", mouseleave_line);

        // create a tooltip
        let Tooltip = d3.select(div)
            .append("div")
            .style("position", "absolute")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        // Three function that change the tooltip when user hover / move / leave a cell
        let mouseover = function(d) {

            Tooltip
                .style("opacity", 1);


            for (let i = 0; i < document.getElementsByClassName("error-cap" + d.name + d.title).length; i++) {

                document.getElementsByClassName("error-cap" + d.name + d.title)[i].setAttribute("opacity", "1");

            }

                for (let i = 0; i < document.getElementsByClassName("error-line" + d.name + d.title).length; i++) {

                    document.getElementsByClassName("error-line" + d.name + d.title)[i].setAttribute("opacity", "1");

                }

            for (let i = 0; i < allGroup.length; i++) {

                if(allGroup[i] !== d.name) {

                    document.getElementById("myLine" + allGroup[i] + d.title).setAttribute("opacity", "0.1");
                    document.getElementById("myLabel" + allGroup[i] + d.title).setAttribute("opacity", "0.1");

                    for (let j = 0; j < document.getElementsByClassName("myCircle" + d.name + d.title).length; j++) {

                        document.getElementsByClassName("myCircle" + allGroup[i] + d.title)[j].setAttribute("opacity", "0.1");

                    }
                }
            }
        };

        let mousemove = function(d) {

            if(svg_input === "svg1" || svg_input === "svg3") {
                Tooltip
                    .html(d.value + " ± " + d.error)
                    .style("left", (d3.mouse(this)[0] + margin.left + 15) + "px")
                    .style("top", (d3.mouse(this)[1] + margin.top + 70) + "px")
            } else {
                Tooltip
                    .html(d.value + " ± " + d.error)
                    .style("left", (d3.mouse(this)[0] + margin.left + 775) + "px")
                    .style("top", (d3.mouse(this)[1] + margin.top + 70) + "px")
            }
        };

        let mouseleave = function(d) {
            Tooltip
                .style("opacity", 0);

            for (let i = 0; i < document.getElementsByClassName("error-cap" + d.name + d.title).length; i++) {

                document.getElementsByClassName("error-cap" + d.name + d.title)[i].setAttribute("opacity", "0");

            }

            for (let i = 0; i < document.getElementsByClassName("error-line" + d.name + d.title).length; i++) {

                document.getElementsByClassName("error-line" + d.name + d.title)[i].setAttribute("opacity", "0");

            }

            for (let i = 0; i < allGroup.length; i++) {

                document.getElementById("myLine" + allGroup[i] + d.title).setAttribute("opacity", "1");
                document.getElementById("myLabel" + allGroup[i] + d.title).setAttribute("opacity", "1");

                for (let j = 0; j < document.getElementsByClassName("myCircle" + d.name + d.title).length; j++) {

                        document.getElementsByClassName("myCircle" + allGroup[i] + d.title)[j].setAttribute("opacity", "1");

                    }
            }
        };

        // Add Error Line
        svg.append("g").selectAll("line") //  let bar =
            .data(data2).enter()
            .append("line")
            .attr("class", d => "error-line" + d.group + d.title)
            .attr("opacity", "0")
            .attr("stroke", "black")
            .attr("stroke-width", "2px")
            .attr("x1", d => x(d.x))
            .attr("y1", d => y(d.y + d.e))
            .attr("x2", d => x(d.x))
            .attr("y2", d => y(d.y - d.e));

        // Add Error Top Cap
        svg.append("g").selectAll("line") //  let top_cap =
            .data(data2).enter()
            .append("line")
            .attr("class", d => "error-cap" + d.group + d.title)
            .attr("opacity", "0")
            .attr("stroke", "black")
            .attr("stroke-width", "2px")
            .attr("x1", d => x(d.x) - 4)
            .attr("y1", d => y(d.y + d.e))
            .attr("x2", d => x(d.x) + 4)
            .attr("y2", d => y(d.y + d.e));

        // Add Error Bottom Cap
        svg.append("g").selectAll("line") //  let bottom_cap =
            .data(data2).enter()
            .append("line")
            .attr("class", d => "error-cap" + d.group + d.title)
            .attr("stroke", "black")
            .attr("opacity", "0")
            .attr("stroke-width", "2px")
            .attr("x1", d => x(d.x) - 4)
            .attr("y1", d => y(d.y - d.e))
            .attr("x2", d => x(d.x) + 4)
            .attr("y2", d => y(d.y - d.e));

        // Add the points
        svg
        // First we need to enter in a group
            .selectAll("myDots")
            .data(dataReady)
            .enter()
            .append('g')
            .style("fill", d => myColor(d.name))
            // Second we need to enter in the 'values' part of this group
            .selectAll("myPoints")
            .data(d => d.values)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.time))
            .attr("cy", d => y(d.value))
            .attr("r", 4)
            .attr("stroke", "white")
            .attr("stroke-width", "1px")
            .attr("class", d => "myCircle" + d.name + d.title)
            .attr("opacity", 1)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        // Add a legend at the end of each line
        svg
            .selectAll("myLabels")
            .data(dataReady)
            .enter()
            .append('g')
            .append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1], title: d.title}; }) // keep only the last value of each time series
            .attr("transform", d => "translate(" + x(d.value.time) + "," + y(d.value.value) + ")") // Put the text at the position of the last point
            .attr("x", 12) // shift the text a bit more right
            .text(d => d.name)
            .style("fill", d => myColor(d.name))
            .attr("id", d => "myLabel" + d.name + d.title)
            .style("font-size", "11px")
    });
}