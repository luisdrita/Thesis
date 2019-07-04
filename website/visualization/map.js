function geoMap(metaData) {

    let mapType;
    let mapType2;
    let lat = "latitude";
    let long = "longitude";
    let mapConfig = "dark";

    for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

        let optionMetadata = document.createElement("OPTION");

        optionMetadata.id = "optionMetadata"+j;
        optionMetadata.innerHTML= Object.keys(metaData[Object.keys(metaData)[0]])[j];
        optionMetadata.value = Object.keys(metaData[Object.keys(metaData)[0]])[j];

        document.getElementById("selectMetadata").appendChild(optionMetadata);

    }

    // mapid is the id of the div where the map will appear
    let map = L
        .map('mapid')
        .setView([38, 9], 5);   // center position + zoom

    // Add a tile to the map = a background. Comes from OpenStreetmap
    mapType = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
            //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            maxZoom: 10,
            minZoom: 1

        }).addTo(map);

    document.getElementById("Dark").addEventListener("click", function () {

        map.removeLayer(mapType);

        // Add a tile to the map = a background. Comes from OpenStreetmap

        if(document.getElementById("streets").checked) {
            mapType = L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                    maxZoom: 10,
                    minZoom: 1

                }).addTo(map);

        } else {

            mapType = L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                    //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                    maxZoom: 10,
                    minZoom: 1

                }).addTo(map);
        }

        document.getElementById("mapButton").src = "../img/dark.png";
        document.getElementById("toggle2").src = "../img/pixelmator/gear_white.png";
        document.getElementById("bubbleSizeLabel").style.color = "white";
        document.getElementById("metadata").style.color = "white";

        d3.selectAll("circle").style("fill", function (d) {

                return "white"

                //return "#" + intToRGB(hashCode(d["vaccine_status"]))
            });

        mapConfig = "dark";

    });

    document.getElementById("Light").addEventListener("click", function () {

        map.removeLayer(mapType);

        // Add a tile to the map = a background. Comes from OpenStreetmap
        if(document.getElementById("streets").checked) {
            mapType = L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                    maxZoom: 19,
                    minZoom: 1

                }).addTo(map);

        } else {

                mapType = L.tileLayer(
                    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
                        //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                        maxZoom: 19,
                        minZoom: 1

                    }).addTo(map);
        }

        document.getElementById("mapButton").src = "../img/light.png";
        document.getElementById("toggle2").src = "../img/pixelmator/gear_black.png";
        document.getElementById("bubbleSizeLabel").style.color = "black";
        document.getElementById("metadata").style.color = "black";

        d3.selectAll("circle").style("fill", function (d) {

                return "black"

                //return "#" + intToRGB(hashCode(d["vaccine_status"]))
            });

        mapConfig = "light";
    });

    document.getElementById("Satellite").addEventListener("click", function () {

        map.removeLayer(mapType);

        if(document.getElementById("streets").checked) {
            // Add a tile to the map = a background. Comes from OpenStreetmap
            mapType = L.tileLayer(
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    maxZoom: 10,
                    minZoom: 1

                }).addTo(map);

            mapType2 = L.tileLayer(
                'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
                    minZoom: 1,
                    maxZoom: 10,
                    ext: 'png'

                }).addTo(map);

        } else {

            // Add a tile to the map = a background. Comes from OpenStreetmap
            mapType = L.tileLayer(
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    maxZoom: 10,
                    minZoom: 1

                }).addTo(map);
        }

        document.getElementById("mapButton").src = "../img/satellite.png";
        document.getElementById("toggle2").src = "../img/pixelmator/gear_white.png";
        document.getElementById("bubbleSizeLabel").style.color = "white";
        document.getElementById("metadata").style.color = "white";

        d3.selectAll("circle").style("fill", function (d) {

                return "white"

                //return "#" + intToRGB(hashCode(d["vaccine_status"]))
            });

        mapConfig = "satellite";
    });

    // -------------------------

    // Listening to changes in the select element of node colors which will trigger tree update.
    document.getElementById("streets").addEventListener("change", function () {

            if (document.getElementById("streets").checked) {

                switch (mapConfig) {

                    case "dark":

                        map.removeLayer(mapType);
                        map.removeLayer(mapType2);

                        // Add a tile to the map = a background. Comes from OpenStreetmap
                        mapType = L.tileLayer(
                            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                                //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                                maxZoom: 10,
                                minZoom: 1

                            }).addTo(map);

                        break;

                    case "light":

                        map.removeLayer(mapType);
                        map.removeLayer(mapType2);

                        // Add a tile to the map = a background. Comes from OpenStreetmap
                        mapType = L.tileLayer(
                            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                                //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                                maxZoom: 10,
                                minZoom: 1

                            }).addTo(map);

                        break;

                    case "satellite":

                        map.removeLayer(mapType);

                        // Add a tile to the map = a background. Comes from OpenStreetmap
                        mapType = L.tileLayer(
                            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                                maxZoom: 10,
                                minZoom: 1

                            }).addTo(map);

                        mapType2 = L.tileLayer(
                            'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
                                minZoom: 1,
                                maxZoom: 10,
                                ext: 'png'

                            }).addTo(map);
                }

            } else {

                switch (mapConfig) {

                    case "dark":

                        map.removeLayer(mapType);
                        map.removeLayer(mapType2);

                        // Add a tile to the map = a background. Comes from OpenStreetmap
                        mapType = L.tileLayer(
                            'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                                //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                                maxZoom: 10,
                                minZoom: 1

                            }).addTo(map);

                        break;

                    case "light":

                        map.removeLayer(mapType);
                        map.removeLayer(mapType2);

                        // Add a tile to the map = a background. Comes from OpenStreetmap
                        mapType = L.tileLayer(
                            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
                                //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                                maxZoom: 10,
                                minZoom: 1

                            }).addTo(map);

                        break;

                    case "satellite":

                        map.removeLayer(mapType);
                        map.removeLayer(mapType2);

                        // Add a tile to the map = a background. Comes from OpenStreetmap
                        mapType = L.tileLayer(
                            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                                maxZoom: 10,
                                minZoom: 1

                            }).addTo(map);

                }
            }
    });

    // -------------------------

    // Add a svg layer to the map
    L.svg().addTo(map);

    map.zoomControl.remove();

    let markers = Object.values(metaData);
    let latlong = [];

    // Select the svg area and add circles:
    d3.select("#mapid")
        .select("svg")
        .selectAll("myCircles")
        .data(markers)
        .enter()
        .append("circle")
        .attr("cx", function (d) {

            if (isNaN(d[lat]) === false && isNaN(d[long]) === false && d[lat] !== "" && d[long] !== "") {

                return map.latLngToLayerPoint([d[lat], d[long]]).x

            } else {

                return map.latLngToLayerPoint([0, 0]).x

            }
        })
        .attr("cy", function (d) {

            if (isNaN(d[lat]) === false && isNaN(d[long]) === false && d[lat] !== "" && d[long] !== "") {

            return map.latLngToLayerPoint([d[lat], d[long]]).y

            } else {

                return map.latLngToLayerPoint([0, 0]).y
            }

        })
        .attr("r", function (d) {
            if (isNaN(d[long]) === false && isNaN(d[lat]) === false && latlong.includes(d[lat].toString() + d[long].toString()) === false && d[lat] !== "" && d[long] !== "") {

                latlong.push(d[lat].toString() + d[long].toString());

                return (label2number("latitude", markers, d["latitude"]))*(document.getElementById("bubbleSize").value)/(numberNonEmpty("latitude", markers));

            } else {

                return "0";

            }
        })
        .style("fill", function (d) {

            return "white"

            //return "#" + intToRGB(hashCode(d["vaccine_status"]))

        })
        //   .attr("stroke", "red")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .5);

    // Function that update circle position if something change
    function update() {
        d3.selectAll("circle")
            .attr("cx", function (d) {
                if (isNaN(d[long]) === false && isNaN(d[lat]) === false) {

                    return map.latLngToLayerPoint([d[lat], d[long]]).x

                } else {

                    return map.latLngToLayerPoint([0, 0]).x

                }
            })
            .attr("cy", function (d) {
                if (isNaN(d[long]) === false && isNaN(d[lat]) === false) {

                    return map.latLngToLayerPoint([d[lat], d[long]]).y

                } else {

                    return map.latLngToLayerPoint([0, 0]).y
                }
            })
    }

    // If the user change the map (zoom or drag), I update circle position:
    map.on("moveend", update);

    document.getElementById("bubbleSize").addEventListener("input", function () {

        let latlong2 = [];

        d3.selectAll("circle")
            .attr("r", function (d) {

                if (isNaN(d[long]) === false && isNaN(d[lat]) === false && latlong2.includes(d[lat].toString() + d[long].toString()) === false && d[lat] !== "" && d[long] !== "") {

                    latlong2.push(d[lat].toString() + d[long].toString());

                    return (label2number("latitude", markers, d["latitude"]))*(document.getElementById("bubbleSize").value)/(numberNonEmpty("latitude", markers));

                } else {

                    return "0";

                }
            });

        map.dragging.disable();

    });

    document.getElementById("bubbleSize").addEventListener("mouseup", function () {

        map.dragging.enable();

    });

    document.getElementById("toggle2").addEventListener("mousedown", function () {

        let x = document.getElementsByClassName("toggle2");

        for (let i = 0; i < x.length; i++) {
            if (x[i].style.display === "none") {
                x[i].style.display = "block";
                map.zoomControl.addTo(map);
                // document.getElementById("shape").style.display = "block";
                document.getElementById("toggle2").style.transform = "rotate(-15deg)";
            } else {
                x[i].style.display = "none";
                map.zoomControl.remove();
                document.getElementById("toggle2").style.transform = "rotate(15deg)";
            }
        }

        map.doubleClickZoom.disable();

    });

    document.getElementById("toggle2").addEventListener("mouseleave", function () {

        map.doubleClickZoom.enable();

    });
}

// -------------------------------------- Toggle Gear --------------------------------------

let mapToggleGear = document.createElement("IMG");

mapToggleGear.id = "toggle2";
mapToggleGear.style.position = "absolute";
mapToggleGear.style.right = "10px";
mapToggleGear.style.top = "10px";
mapToggleGear.style.zIndex = "1000";
mapToggleGear.src = "../img/pixelmator/gear_white.png";
mapToggleGear.style.width = "25px";
mapToggleGear.style.cursor = "pointer";

document.getElementById("mapid").appendChild(mapToggleGear);

// -------------------------------------- Map --------------------------------------

let mapDiv = document.createElement("DIV");
let mapButton = document.createElement("BUTTON");
let mapDivInside = document.createElement("DIV");

let mapType1 = document.createElement("IMG");
let mapType2 = document.createElement("IMG");
let mapType3 = document.createElement("IMG");

let streetsLabel = document.createElement("LABEL"); // Metadata label.
let streets = document.createElement("INPUT"); // Checkbox input.

mapDiv.id = "mapDiv";
mapDiv.classList.add("dropdown");
mapDiv.className = "toggle2";
mapDiv.style.position = "absolute";
mapDiv.style.left = "52%";
mapDiv.style.bottom = "10px";
mapDiv.style.zIndex = "2000";
mapDiv.style.display = "none";

mapButton.id = "mapButton";
mapButton.innerHTML = "Map";
mapButton.style.textAlign = "center";
mapButton.style.width = "50px";
mapButton.style.height = "25px";
mapButton.style.cursor = "pointer";
mapButton.style.backgroundColor = "black";
mapButton.style.borderColor = "white";
mapButton.style.color = "white";
mapButton.style.borderRadius = "10px";

mapDivInside.id = "mapDivInside";
mapDivInside.class = "dropdown-content";
mapDivInside.style.display = "none";
mapDivInside.style.position = "absolute";
mapDivInside.style.bottom = "25px";
mapDivInside.style.zIndex = "20";
mapDivInside.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
mapDivInside.style.paddingBottom = "10px";
mapDivInside.style.borderRadius = "10px";
mapDivInside.style.backgroundColor = "white";

mapType1.id = "Dark";
mapType1.style.cursor = "pointer";
mapType1.style.display = "block";
mapType1.style.padding = "5px 5px";
mapType1.style.zIndex = "2";
mapType1.src = "../img/dark.png";
mapType1.style.width = "100px";

mapType2.id = "Light";
mapType2.style.cursor = "pointer";
mapType2.style.display = "block";
mapType2.style.padding = "5px 5px";
mapType2.style.zIndex = "2";
mapType2.src = "../img/light.png";
mapType2.style.width = "100px";

mapType3.id = "Satellite";
mapType3.style.cursor = "pointer";
mapType3.style.display = "block";
mapType3.style.padding = "5px 5px";
mapType3.style.zIndex = "2";
mapType3.src = "../img/satellite.png";
mapType3.style.width = "100px";

streetsLabel.id = "streetsLabel";
streetsLabel.className = "streetsLabel";
streetsLabel.innerHTML = "Labels";
streetsLabel.style.display = "block";
streetsLabel.style.paddingLeft = "10px";
streetsLabel.style.paddingRight = "10px";
streetsLabel.style.opacity = "1";

streets.id = "streets";
streets.className = "streets";
streets.type = "checkbox";
streets.style.zIndex = "2000";
streets.style.cursor = "pointer";
streets.style.marginLeft = "10px";

document.getElementById("mapid").appendChild(mapDiv);
document.getElementById("mapDiv").appendChild(mapButton);
document.getElementById("mapDiv").appendChild(mapDivInside);

document.getElementById("mapDivInside").appendChild(mapType1);
document.getElementById("mapDivInside").appendChild(mapType2);
document.getElementById("mapDivInside").appendChild(mapType3);

document.getElementById("mapDivInside").appendChild(streetsLabel);
document.getElementById("streetsLabel").appendChild(streets);

// -------------------------------------- Style --------------------------------------

let styleDiv = document.createElement("DIV");
let styleButton = document.createElement("BUTTON");
let styleDivInside = document.createElement("DIV");

let bubbleSizeLabel = document.createElement("P");
let bubbleSize = document.createElement("INPUT");

styleDiv.id = "styleDiv";
styleDiv.classList.add("dropdown");
styleDiv.className = "toggle2";
styleDiv.style.position = "absolute";
styleDiv.style.bottom = "10px";
styleDiv.style.left = "40%";
styleDiv.style.zIndex = "2000";
styleDiv.style.display = "none";

styleButton.id = "styleButton";
styleButton.innerHTML = "Style";
styleButton.style.textAlign = "center";
styleButton.style.width = "50px";
styleButton.style.height = "25px";
styleButton.style.cursor = "pointer";
styleButton.style.backgroundColor = "black";
styleButton.style.borderColor = "white";
styleButton.style.color = "white";
styleButton.style.borderRadius = "10px";

styleDivInside.id = "styleDivInside";
styleDivInside.class = "dropdown-content";
styleDivInside.style.display = "none";
styleDivInside.style.position = "absolute";
styleDivInside.style.bottom = "25px";
styleDivInside.style.zIndex = "20";
styleDivInside.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
styleDivInside.style.paddingBottom = "10px";
styleDivInside.style.borderRadius = "10px";
styleDivInside.style.backgroundColor = "white";
styleDivInside.style.lineHeight = "5px";

bubbleSizeLabel.id = "bubbleSizeLabel";
bubbleSizeLabel.innerHTML = "Bubble Size";
bubbleSizeLabel.style.fontSize = "14px";
bubbleSizeLabel.style.zIndex = "1000";
bubbleSizeLabel.style.textAlign = "center";
bubbleSizeLabel.style.color = "black";

bubbleSize.id = "bubbleSize";
bubbleSize.type = "range";
bubbleSize.value = "50";
bubbleSize.style.zIndex = "1000";
bubbleSize.style.cursor = "pointer";
bubbleSize.style.width = "100px";
bubbleSize.style.marginLeft = "10px";
bubbleSize.style.marginRight = "10px";

document.getElementById("mapid").appendChild(styleDiv);
document.getElementById("styleDiv").appendChild(styleButton);
document.getElementById("styleDiv").appendChild(styleDivInside);

document.getElementById("styleDivInside").appendChild(bubbleSizeLabel);
document.getElementById("styleDivInside").appendChild(bubbleSize);

// -------------------------------------- Metadata --------------------------------------

let mapMetadataDiv = document.createElement("DIV");
let mapMetadataButton = document.createElement("BUTTON");
let mapMetadataDivInside = document.createElement("DIV");

let metadata = document.createElement("P");

let selectMetadata = document.createElement("SELECT");

mapMetadataDiv.id = "mapMetadataDiv";
mapMetadataDiv.classList.add("dropdown");
mapMetadataDiv.classList.add("toggle2");
mapMetadataDiv.style.position = "absolute";
mapMetadataDiv.style.bottom = "10px";
mapMetadataDiv.style.left = "45%";
mapMetadataDiv.style.zIndex = "2000";
mapMetadataDiv.style.display = "none";

mapMetadataButton.id = "mapMetadataButton";
mapMetadataButton.innerHTML = "Metadata";
mapMetadataButton.style.textAlign = "center";
mapMetadataButton.style.width = "75px";
mapMetadataButton.style.height = "25px";
mapMetadataButton.style.cursor = "pointer";
mapMetadataButton.style.backgroundColor = "black";
mapMetadataButton.style.borderColor = "white";
mapMetadataButton.style.color = "white";
mapMetadataButton.style.borderRadius = "10px";

mapMetadataDivInside.id = "mapMetadataDivInside";
mapMetadataDivInside.class = "dropdown-content";
mapMetadataDivInside.style.display = "none";
mapMetadataDivInside.style.position = "absolute";
mapMetadataDivInside.style.bottom = "25px";
mapMetadataDivInside.style.zIndex = "20";
mapMetadataDivInside.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
mapMetadataDivInside.style.lineHeight = "5px";
mapMetadataDivInside.style.paddingBottom = "15px";
mapMetadataDivInside.style.paddingLeft = "10px";
mapMetadataDivInside.style.paddingRight = "10px";
mapMetadataDivInside.style.fontSize = "12px";
mapMetadataDivInside.style.borderRadius = "10px";
mapMetadataDivInside.style.backgroundColor = "white";

metadata.id = "metadata";
metadata.innerHTML = "Color";
metadata.style.fontSize = "14px";
metadata.style.zIndex = "1000";
metadata.style.textAlign = "center";
metadata.style.color = "black";

selectMetadata.id = "selectMetadata";
selectMetadata.style.zIndex = "1000";
selectMetadata.style.display = "block";

document.getElementById("mapid").appendChild(mapMetadataDiv);

document.getElementById("mapMetadataDiv").appendChild(mapMetadataButton);
document.getElementById("mapMetadataDiv").appendChild(mapMetadataDivInside);

document.getElementById("mapMetadataDivInside").appendChild(metadata);
document.getElementById("mapMetadataDivInside").appendChild(selectMetadata);

// -------------------------------------- Button Dynamics --------------------------------------

document.getElementById("mapDivInside").addEventListener("mouseover", function () {

    mapDivInside.style.display = "block";

});

document.getElementById("mapDivInside").addEventListener("mouseout", function () {

    mapDivInside.style.display = "none";

});

document.getElementById("mapButton").addEventListener("mouseover", function () {

    mapDivInside.style.display = "block";

});

document.getElementById("mapButton").addEventListener("mouseout", function () {

    mapDivInside.style.display = "none";

});

document.getElementById("styleDivInside").addEventListener("mouseover", function () {

    styleDivInside.style.display = "block";

});

document.getElementById("styleDivInside").addEventListener("mouseout", function () {

    styleDivInside.style.display = "none";

});

document.getElementById("styleButton").addEventListener("mouseover", function () {

    styleDivInside.style.display = "block";

});

document.getElementById("styleButton").addEventListener("mouseout", function () {

    styleDivInside.style.display = "none";

});

document.getElementById("mapMetadataDivInside").addEventListener("mouseover", function () {

    mapMetadataDivInside.style.display = "block";

});

document.getElementById("mapMetadataDivInside").addEventListener("mouseout", function () {

    mapMetadataDivInside.style.display = "none";

});

document.getElementById("mapMetadataButton").addEventListener("mouseover", function () {

    mapMetadataDivInside.style.display = "block";

});

document.getElementById("mapMetadataButton").addEventListener("mouseout", function () {

    mapMetadataDivInside.style.display = "none";

});

// -------------------------------------- Tooltip --------------------------------------
/*
// create a tooltip
let Tooltip = d3.select('#mapid')
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
};

let mousemove = function(d) {

    let number = svg_input.split("g")[1];

    if(number%2 !== 0) {
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
};

 */