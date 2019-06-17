function geoMap(metaData) {

    let mapType;
    let lat = "";
    let long = "";

    //latitude
    //longitude

    for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

        let optionLatitude = document.createElement("OPTION");
        let optionLongitude = document.createElement("OPTION");

        optionLatitude.id = "optionLatitude"+j;
        optionLatitude.innerHTML= Object.keys(metaData[Object.keys(metaData)[0]])[j];
        optionLatitude.value = Object.keys(metaData[Object.keys(metaData)[0]])[j];

        optionLongitude.id = "optionLongitude"+j;
        optionLongitude.innerHTML= Object.keys(metaData[Object.keys(metaData)[0]])[j];
        optionLongitude.value = Object.keys(metaData[Object.keys(metaData)[0]])[j];

        document.getElementById("selectLatitude").appendChild(optionLatitude);
        document.getElementById("selectLongitude").appendChild(optionLongitude);

        if (Object.keys(metaData[Object.keys(metaData)[0]])[j].search("lat") !== -1) {
            lat = "latitude";
        }

        if (Object.keys(metaData[Object.keys(metaData)[0]])[j].search("long") !== -1) {
            long = "longitude";
        }

    }

    document.getElementById("selectLatitude").addEventListener("change", function () {

        for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

            if (document.getElementById("optionLatitude"+j).selected === true) {

                lat = Object.keys(metaData[Object.keys(metaData)[0]])[j];

            }
        }

        if (lat !== "" && long !== "") {

            // Select the svg area and add circles:
            d3.select("#mapid")
                .select("svg")
                .selectAll("myCircles")
                .data(markers)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return map.latLngToLayerPoint([d[lat], d[long]]).x
                })
                .attr("cy", function (d) {
                    return map.latLngToLayerPoint([d[lat], d[long]]).y
                })
                .attr("r", function (d) {
                    return label2number("Region", markers, d["Region"])*(document.getElementById("bubbleSize").value)
                })
                .style("fill", function (d) {
                    return "#" + intToRGB(hashCode(d.vaccine_status))
                })
                //   .attr("stroke", "red")
                .attr("stroke-width", 3)
                .attr("fill-opacity", .3);

        }

    });

    document.getElementById("selectLongitude").addEventListener("change", function () {

        for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

            if (document.getElementById("optionLongitude"+j).selected === true) {

                long = Object.keys(metaData[Object.keys(metaData)[0]])[j];

            }
        }

        if (lat !== "" && long !== "") {

            // Select the svg area and add circles:
            d3.select("#mapid")
                .select("svg")
                .selectAll("myCircles")
                .data(markers)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return map.latLngToLayerPoint([d[lat], d[long]]).x
                })
                .attr("cy", function (d) {
                    return map.latLngToLayerPoint([d[lat], d[long]]).y
                })
                .attr("r", function (d) {
                    return label2number("Region", markers, d["Region"])*(document.getElementById("bubbleSize").value)
                })
                .style("fill", function (d) {
                    return "#" + intToRGB(hashCode(d.vaccine_status))
                })
                //   .attr("stroke", "red")
                .attr("stroke-width", 3)
                .attr("fill-opacity", .3);

        }

    });

    // mapid is the id of the div where the map will appear
    let map = L
        .map('mapid')
        .setView([38, 9], 5);   // center position + zoom

    /*
    MAPS CHOICE (URLs):
    Dark (No Labels) - https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png
    Dark (Labels) - https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png

    Satellite (No Labels) - https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}

    Light (No Labels) - https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png
    */

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
        mapType = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                maxZoom: 10,
                minZoom: 1

            }).addTo(map);

        document.getElementById("mapButton").src = "../img/dark.png";
        document.getElementById("toggle2").src = "../img/pixelmator/gear_white.png";
        document.getElementById("bubbleSizeLabel").style.color = "white";
    });

    document.getElementById("Light").addEventListener("click", function () {

        map.removeLayer(mapType);

        // Add a tile to the map = a background. Comes from OpenStreetmap
        mapType = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
                //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                maxZoom: 19,
                minZoom: 1

            }).addTo(map);

        document.getElementById("mapButton").src = "../img/light.png";
        document.getElementById("toggle2").src = "../img/pixelmator/gear_black.png";
        document.getElementById("bubbleSizeLabel").style.color = "black";
    });

    document.getElementById("Satellite").addEventListener("click", function () {

        map.removeLayer(mapType);

        // Add a tile to the map = a background. Comes from OpenStreetmap
        mapType = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                maxZoom: 10,
                minZoom: 1

            }).addTo(map);

        document.getElementById("mapButton").src = "../img/satellite.png";
        document.getElementById("toggle2").src = "../img/pixelmator/gear_white.png";
        document.getElementById("bubbleSizeLabel").style.color = "white";

    });

    // Add a svg layer to the map
    L.svg().addTo(map);

    map.zoomControl.remove();

    let markers = Object.values(metaData);

    if (lat !== "" && long !== "") {

    // Select the svg area and add circles:
    d3.select("#mapid")
        .select("svg")
        .selectAll("myCircles")
        .data(markers)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return map.latLngToLayerPoint([d[lat], d[long]]).x
        })
        .attr("cy", function (d) {
            return map.latLngToLayerPoint([d[lat], d[long]]).y
        })
        .attr("r", function (d) {
            return label2number("Region", markers, d["Region"])*(document.getElementById("bubbleSize").value)
        })
        .style("fill", function (d) {
            return "#" + intToRGB(hashCode(d.vaccine_status))
        })
        //   .attr("stroke", "red")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .3);
    }

    // Function that update circle position if something change
    function update() {
        d3.selectAll("circle")
            .attr("cx", function (d) {
                return map.latLngToLayerPoint([d[lat], d[long]]).x
            })
            .attr("cy", function (d) {
                return map.latLngToLayerPoint([d[lat], d[long]]).y
            })
    }

    // If the user change the map (zoom or drag), I update circle position:
    map.on("moveend", update);

    document.getElementById("bubbleSize").addEventListener("input", function () {

        d3.selectAll("circle")
            .attr("r", function (d) {
                return label2number("Region", markers, d.Region)*(document.getElementById("bubbleSize").value)
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

// -------------------------------------- Bottom Bar --------------------------------------

let mapBottomBar = document.createElement("DIV");

mapBottomBar.id = "mapBottomBar";
mapBottomBar.className = "toggle2";
mapBottomBar.style.display = "none";
mapBottomBar.style.position = "absolute";
mapBottomBar.style.left = "40%";
mapBottomBar.style.bottom = "0";
mapBottomBar.style.minWidth = "20%";
mapBottomBar.style.minHeight = "8%";
mapBottomBar.style.zIndex = "800";
mapBottomBar.style.backgroundColor = "black"; // #BAD2EE
mapBottomBar.style.opacity = "1";
mapBottomBar.style.borderTopLeftRadius = "10px";
mapBottomBar.style.borderTopRightRadius = "10px";

document.getElementById("mapid").appendChild(mapBottomBar);

// -------------------------------------- Map --------------------------------------

let mapDiv = document.createElement("DIV");
let mapButton = document.createElement("BUTTON");
let mapDivInside = document.createElement("DIV");

let mapType1 = document.createElement("IMG");
let mapType2 = document.createElement("IMG");
let mapType3 = document.createElement("IMG");

mapDiv.id = "mapDiv";
mapDiv.classList.add("dropdown");
mapDiv.style.position = "absolute";
mapDiv.style.right = "10%";
mapDiv.style.bottom = "6px";
mapDiv.style.zIndex = "2000";

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

document.getElementById("mapBottomBar").appendChild(mapDiv);
document.getElementById("mapDiv").appendChild(mapButton);
document.getElementById("mapDiv").appendChild(mapDivInside);

document.getElementById("mapDivInside").appendChild(mapType1);
document.getElementById("mapDivInside").appendChild(mapType2);
document.getElementById("mapDivInside").appendChild(mapType3);

// -------------------------------------- Style --------------------------------------

let styleDiv = document.createElement("DIV");
let styleButton = document.createElement("BUTTON");
let styleDivInside = document.createElement("DIV");

let bubbleSizeLabel = document.createElement("P");
let bubbleSize = document.createElement("INPUT");

styleDiv.id = "styleDiv";
styleDiv.classList.add("dropdown");
styleDiv.style.position = "absolute";
styleDiv.style.left = "10%";
styleDiv.style.bottom = "6px";
styleDiv.style.zIndex = "2000";

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

bubbleSizeLabel.id = "bubbleSizeLabel";
bubbleSizeLabel.innerHTML = "Bubble Size";
bubbleSizeLabel.style.fontSize = "14px";
bubbleSizeLabel.style.zIndex = "1000";
bubbleSizeLabel.style.textAlign = "center";
bubbleSizeLabel.style.color = "white";

bubbleSize.id = "bubbleSize";
bubbleSize.type = "range";
bubbleSize.value = "10";
bubbleSize.style.zIndex = "1000";
bubbleSize.style.cursor = "pointer";
bubbleSize.style.width = "100px";
bubbleSize.style.marginLeft = "10px";
bubbleSize.style.marginRight = "10px";

document.getElementById("mapBottomBar").appendChild(styleDiv);
document.getElementById("styleDiv").appendChild(styleButton);
document.getElementById("styleDiv").appendChild(styleDivInside);

document.getElementById("styleDivInside").appendChild(bubbleSizeLabel);
document.getElementById("styleDivInside").appendChild(bubbleSize);

// -------------------------------------- Metadata --------------------------------------

let mapMetadataDiv = document.createElement("DIV");
let mapMetadataButton = document.createElement("BUTTON");
let mapMetadataDivInside = document.createElement("DIV");

let latitude = document.createElement("P");
let longitude = document.createElement("P");

let selectLatitude = document.createElement("SELECT");
let selectLongitude = document.createElement("SELECT");

mapMetadataDiv.id = "mapMetadataDiv";
mapMetadataDiv.classList.add("dropdown");
mapMetadataDiv.style.position = "absolute";
mapMetadataDiv.style.left = "37%";
mapMetadataDiv.style.bottom = "6px";
mapMetadataDiv.style.zIndex = "2000";

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
mapMetadataDivInside.style.paddingBottom = "25px";
mapMetadataDivInside.style.paddingLeft = "10px";
mapMetadataDivInside.style.paddingRight = "10px";

latitude.id = "latitude";
latitude.innerHTML = "Latitude";
latitude.style.fontSize = "14px";
latitude.style.zIndex = "1000";
latitude.style.textAlign = "center";
latitude.style.color = "white";

longitude.id = "longitude";
longitude.innerHTML = "Longitude";
longitude.style.fontSize = "14px";
longitude.style.zIndex = "1000";
longitude.style.textAlign = "center";
longitude.style.color = "white";

selectLatitude.id = "selectLatitude";
selectLatitude.style.zIndex = "1000";
selectLatitude.style.display = "block";

selectLongitude.id = "selectLongitude";
selectLongitude.style.zIndex = "1000";
selectLatitude.style.display = "block";

document.getElementById("mapBottomBar").appendChild(mapMetadataDiv);

document.getElementById("mapMetadataDiv").appendChild(mapMetadataButton);
document.getElementById("mapMetadataDiv").appendChild(mapMetadataDivInside);

document.getElementById("mapMetadataDivInside").appendChild(latitude);
document.getElementById("mapMetadataDivInside").appendChild(selectLatitude);
document.getElementById("mapMetadataDivInside").appendChild(longitude);
document.getElementById("mapMetadataDivInside").appendChild(selectLongitude);

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