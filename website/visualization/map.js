let minTime, maxTime, stepTime, markers, metaaa;
let remade = [];

// -------------------------------------- Metadata Dependent Operations --------------------------------------

function geoMap(metaData) {

    let mapType, mapType2;
    let lat = "latitude";
    let long = "longitude";
    let mapConfig = "light";

    // -------------------------------- Creating Meta ({metadata: values, ...})

    let meta = {};

    for (let i = 0; i < Object.keys(Object.values(metaData)[0]).length; i++) { // Picking metadata type.

        for (let j = 0; j < Object.keys(metaData).length; j++) { // Picking strain by name.

            if (Number.isInteger(parseInt(Object.values(metaData[Object.keys(metaData)[j]])[i]))) {

                meta[Object.keys(Object.values(metaData)[0])[i]] = meta[Object.keys(Object.values(metaData)[0])[i]] || {};

                if (Object.keys(metaData[Object.keys(metaData)[0]])[i] === "onset date" || Object.keys(metaData[Object.keys(metaData)[0]])[i] === "collection date" || Object.keys(metaData[Object.keys(metaData)[0]])[i] === "lab reception date") {

                    meta[Object.keys(Object.values(metaData)[0])[i]][(Object.values(metaData[Object.keys(metaData)[j]])[i]).split('-').join('')] = true;

                } else {

                    meta[Object.keys(Object.values(metaData)[0])[i]][Object.values(metaData[Object.keys(metaData)[j]])[i]] = true;
                }


            }
        }
    }

    console.log(meta);

    // -------------------------------- Adding Selective Metadata Categories Timeline

    let include = {};

    for (let i = 0; i < Object.keys(Object.values(metaData)[0]).length; i++) {

        if (i === 0) {

            let optionTimee = document.createElement("OPTION");

            optionTimee.id = "optionTimee";
            optionTimee.innerHTML= "None";

            document.getElementById("selectTime").appendChild(optionTimee);
        }

        let optionTime = document.createElement("OPTION");

        optionTime.id = "optionTime" + i;
        optionTime.style.display = "none";

        optionTime.value = Object.keys(metaData[Object.keys(metaData)[0]])[i];

        document.getElementById("selectTime").appendChild(optionTime); // Swap

        for (let j = 0; j < Object.keys(meta[Object.keys(meta)[i]]).length; j++) {

            if (j === Object.keys(meta[Object.keys(meta)[i]]).length - 1 && (Object.keys(metaData[Object.keys(metaData)[0]])[i] === "onset date" || Object.keys(metaData[Object.keys(metaData)[0]])[i] === "collection date" || Object.keys(metaData[Object.keys(metaData)[0]])[i] === "lab reception date" || Object.keys(metaData[Object.keys(metaData)[0]])[i] === "year" || Object.keys(metaData[Object.keys(metaData)[0]])[i] === "date")) {

                include[Object.keys(metaData[Object.keys(metaData)[0]])[i]] = true;
                optionTime.style.display = "block";
                optionTime.innerHTML = Object.keys(metaData[Object.keys(metaData)[0]])[i];
            }
        }

        let optionMetadata = document.createElement("OPTION");

        optionMetadata.id = "optionMetadata"+i;
        optionMetadata.innerHTML= Object.keys(metaData[Object.keys(metaData)[0]])[i];
        optionMetadata.value = Object.keys(metaData[Object.keys(metaData)[0]])[i];

        document.getElementById("selectMetadata").appendChild(optionMetadata);
    }

    // -------------------------------- Setting Initial Map Properties

    // mapid is the id of the div where the map will appear
    let map = L
        .map('mapid')
        .setView([38, 9], 5);   // center position + zoom

    mapType = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
            minZoom: 1,
            maxZoom: 10

        }).addTo(map);

    // -------------------------------- Listening Clicks Pick Map

    // Dark Mode

    document.getElementById("Dark").addEventListener("click", function () {

        map.removeLayer(mapType);

        if (mapType2 !== undefined) map.removeLayer(mapType2);

        if((document.getElementById("streets").src).search("img/labels_full.png") !== -1) {
            mapType = L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    minZoom: 1,
                    maxZoom: 10

                }).addTo(map);

        } else {

            mapType = L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                    minZoom: 1,
                    maxZoom: 10

                }).addTo(map);
        }

        document.getElementById("mapButton").src = "../img/dark.png";
        document.getElementById("toggle2").src = "../img/pixelmator/gear_white.png";

        d3.selectAll("circle").style("fill", function (d) {

                return "white"

                //return "#" + intToRGB(hashCode(d["vaccine_status"]))
            })
            .attr("stroke", function (d) {

                for (let i = 0; i < (tree.getSelectedNodeIds()).length; i++) {
                    if (d[lat] === metaData[tree.getSelectedNodeIds()[i]][lat]) {
                            return "white";
                    }
                }
            });

        mapConfig = "dark";

    });

    // Light Mode

    document.getElementById("Light").addEventListener("click", function () {

        map.removeLayer(mapType);
        if (mapType2 !== undefined) map.removeLayer(mapType2);

        if((document.getElementById("streets").src).search("img/labels_full.png") !== -1) {
            mapType = L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    minZoom: 1,
                    maxZoom: 19

                }).addTo(map);

        } else {

                mapType = L.tileLayer(
                    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
                        minZoom: 1,
                        maxZoom: 19

                    }).addTo(map);
        }

        document.getElementById("mapButton").src = "../img/light.png";
        document.getElementById("toggle2").src = "../img/pixelmator/gear_black.png";

        d3.selectAll("circle").style("fill", function (d) {

                return "black"
         })
            .attr("stroke", function (d) {

            for (let i = 0; i < (tree.getSelectedNodeIds()).length; i++) {
                if (d[lat] === metaData[tree.getSelectedNodeIds()[i]][lat]) {
                     return "black";
                }
            }
        });

        mapConfig = "light";
    });

    // Satellite Mode

    document.getElementById("Satellite").addEventListener("click", function () {

        map.removeLayer(mapType);
        if (mapType2 !== undefined) map.removeLayer(mapType2);

        if((document.getElementById("streets").src).search("img/labels_full.png") !== -1) {
            mapType = L.tileLayer(
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    minZoom: 1,
                    maxZoom: 10

                }).addTo(map);

            mapType2 = L.tileLayer(
                'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
                    minZoom: 1,
                    maxZoom: 10,
                    ext: "png"

                }).addTo(map);

        } else {

            mapType = L.tileLayer(
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    minZoom: 1,
                    maxZoom: 10

                }).addTo(map);
        }

        document.getElementById("mapButton").src = "../img/satellite.png";
        document.getElementById("toggle2").src = "../img/pixelmator/gear_white.png";

        d3.selectAll("circle").style("fill", function (d) {

                return "white"

            })
            .attr("stroke", function (d) {

            for (let i = 0; i < (tree.getSelectedNodeIds()).length; i++) {
                if (d[lat] === metaData[tree.getSelectedNodeIds()[i]][lat]) {
                        return "white";
                }
            }
        });

        mapConfig = "satellite";
    });

    // -------------------------------- Listening Changes Road Switch

    document.getElementById("streets").addEventListener("click", function () {

            if ((document.getElementById("streets").src).search("img/labels_empty.png") !== -1) {

                document.getElementById("streets").src = "../img/labels_full.png";

                switch (mapConfig) {

                    case "dark":

                        map.removeLayer(mapType);

                        mapType = L.tileLayer(
                            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                                minZoom: 1,
                                maxZoom: 10

                            }).addTo(map);

                        break;

                    case "light":

                        map.removeLayer(mapType);

                        mapType = L.tileLayer(
                            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                                minZoom: 1,
                                maxZoom: 10

                            }).addTo(map);

                        break;

                    case "satellite":

                        map.removeLayer(mapType);

                        mapType = L.tileLayer(
                            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                                minZoom: 1,
                                maxZoom: 10

                            }).addTo(map);

                        mapType2 = L.tileLayer(
                            'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
                                minZoom: 1,
                                maxZoom: 10,
                                ext: "png"

                            }).addTo(map);
                }

            } else {

                document.getElementById("streets").src = "../img/labels_empty.png";

                switch (mapConfig) {

                    case "dark":

                        map.removeLayer(mapType);

                        mapType = L.tileLayer(
                            'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                                minZoom: 1,
                                maxZoom: 10

                            }).addTo(map);

                        break;

                    case "light":

                        map.removeLayer(mapType);

                        mapType = L.tileLayer(
                            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
                                minZoom: 1,
                                maxZoom: 10

                            }).addTo(map);

                        break;

                    case "satellite":

                        map.removeLayer(mapType);

                        mapType = L.tileLayer(
                            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                                minZoom: 1,
                                maxZoom: 10

                            }).addTo(map);
                }
            }
    });

    // ------------------------- Adding Circles As SVG Layer

    // Add a svg layer to the map
    L.svg().addTo(map);

    map.zoomControl.remove();
    markers = Object.values(metaData);

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

                return label2number("latitude", "longitude", maxTime, metaaa, markers, d["latitude"] + d["longitude"])*(document.getElementById("bubbleSize").value)/numberNonEmpty("latitude", "longitude", markers, metaaa);

            } else {

                return "0";

            }
        })
        .style("fill", function (d) {

            return "black"

        })
        //   .attr("stroke", "red")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .5);

    // ------------------------- Updating Circle Position (Drag or Zoom)

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

    map.on("moveend", update);

    // ------------------------- Listening Changes Bubble Size

    document.getElementById("bubbleSize").addEventListener("input", function () {

        let latlong2 = [];

        d3.selectAll("circle")
            .attr("r", function (d) {

                if (isNaN(d[long]) === false && isNaN(d[lat]) === false && latlong2.includes(d[lat].toString() + d[long].toString()) === false && d[lat] !== "" && d[long] !== "") {

                    latlong2.push(d[lat].toString() + d[long].toString());

                    if (document.getElementById("logButton").src.search("img/log_full.png") !== -1) {

                        return Math.log(1 + label2number("latitude", "longitude", maxTime, metaaa, markers, d["latitude"] + d["longitude"]) * (document.getElementById("bubbleSize").value) / numberNonEmpty("latitude", "longitude", markers, metaaa));

                    } else if (document.getElementById("constButton").src.search("img/const_full.png") !== -1) {

                        return document.getElementById("bubbleSize").value;

                    } else {

                            return label2number("latitude", "longitude", maxTime, metaaa, markers, d["latitude"] + d["longitude"])*(document.getElementById("bubbleSize").value)/numberNonEmpty("latitude", "longitude", markers, metaaa);
                    }
                } else {

                    return "0";

                }
            });
    });

    // ------------------------- Listening Logarithmic Bubble Size

    document.getElementById("logButton").addEventListener("click", function () {

        let latlong2 = [];

        d3.selectAll("circle")
            .attr("r", function (d) {

                if (isNaN(d[long]) === false && isNaN(d[lat]) === false && latlong2.includes(d[lat].toString() + d[long].toString()) === false && d[lat] !== "" && d[long] !== "") {

                    latlong2.push(d[lat].toString() + d[long].toString());

                    if (document.getElementById("logButton").src.search("img/log_empty.png") !== -1) {

                        return Math.log(1 + label2number("latitude", "longitude", maxTime, metaaa, markers, d["latitude"] + d["longitude"]) * (document.getElementById("bubbleSize").value) / numberNonEmpty("latitude", "longitude", markers, metaaa));

                    } else {

                        return label2number("latitude", "longitude", maxTime, metaaa, markers, d["latitude"] + d["longitude"])*(document.getElementById("bubbleSize").value)/numberNonEmpty("latitude", "longitude", markers, metaaa);

                    }

                } else {

                    return "0";

                }
            });

        if (document.getElementById("logButton").src.search("img/log_empty.png") !== -1) {

            document.getElementById("logButton").src = "../img/log_full.png";
            document.getElementById("constButton").src = "../img/const_empty.png";
            document.getElementById("optionTimee").selected = true;
            document.getElementById("timelineLabel").innerText = "Timeline";
            document.getElementById("selectSpeed").value = 1;

        } else {

            document.getElementById("logButton").src = "../img/log_empty.png";
            document.getElementById("constButton").src = "../img/const_empty.png";

        }
    });

    // ------------------------- Listening Constant Bubble Size

    document.getElementById("constButton").addEventListener("click", function () {

        let latlong2 = [];

        d3.selectAll("circle")
            .attr("r", function (d) {

                if (isNaN(d[long]) === false && isNaN(d[lat]) === false && latlong2.includes(d[lat].toString() + d[long].toString()) === false && d[lat] !== "" && d[long] !== "") {

                    latlong2.push(d[lat].toString() + d[long].toString());

                    if (document.getElementById("constButton").src.search("img/const_empty.png") !== -1) {

                        return document.getElementById("bubbleSize").value;

                    } else {

                        return label2number("latitude", "longitude", maxTime, metaaa, markers, d["latitude"] + d["longitude"])*(document.getElementById("bubbleSize").value)/numberNonEmpty("latitude", "longitude", markers, metaaa);

                    }

                } else {

                    return "0";

                }
            });

        if (document.getElementById("constButton").src.search("img/const_empty.png") !== -1) {

            document.getElementById("constButton").src = "../img/const_full.png";
            document.getElementById("logButton").src = "../img/log_empty.png";
            document.getElementById("optionTimee").selected = true;
            document.getElementById("timelineLabel").innerText = "Timeline";
            document.getElementById("selectSpeed").value = 1;

        } else {

            document.getElementById("constButton").src = "../img/const_empty.png";
            document.getElementById("logButton").src = "../img/log_empty.png";
        }
    });

    // ------------------------- Listening Changes Timeline

    document.getElementById("timeline").addEventListener("input", function () {

        document.getElementById("timelineLabel").innerHTML = convertTime((remade[Math.round((document.getElementById("timeline").value - minTime)/stepTime)]).toString());

        document.getElementById("timeline").step = stepTime;

        let latlong2 = [];

        d3.selectAll("circle")
            .attr("r", function (d) {

                if (isNaN(d["longitude"]) === false && isNaN(d["latitude"]) === false && latlong2.includes(d["latitude"].toString() + d["longitude"].toString()) === false && d["latitude"] !== "" && d["longitude"] !== "") {

                    latlong2.push(d["latitude"].toString() + d["longitude"].toString());

                    return label2number("latitude", "longitude", (document.getElementById("timelineLabel").innerText).split('-').join(''), metaaa, markers, d["latitude"] + d["longitude"])*(document.getElementById("bubbleSize").value)/numberNonEmpty("latitude", "longitude", markers, metaaa);

                } else {

                    return 0;
                }
            });
    });

    // ------------------------- Listening Clicks Toggle Button

    document.getElementById("toggle2").addEventListener("mousedown", function () {

        let x = document.getElementsByClassName("toggle2");

        for (let i = 0; i < x.length; i++) {
            if (x[i].style.display === "none") {
                x[i].style.display = "block";
                map.zoomControl.addTo(map);
                document.getElementById("toggle2").style.transform = "rotate(-15deg)";
            } else {
                x[i].style.display = "none";
                map.zoomControl.remove();
                document.getElementById("toggle2").style.transform = "rotate(15deg)";
            }
        }

        map.doubleClickZoom.disable();
        map.dragging.disable();
    });

    // ------------------------- Listening Changes Timeline Metadata Picker

    document.getElementById("selectTime").addEventListener("change", function () {

        document.getElementById("logButton").src = "../img/log_empty.png";
        document.getElementById("constButton").src = "../img/const_empty.png";

        if ((document.getElementById("play").src).search("img/pause.png") !== -1) {

            document.getElementById("play").src = "../img/play.png";

        }

        document.getElementById("timeline").disabled = false;

        if (document.getElementById("optionTimee").selected) {
            document.getElementById("timelineLabel").innerHTML = "Timeline";
            document.getElementById("timeline").disabled = true;
        }

        for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) { // Iterating over metadata categories.

            if (document.getElementById("optionTime"+j).selected) {

                metaaa = document.getElementById("optionTime"+j).innerText;

                remade = [];

                Object.keys(meta[document.getElementById("optionTime"+j).innerText]).forEach(function (value, index) {

                    for (let j = 0; j < Object.keys(metaData).length; j++) {
                        if (((metaData[Object.keys(metaData)[j]][metaaa]).toString()).split('-').join('') === (parseInt(value)).toString() && isNaN(metaData[Object.keys(metaData)[j]]["latitude"]) === false && isNaN(metaData[Object.keys(metaData)[j]]["longitude"]) === false) {
                            remade.push(parseInt(value));
                            break;
                        }
                    }
                });

                minTime = Math.min.apply(null, remade);
                maxTime = Math.max.apply(null, remade);
                stepTime = (maxTime - minTime)/(remade.length - 1);

                document.getElementById("timeline").step = stepTime;
                document.getElementById("timeline").min = minTime;
                document.getElementById("timeline").max = maxTime;

                document.getElementById("timelineLabel").innerHTML = convertTime(maxTime.toString());
                document.getElementById("timeline").value = maxTime;

                break;
            }
        }
/*
        let latlong2 = [];

        d3.selectAll("circle")
            .attr("r", function (d) {

                if (isNaN(d["longitude"]) === false && isNaN(d["latitude"]) === false && latlong2.includes(d["latitude"].toString() + d["longitude"].toString()) === false && d["latitude"] !== "" && d["longitude"] !== "") {

console.log(label2number("latitude", "longitude", maxTime.toString().split('-').join(''), metaaa, markers, d["latitude"] + d["longitude"])*(document.getElementById("bubbleSize").value)/numberNonEmpty("latitude", "longitude", markers, metaaa));

                    latlong2.push(d["latitude"].toString() + d["longitude"].toString());

                    return label2number("latitude", "longitude", maxTime.toString().split('-').join(''), metaaa, markers, d["latitude"] + d["longitude"])*(document.getElementById("bubbleSize").value)/numberNonEmpty("latitude", "longitude", markers, metaaa);

                } else {

                    return 0;

                }
            });
        */
    });

    // -------------------------------------- Mouse Over Dynamics --------------------------------------
    //
    // -------------------------------- Dragging & Zoom
    //
    // Mouse Over

    document.getElementById("mapButton").addEventListener("mouseover", function () {

        map.doubleClickZoom.disable();
        map.dragging.disable();
    });

    document.getElementById("mapMetadataButton").addEventListener("mouseover", function () {

        map.doubleClickZoom.disable();
        map.dragging.disable();
    });

    document.getElementById("styleButton").addEventListener("mouseover", function () {

        map.doubleClickZoom.disable();
        map.dragging.disable();
    });

    document.getElementById("styleDivInside").addEventListener("mouseover", function () {

        map.doubleClickZoom.disable();
        map.dragging.disable();
    });

    document.getElementById("mapMetadataDivInside").addEventListener("mouseover", function () {

        map.doubleClickZoom.disable();
        map.dragging.disable();
    });

    document.getElementById("mapDivInside").addEventListener("mouseover", function () {

        map.doubleClickZoom.disable();
        map.dragging.disable();
    });

    document.getElementById("timelineDiv").addEventListener("mouseover", function () {

        map.doubleClickZoom.disable();
        map.dragging.disable();
    });

    // Mouse Leave

    document.getElementById("toggle2").addEventListener("mouseleave", function () {

        map.doubleClickZoom.enable();
        map.dragging.enable();
    });

    document.getElementById("mapButton").addEventListener("mouseleave", function () {

        map.doubleClickZoom.enable();
        map.dragging.enable();
    });

    document.getElementById("mapMetadataButton").addEventListener("mouseleave", function () {

        map.doubleClickZoom.enable();
        map.dragging.enable();
    });

    document.getElementById("styleButton").addEventListener("mouseleave", function () {

        map.doubleClickZoom.enable();
        map.dragging.enable();
    });

    document.getElementById("styleDivInside").addEventListener("mouseleave", function () {

        map.doubleClickZoom.enable();
        map.dragging.enable();
    });

    document.getElementById("mapMetadataDivInside").addEventListener("mouseleave", function () {

        map.doubleClickZoom.enable();
        //map.scrollWheelZoom.enable();
        map.dragging.enable();
    });

    document.getElementById("mapDivInside").addEventListener("mouseleave", function () {

        map.doubleClickZoom.enable();
        map.dragging.enable();
    });

    document.getElementById("timelineDiv").addEventListener("mouseleave", function () {

        map.doubleClickZoom.enable();
        map.dragging.enable();
    });

// -------------------------------- Display

// Mouse Over

    document.getElementById("mapDivInside").addEventListener("mouseover", function () {

        mapDivInside.style.display = "block";
    });

    document.getElementById("mapButton").addEventListener("mouseover", function () {

        mapDivInside.style.display = "block";
    });

    document.getElementById("styleDivInside").addEventListener("mouseover", function () {

        styleDivInside.style.display = "block";
    });

    document.getElementById("styleButton").addEventListener("mouseover", function () {

        styleDivInside.style.display = "block";
    });

    document.getElementById("mapMetadataDivInside").addEventListener("mouseover", function () {

        mapMetadataDivInside.style.display = "block";
    });

    document.getElementById("mapMetadataButton").addEventListener("mouseover", function () {

        mapMetadataDivInside.style.display = "block";
    });

    // Mouse Out

    document.getElementById("mapDivInside").addEventListener("mouseout", function () {

        mapDivInside.style.display = "none";
    });

    document.getElementById("mapButton").addEventListener("mouseout", function () {

        mapDivInside.style.display = "none";
    });

    document.getElementById("styleDivInside").addEventListener("mouseout", function () {

        styleDivInside.style.display = "none";
    });

    document.getElementById("styleButton").addEventListener("mouseout", function () {

        styleDivInside.style.display = "none";
    });

    document.getElementById("mapMetadataDivInside").addEventListener("mouseout", function () {

        mapMetadataDivInside.style.display = "none";
    });

    document.getElementById("mapMetadataButton").addEventListener("mouseout", function () {

        mapMetadataDivInside.style.display = "none";
    });

    // -------------------------------------- Communication with Tree --------------------------------------

    document.getElementById("phylocanvas").addEventListener("click", function () {

        d3.selectAll("circle")
            .attr("stroke", function (d) {

                for (let i = 0; i < (tree.getSelectedNodeIds()).length; i++) {
                    if (d[lat] === metaData[tree.getSelectedNodeIds()[i]][lat]) {

                        if (mapConfig === "light") {
                            return "black";
                        } else {
                            return "white";
                        }
                    }
                }
            });
    });
}

// -------------------------------------- Toggle Gear --------------------------------------

let mapToggleGear = document.createElement("IMG");

mapToggleGear.id = "toggle2";
mapToggleGear.style.position = "absolute";
mapToggleGear.style.right = "10px";
mapToggleGear.style.top = "10px";
mapToggleGear.style.zIndex = "1000";
mapToggleGear.src = "../img/pixelmator/gear_black.png";
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
let streets = document.createElement("IMG"); // Checkbox input.

mapDiv.id = "mapDiv";
mapDiv.className = "toggle2";
mapDiv.style.position = "absolute";
mapDiv.style.left = "52%";
mapDiv.style.bottom = "10px";
mapDiv.style.zIndex = "2000";
mapDiv.style.display = "none";

mapButton.id = "mapButton";
mapButton.innerHTML = "Map";
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
mapDivInside.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
mapDivInside.style.paddingBottom = "10px";
mapDivInside.style.borderRadius = "10px";
mapDivInside.style.backgroundColor = "white";

mapType1.id = "Dark";
mapType1.style.cursor = "pointer";
mapType1.style.padding = "5px 5px";
mapType1.src = "../img/dark.png";
mapType1.style.width = "100px";

mapType2.id = "Light";
mapType2.style.cursor = "pointer";
mapType2.style.padding = "5px 5px";
mapType2.src = "../img/light.png";
mapType2.style.width = "100px";

mapType3.id = "Satellite";
mapType3.style.cursor = "pointer";
mapType3.style.padding = "5px 5px";
mapType3.src = "../img/satellite.png";
mapType3.style.width = "100px";

streetsLabel.id = "streetsLabel";
streetsLabel.className = "streetsLabel";
streetsLabel.style.display = "block";
streetsLabel.style.textAlign = "center";

streets.id = "streets";
streets.className = "streets";
streets.style.zIndex = "2000";
streets.style.cursor = "pointer";
streets.src = "../img/labels_empty.png";
streets.style.width = "40px";

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

let logConstDiv = document.createElement("LABEL"); // Metadata label.
let logButton = document.createElement("IMG"); // Metadata label.
let constButton = document.createElement("IMG"); // Metadata label.

styleDiv.id = "styleDiv";
styleDiv.className = "toggle2";
styleDiv.style.position = "absolute";
styleDiv.style.bottom = "10px";
styleDiv.style.left = "40%";
styleDiv.style.zIndex = "2000";
styleDiv.style.display = "none";

styleButton.id = "styleButton";
styleButton.innerHTML = "Style";
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

bubbleSize.id = "bubbleSize";
bubbleSize.type = "range";
bubbleSize.value = "50";
bubbleSize.style.zIndex = "1000";
bubbleSize.style.cursor = "pointer";
bubbleSize.style.width = "100px";
bubbleSize.style.marginLeft = "10px";
bubbleSize.style.marginRight = "10px";

logConstDiv.id = "logConstDiv";
logConstDiv.style.display = "block";
logConstDiv.style.paddingLeft = "10px";
logConstDiv.style.paddingRight = "10px";
logConstDiv.style.backgroundColor = "white";
logConstDiv.style.color = "black";
logConstDiv.style.textAlign = "center";

logButton.id = "logButton";
logButton.style.display = "inline-block";
logButton.style.paddingLeft = "10px";
logButton.style.paddingRight = "10px";
logButton.style.cursor = "pointer";
logButton.style.width = "20px";
logButton.src = "../img/log_empty.png";

constButton.id = "constButton";
constButton.style.display = "inline-block";
constButton.style.paddingLeft = "10px";
constButton.style.paddingRight = "10px";
constButton.style.paddingBottom = "2px";
constButton.style.cursor = "pointer";
constButton.style.width = "30px";
constButton.src = "../img/const_empty.png";

document.getElementById("mapid").appendChild(styleDiv);
document.getElementById("styleDiv").appendChild(styleButton);
document.getElementById("styleDiv").appendChild(styleDivInside);

document.getElementById("styleDivInside").appendChild(bubbleSizeLabel);
document.getElementById("styleDivInside").appendChild(bubbleSize);
document.getElementById("styleDivInside").appendChild(logConstDiv);

document.getElementById("logConstDiv").appendChild(logButton);
document.getElementById("logConstDiv").appendChild(constButton);

// -------------------------------------- Metadata --------------------------------------

let mapMetadataDiv = document.createElement("DIV");
let mapMetadataButton = document.createElement("BUTTON");
let mapMetadataDivInside = document.createElement("DIV");

let metadata = document.createElement("P");

let selectMetadata = document.createElement("SELECT");

mapMetadataDiv.id = "mapMetadataDiv";
mapMetadataDiv.classList.add("toggle2");
mapMetadataDiv.style.position = "absolute";
mapMetadataDiv.style.bottom = "10px";
mapMetadataDiv.style.left = "45%";
mapMetadataDiv.style.zIndex = "2000";
mapMetadataDiv.style.display = "none";

mapMetadataButton.id = "mapMetadataButton";
mapMetadataButton.innerHTML = "Metadata";
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

selectMetadata.id = "selectMetadata";
selectMetadata.style.zIndex = "1000";

document.getElementById("mapid").appendChild(mapMetadataDiv);

document.getElementById("mapMetadataDiv").appendChild(mapMetadataButton);
document.getElementById("mapMetadataDiv").appendChild(mapMetadataDivInside);

document.getElementById("mapMetadataDivInside").appendChild(metadata);
document.getElementById("mapMetadataDivInside").appendChild(selectMetadata);

// -------------------------------------- Timeline --------------------------------------

let timelineDiv = document.createElement("DIV");
let timelineLabel = document.createElement("P");
let timeline = document.createElement("INPUT");

let selectTime = document.createElement("SELECT");
let selectSpeed = document.createElement("INPUT");
let play = document.createElement("IMG");

timelineDiv.id = "timelineDiv";
timelineDiv.classList.add("toggle2");
timelineDiv.style.display = "none";
timelineDiv.style.position = "absolute";
timelineDiv.style.top = "10px";
timelineDiv.style.left = "37%";
timelineDiv.style.zIndex = "2000";
//timelineDiv.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
timelineDiv.style.borderRadius = "10px";
timelineDiv.style.backgroundColor = "white";
timelineDiv.style.lineHeight = "5px";
timelineDiv.style.border = "solid";
timelineDiv.style.borderWidth = "2px";
timelineDiv.style.paddingLeft = "10px";
timelineDiv.style.paddingRight = "10px";

timelineLabel.id = "timelineLabel";
timelineLabel.innerHTML = "Timeline";
timelineLabel.style.fontSize = "14px";
timelineLabel.style.display = "inline-block";

timeline.id = "timeline";
timeline.type = "range";
timeline.value = "50";
timeline.style.cursor = "pointer";
timeline.style.width = "100px";
timeline.style.marginLeft = "10px";
timeline.style.marginRight = "10px";
timeline.style.display = "inline-block";
timeline.disabled = true;

selectTime.id = "selectTime";
selectTime.style.display = "inline-block";

selectSpeed.id = "selectSpeed";
selectSpeed.type = "number";
selectSpeed.value = "1";
selectSpeed.style.cursor = "pointer";
selectSpeed.style.width = "40px";
selectSpeed.style.marginLeft = "10px";
selectSpeed.style.display = "inline-block";
selectSpeed.min = "0.5";
selectSpeed.max = "2";
selectSpeed.step = "0.25";
selectSpeed.style.textAlign = "center";

play.id = "play";
play.style.display = "inline-block";
play.style.paddingLeft = "10px";
play.style.cursor = "pointer";
play.style.width = "10px";
play.src = "../img/play.png";

document.getElementById("mapid").appendChild(timelineDiv);

document.getElementById("timelineDiv").appendChild(timelineLabel);
document.getElementById("timelineDiv").appendChild(timeline);
document.getElementById("timelineDiv").appendChild(selectTime);
document.getElementById("timelineDiv").appendChild(selectSpeed);
document.getElementById("timelineDiv").appendChild(play);

// -------------------------------------- Timeline --------------------------------------

document.getElementById("play").addEventListener("click", function () {

    if ((document.getElementById("play").src).search("img/play.png") !== -1 && document.getElementById("optionTimee").selected === false) {

        document.getElementById("play").src = "../img/pause.png";

        let time = minTime;
        let timeAux = 0;

        let interval = setInterval(function () {

            document.getElementById("timeline").value = time;

            if (Math.abs(time - maxTime) < 0.1) {
                clearInterval(interval);
                document.getElementById("play").src = "../img/play.png";
            }

            document.getElementById("play").addEventListener("click", function () {

                clearInterval(interval);
            });

            document.getElementById("selectTime").addEventListener("change", function () {

                clearInterval(interval);
            });

            document.getElementById("constButton").addEventListener("click", function () {

                clearInterval(interval);
                document.getElementById("play").src = "../img/play.png";
                document.getElementById("optionTimee").selected = true;
                document.getElementById("selectSpeed").value = 1;
                document.getElementById("timeline").disabled = true;
            });

            document.getElementById("logButton").addEventListener("click", function () {

                clearInterval(interval);
                document.getElementById("play").src = "../img/play.png";
                document.getElementById("optionTimee").selected = true;
                document.getElementById("selectSpeed").value = 1;
                document.getElementById("timeline").disabled = true;
            });

            // ------------------------------- Update Circle Radius

            let latlong2 = [];

            d3.selectAll("circle")
                .attr("r", function (d) {

                    if (isNaN(d["longitude"]) === false && isNaN(d["latitude"]) === false && latlong2.includes(d["latitude"].toString() + d["longitude"].toString()) === false && d["latitude"] !== "" && d["longitude"] !== "") {

                        latlong2.push(d["latitude"].toString() + d["longitude"].toString());

                        console.log(label2number("latitude", "longitude", remade[timeAux], metaaa, markers, d["latitude"] + d["longitude"])*(document.getElementById("bubbleSize").value)/numberNonEmpty("latitude", "longitude", markers, metaaa));

                        document.getElementById("timelineLabel").innerHTML = convertTime((remade[timeAux]).toString());

                        return label2number("latitude", "longitude", remade[timeAux], metaaa, markers, d["latitude"] + d["longitude"])*(document.getElementById("bubbleSize").value)/numberNonEmpty("latitude", "longitude", markers, metaaa);

                    } else {

                        return "0";
                    }
                });
            time = time + stepTime;
            if (timeAux < remade.length - 1) timeAux = timeAux + 1;

        }, 1000/document.getElementById("selectSpeed").value - 500)

    } else if (document.getElementById("optionTimee").selected === false) {

        document.getElementById("play").src = "../img/play.png";

    }
});