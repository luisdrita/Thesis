let treeType = "circular"; // Initial shape of the phylogenetic tree.
let color = {};
let metaNumber;

// -------------------------------------- Initial Tree Properties --------------------------------------

let tree = Phylocanvas.createTree('phylocanvas', {
    /*
            metadata: {

                padding: 300

            }, */

    history: {
        parent: document.getElementById("mapid"),
        zIndex: -1000
    },

    //baseNodeSize: 2,
    padding: 5,
   // textSize: "25",
    font: "helvetica",
    zoomFactor: 2,
    labelPadding: 5,
    showLabels: true,
    //lineWidth: 1,
    alignLabels: true,
    //  highlightColour: "red",
    highlightSize: 1,
    highlightWidth: -1,
    //   showBranchLengthLabels: true
    fillCanvas: true // Fits hierarchical and rectangular trees.
});

// -------------------------------------- Metadata Dependent Operations --------------------------------------

function phylTree(metaData, data_input) {

// -------------------------------- Generating Metadata Options Coloring Nodes

    for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

        if (j === 0) {

            let optionMetadataa = document.createElement("OPTION");

            optionMetadataa.id = "optionMetadataa";
            optionMetadataa.innerHTML= "None";

            document.getElementById("selectNodeColor").appendChild(optionMetadataa);
        }

        let optionMetadata = document.createElement("OPTION");

        optionMetadata.id = "optionMetadata"+j;
        optionMetadata.innerHTML= Object.keys(metaData[Object.keys(metaData)[0]])[j];
        optionMetadata.value = Object.keys(metaData[Object.keys(metaData)[0]])[j];

        document.getElementById("selectNodeColor").appendChild(optionMetadata);
    }

// -------------------------------- Listening Changes Metadata Options Coloring Nodes

    // Listening to changes in the select element of node colors which will trigger tree update.
    document.getElementById("selectNodeColor").addEventListener("change", function () {

        for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

            if (document.getElementById("optionMetadata"+j).selected) {

                for (let i = 0; i < tree.leaves.length; i++) {

                    tree.leaves[i].setDisplay({
                        //colour: 'red',
                        //shape: 'circle', // or square, triangle, star
                        //size: 3, // ratio of the base node size
                        leafStyle: {
                            //strokeStyle: '#0000ff',
                            fillStyle: color[Object.values(metaData[tree.leaves[i].label])[j]]
                            //lineWidth: 2,
                        }
                    });
                }
            }
        }

        if (document.getElementById("optionMetadataa").selected) {

            for (let i = 0; i < tree.leaves.length; i++) {

                tree.leaves[i].setDisplay({
                    //colour: 'red',
                    //shape: 'circle', // or square, triangle, star
                    //size: 3, // ratio of the base node size
                    leafStyle: {
                        //strokeStyle: '#0000ff',
                        fillStyle: "black"
                        //lineWidth: 2,
                    }
                });
            }
        }

        tree.setNodeSize(document.getElementById("nodeSize").value);
        tree.setTextSize(document.getElementById("textSize").value);
    });

    // -------------------------------- Generating Metadata Options Bar Tree Leafs

    for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

        let metadataSwitchLabel = document.createElement("LABEL"); // Metadata label.
        let metadataSwitch = document.createElement("INPUT"); // Checkbox input.

        metadataSwitchLabel.id = "metadataSwitchLabel"+j;
        metadataSwitchLabel.className = "metadataSwitchLabel";
        metadataSwitchLabel.innerHTML = Object.keys(metaData[Object.keys(metaData)[0]])[j];
        metadataSwitchLabel.style.display = "block";
        metadataSwitchLabel.style.paddingLeft = "10px";
        metadataSwitchLabel.style.paddingRight = "10px";

        metadataSwitch.id = "metadataSwitch"+j;
        metadataSwitch.className = "metadataSwitch";
        metadataSwitch.type = "checkbox";
        metadataSwitch.style.cursor = "pointer";
        metadataSwitch.style.marginLeft = "10px";

        document.getElementById("treeMetadataDivInside").appendChild(metadataSwitchLabel);
        document.getElementById("metadataSwitchLabel"+j).appendChild(metadataSwitch);
    }

    // -------------------------------- Creating Meta ({metadata: values, ...})

    let meta = {};

    for (let i = 0; i < Object.keys(Object.values(metaData)[0]).length; i++) { // Picking metadata type.

        for (let j = 0; j < Object.keys(metaData).length; j++) { // Picking strain by name.

            meta[Object.keys(Object.values(metaData)[0])[i]] = meta[Object.keys(Object.values(metaData)[0])[i]] || {};

            if (Object.values(metaData[Object.keys(metaData)[j]])[i] === "") {

                meta[Object.keys(Object.values(metaData)[0])[i]]["No Data"] = true;

            } else {

                meta[Object.keys(Object.values(metaData)[0])[i]][Object.values(metaData[Object.keys(metaData)[j]])[i]] = true;

            }
        }
    }

    // -------------------------------- Generating Legend Dropdown

    let legendSwitchLabel = document.createElement("DIV"); // Metadata label.
    let triangle = document.createElement("IMG"); // Metadata label.
    let block = document.createElement("IMG"); // Metadata label.
    let collapse = document.createElement("IMG"); // Metadata label.

    legendSwitchLabel.id = "legendSwitchLabel" + "test";
    legendSwitchLabel.style.display = "block";
    legendSwitchLabel.style.paddingLeft = "10px";
    legendSwitchLabel.style.paddingRight = "10px";
    legendSwitchLabel.style.backgroundColor = "white";
    legendSwitchLabel.style.color = "black";
    legendSwitchLabel.style.fontSize = "14px";
    legendSwitchLabel.style.textAlign = "center";

    triangle.id = "triangle";
    triangle.style.display = "inline-block";
    triangle.style.paddingLeft = "10px";
    triangle.style.paddingRight = "10px";
    triangle.style.cursor = "pointer";
    triangle.style.width = "10px";
    triangle.src = "../img/reset.png";

    collapse.id = "collapse";
    collapse.style.display = "inline-block";
    collapse.style.paddingLeft = "10px";
    collapse.style.paddingRight = "10px";
    collapse.style.cursor = "pointer";
    collapse.style.width = "10px";
    collapse.src = "../img/triangle_down.png";

    block.id = "block";
    block.style.display = "inline-block";
    block.style.paddingLeft = "10px";
    block.style.paddingRight = "10px";
    block.style.cursor = "pointer";
    block.style.width = "10px";
    block.src = "../img/non_block.png";

    document.getElementById("treeLegendDivInside").appendChild(legendSwitchLabel);

    document.getElementById("legendSwitchLabel" + "test").appendChild(triangle);
    document.getElementById("legendSwitchLabel" + "test").appendChild(collapse);
    document.getElementById("legendSwitchLabel" + "test").appendChild(block);

        // Metadata Categories
        for (let i = 0; i < Object.keys(Object.values(metaData)[0]).length; i++) { // Picking metadata type.

            let legendSwitchLabel = document.createElement("DIV"); // Metadata label.
            let triangle = document.createElement("IMG"); // Metadata label.

            legendSwitchLabel.id = "legendSwitchLabel" + i;
            legendSwitchLabel.className = "legendSwitchLabel";
            legendSwitchLabel.innerHTML = Object.keys(metaData[Object.keys(metaData)[0]])[i];
            legendSwitchLabel.style.display = "block";
            legendSwitchLabel.style.paddingLeft = "10px";
            legendSwitchLabel.style.paddingRight = "10px";
            legendSwitchLabel.style.opacity = "1";
            legendSwitchLabel.style.backgroundColor = "white";
            legendSwitchLabel.style.color = "black";
            legendSwitchLabel.style.fontSize = "14px";
            legendSwitchLabel.style.cursor = "pointer";

            triangle.id = "triangle" + i;
            triangle.style.display = "inline-block";
            triangle.style.paddingLeft = "10px";
            triangle.style.paddingRight = "10px";
            triangle.style.opacity = "1";
            triangle.style.cursor = "pointer";
            triangle.style.width = "10px";
            triangle.src = "../img/triangle_down.png";

            document.getElementById("treeLegendDivInside").appendChild(legendSwitchLabel);
            document.getElementById("legendSwitchLabel" + i).appendChild(triangle);

            // Metadata Category Values
            for (let j = 0; j < Object.keys(meta[Object.keys(meta)[i]]).length; j++) {

                let legendSwitchLabelCollapsible = document.createElement("LABEL"); // Metadata label.
                let colorPicker = document.createElement("INPUT");

                legendSwitchLabelCollapsible.className = "legendSwitchLabelCollapsible"+i;
                legendSwitchLabelCollapsible.id = "legendSwitchLabelCollapsible"+i+"-"+j;
                legendSwitchLabelCollapsible.innerHTML = Object.keys(meta[Object.keys(meta)[i]])[j];
                legendSwitchLabelCollapsible.style.display = "none";
                legendSwitchLabelCollapsible.style.paddingLeft = "10px";
                legendSwitchLabelCollapsible.style.paddingRight = "10px";
                legendSwitchLabelCollapsible.style.opacity = "1";
                legendSwitchLabelCollapsible.style.backgroundColor = "#" + intToRGB(hashCode(Object.keys(meta[Object.keys(meta)[i]])[j] + Object.keys(meta[Object.keys(meta)[i]])[j]));
                legendSwitchLabelCollapsible.style.color = "white";

                colorPicker.className = "colorPicker";
                colorPicker.id = "colorPicker"+i+"-"+j;
                colorPicker.type = "color";
                colorPicker.value = "#" + intToRGB(hashCode(Object.keys(meta[Object.keys(meta)[i]])[j] + Object.keys(meta[Object.keys(meta)[i]])[j]));
                colorPicker.style.display = "inline-block";
                colorPicker.style.textAlign = "center";
                colorPicker.style.width = "30px";
                colorPicker.style.height = "15px";
                colorPicker.style.color = "white";
                colorPicker.style.border = "solid";
                colorPicker.style.borderWidth = "1px";
                colorPicker.style.borderRadius = "10px";
                colorPicker.style.borderColor = "transparent";
                colorPicker.style.backgroundColor = "black";
                colorPicker.style.marginLeft = "10px";
                colorPicker.style.cursor = "pointer";

                document.getElementById("treeLegendDivInside").appendChild(legendSwitchLabelCollapsible); //legendDiv
                document.getElementById("legendSwitchLabelCollapsible"+i+"-"+j).appendChild(colorPicker);

            }
        }

    // -------------------------------- Generating Initial Color Set

    for (let i = 0; i < Object.keys(Object.values(metaData)[0]).length; i++) {

        for (let j = 0; j < Object.keys(meta[Object.keys(meta)[i]]).length; j++) {

            document.getElementById("colorPicker"+i+"-"+j).addEventListener("click", function () {

                document.getElementById("treeLegendDivInside").style.display = "block";

                document.getElementById("treeLegendDivInside").addEventListener("mouseout", function () {

                    treeLegendDivInside.style.display = "block";

                });

            })
        }
    }

    // -------------------------------- Listening Color Input

    for (let i = 0; i < Object.keys(Object.values(metaData)[0]).length; i++) {

        for (let j = 0; j < Object.keys(meta[Object.keys(meta)[i]]).length; j++) {

            document.getElementById("colorPicker"+i+"-"+j).addEventListener("change", function () {

                document.getElementById("legendSwitchLabelCollapsible"+i+"-"+j).style.backgroundColor = document.getElementById("colorPicker"+i+"-"+j).value;

                for (let ij = 0; ij < tree.leaves.length; ij++) { // Iterates along all the strains.

                if (Object.values(metaData[tree.leaves[ij].label])[i] === document.getElementById("legendSwitchLabelCollapsible" + i + "-" + j).innerText) {

                    color[Object.values(metaData[tree.leaves[ij].label])[i]] = document.getElementById("colorPicker" + i + "-" + j).value;

                }

                if (document.getElementById("selectNodeColor").value === document.getElementById("optionMetadata" + i).innerText) {

                    tree.leaves[ij].setDisplay({

                        leafStyle: {
                            fillStyle: color[Object.values(metaData[tree.leaves[ij].label])[i]] // 2nd option input color value
                        }
                    });

                }

                    metaNumber = i;

                    if (document.getElementById("metadataSwitch"+i).checked === true) {

                        (tree.leaves[ij].data)[Object.keys(metaData[tree.leaves[ij].label])[i]] = (tree.leaves[ij].data)[Object.keys(metaData[tree.leaves[ij].label])[i]] || {};

                        (tree.leaves[ij].data)[Object.keys(metaData[tree.leaves[ij].label])[i]]["colour"] = color[Object.values(metaData[tree.leaves[ij].label])[i]];

                        if (document.getElementById("metadataSwitchDisplay").checked === true) {

                            (tree.leaves[ij].data)[Object.keys(metaData[tree.leaves[ij].label])[i]]["label"] = Object.values(metaData[tree.leaves[ij].label])[i] || "No Data";

                        } else {

                            (tree.leaves[ij].data)[Object.keys(metaData[tree.leaves[ij].label])[i]]["label"] = "";

                        }
                    }
                }

                    //document.getElementById("selectNodeColor").value = document.getElementById("optionMetadata" + i).innerText;

                    tree.setNodeSize(document.getElementById("nodeSize").value);
                    tree.setTextSize(document.getElementById("textSize").value);

                document.getElementById("treeLegendDivInside").addEventListener("mouseout", function () {

                    treeLegendDivInside.style.display = "none";
                });

                document.getElementById("triangle").style.transform = "rotate(0deg)";

            })
            }
    }

    // -------------------------------- Listening Color Reset

            document.getElementById("triangle").addEventListener("click", function () {

                    for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

                        for (let i = 0; i < Object.keys(metaData).length; i++) {

                            color[Object.values(metaData[tree.leaves[i].label])[j]] = "#" + intToRGB(hashCode(Object.values(metaData[tree.leaves[i].label])[j] + Object.values(metaData[tree.leaves[i].label])[j]));
                        }

                        if (document.getElementById("metadataSwitch"+j).checked === true) {

                            for (let ii = 0; ii < tree.leaves.length; ii++) {

                                (tree.leaves[ii].data)[Object.keys(metaData[tree.leaves[ii].label])[j]] = (tree.leaves[ii].data)[Object.keys(metaData[tree.leaves[ii].label])[j]] || {};

                                (tree.leaves[ii].data)[Object.keys(metaData[tree.leaves[ii].label])[j]]["colour"] = color[Object.values(metaData[tree.leaves[ii].label])[j]];

                                if (document.getElementById("metadataSwitchDisplay").checked === true) {

                                    (tree.leaves[ii].data)[Object.keys(metaData[tree.leaves[ii].label])[j]]["label"] = Object.values(metaData[tree.leaves[ii].label])[j] || "No Data";

                                } else {

                                    (tree.leaves[ii].data)[Object.keys(metaData[tree.leaves[ii].label])[j]]["label"] = "";

                                }
                            }
                        }

                        document.getElementById("triangle").style.transform = "rotate(-30deg)";

                        // Metadata Category Values
                        for (let jj = 0; jj < Object.keys(meta[Object.keys(meta)[j]]).length; jj++) {

                            document.getElementById("legendSwitchLabelCollapsible"+j+"-"+jj).style.backgroundColor = "#" + intToRGB(hashCode(Object.keys(meta[Object.keys(meta)[j]])[jj] + Object.keys(meta[Object.keys(meta)[j]])[jj]));
                            document.getElementById("colorPicker"+j+"-"+jj).value = "#" + intToRGB(hashCode(Object.keys(meta[Object.keys(meta)[j]])[jj] + Object.keys(meta[Object.keys(meta)[j]])[jj]));

                        }
                    }

                for (let ij = 0; ij < tree.leaves.length; ij++) { // Iterates along all the strains.

                    tree.leaves[ij].setDisplay({

                        leafStyle: {
                            fillStyle: color[Object.values(metaData[tree.leaves[ij].label])[metaNumber]] // 2nd option input color value
                        }
                    });
                }
            });

    // -------------------------------- Listening Style Reset

    document.getElementById("resetStyleButton").addEventListener("click", function () {

        document.getElementById("nodeSize").value = "10";
        document.getElementById("textSize").value = "4";
        document.getElementById("lineWidth").value = "20";

        document.getElementById("nodeSizeLabel").innerHTML = "Node Size: " + "10" + "px";
        document.getElementById("textSizeLabel").innerHTML = "Label Size: " + "4" + "px";
        document.getElementById("lineWidthLabel").innerHTML = "Line Width: " + "1" + "px";

        tree.lineWidth = "1";
        tree.setNodeSize("10"); // Setting the node size accordingly to the value of the respective range element.
        tree.setTextSize("4"); // Setting labels' font size.

        document.getElementById("resetStyleButton").style.transform = "rotate(-30deg)";
        document.getElementById("optionMetadataa").selected = true;

        for (let i = 0; i < tree.leaves.length; i++) {

            tree.leaves[i].setDisplay({
                //colour: 'red',
                //shape: 'circle', // or square, triangle, star
                //size: 3, // ratio of the base node size
                leafStyle: {
                    //strokeStyle: '#0000ff',
                    fillStyle: "black"
                    //lineWidth: 2,
                }
            });
        }
    });

    // -------------------------------- Listening Collapse All

    document.getElementById("collapse").addEventListener("click", function () {

        for (let i = 0; i < document.getElementsByClassName("legendSwitchLabel").length; i++) {

                for (let ii = 0; ii < document.getElementsByClassName("legendSwitchLabelCollapsible" + i).length; ii++) {

                    if (document.getElementById("collapse").src.search("img/triangle_down") !== -1) {

                        document.getElementsByClassName("legendSwitchLabelCollapsible" + i)[ii].style.display = "block";
                        document.getElementById("triangle" + i).src = "../img/triangle_up.png";

                        if (i === document.getElementsByClassName("legendSwitchLabel").length - 1 && ii === document.getElementsByClassName("legendSwitchLabelCollapsible" + i).length - 1) {
                            document.getElementById("collapse").src = "../img/triangle_up.png";

                        }

                    } else {

                        document.getElementsByClassName("legendSwitchLabelCollapsible" + i)[ii].style.display = "none";
                        document.getElementById("triangle" + i).src = "../img/triangle_down.png";

                        if (i === document.getElementsByClassName("legendSwitchLabel").length - 1 && ii === document.getElementsByClassName("legendSwitchLabelCollapsible" + i).length - 1) {
                            document.getElementById("collapse").src = "../img/triangle_down.png";
                        }
                    }
                }
        }
    });

    // -------------------------------- Listening Legend Div Block

    document.getElementById("block").addEventListener("click", function () {

        if (document.getElementById("block").src.search("/img/block.png") !== -1) {

            document.getElementById("block").src = "../img/non_block.png";

            document.getElementById("treeLegendDivInside").addEventListener("mouseout", function () {

                treeLegendDivInside.style.display = "none";
            });

        } else {

            document.getElementById("block").src = "../img/block.png";
            document.getElementById("treeLegendDivInside").addEventListener("mouseout", function () {

                treeLegendDivInside.style.display = "block";
            });

        }
    });

    // -------------------------------- Listening Style Div Block

    document.getElementById("blockStyleButton").addEventListener("click", function () {

        if (document.getElementById("blockStyleButton").src.search("/img/block.png") !== -1) {

            document.getElementById("blockStyleButton").src = "../img/non_block.png";

            document.getElementById("treeStyleDivInside").addEventListener("mouseout", function () {

                treeStyleDivInside.style.display = "none";
            });

        } else {

            document.getElementById("blockStyleButton").src = "../img/block.png";
            document.getElementById("treeStyleDivInside").addEventListener("mouseout", function () {

                treeStyleDivInside.style.display = "block";
            });

        }
    });

    // -------------------------------- Listening Clicks Expand Legend

    let aux = 0;

    for (let i = 0; i < document.getElementsByClassName("legendSwitchLabel").length; i++) {

        document.getElementById("legendSwitchLabel"+i).addEventListener("click", function () {

            for (let ii = 0; ii < document.getElementsByClassName("legendSwitchLabelCollapsible" + i).length; ii++) {

                if (document.getElementsByClassName("legendSwitchLabelCollapsible" + i)[ii].style.display === "block") {

                    document.getElementsByClassName("legendSwitchLabelCollapsible" + i)[ii].style.display = "none";
                    document.getElementById("triangle" + i).src = "../img/triangle_down.png";
                    aux--;

                } else {

                    document.getElementsByClassName("legendSwitchLabelCollapsible" + i)[ii].style.display = "block";
                    document.getElementById("triangle" + i).src = "../img/triangle_up.png";
                    document.getElementById("collapse").src = "../img/triangle_up.png";
                    aux++;
                }
            }
            if(aux === 0) document.getElementById("collapse").src = "../img/triangle_down.png";
        });
    }

    // -------------------------------- Direct Commands

    document.getElementById("phylocanvas").style.overflow = "hidden";
    document.getElementById("treeButton").src = "../img/" + treeType + ".png"; // Initializing the right tree button accordingly to the shape of the tree.

    tree.load(data_input);

    tree.setTreeType(treeType); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.
    tree.setNodeSize(document.getElementById("nodeSize").value); // Setting the node size accordingly to the value of the respective range element.
    tree.setTextSize(document.getElementById("textSize").value); // Setting labels' font size.

    radioDetect(metaData, Object.keys(Object.values(metaData)[0]).length); // Show/hide individual metadata bars.
    selectAlll(metaData, Object.keys(Object.values(metaData)[0]).length); // Show all metadata bars when respective button is clicked.
    displayLabel(metaData, Object.keys(Object.values(metaData)[0]).length); // Show all metadata labels when respective button is clicked.

}

// -------------------------------------- Auxiliary Function Metadata Switch --------------------------------------

function radioDetect (metaData, max) {

    // -------------------------------- Generating Initial Color Set

        for (let j = 0; j < Object.keys(Object.values(metaData)[0]).length; j++) {

            for (let i = 0; i < Object.keys(metaData).length; i++) {

                if (Object.values(metaData[tree.leaves[i].label])[j] + Object.values(metaData[tree.leaves[i].label])[j] === "") {

                    color[Object.values(metaData[tree.leaves[i].label])[j]] = "#" + intToRGB(hashCode("No Data"));

                } else {

                    color[Object.values(metaData[tree.leaves[i].label])[j]] = "#" + intToRGB(hashCode(Object.values(metaData[tree.leaves[i].label])[j] + Object.values(metaData[tree.leaves[i].label])[j]));

                }

            }
        }

    // -------------------------------- Listening Changes Metadata Checkboxes

    for (let j = 0; j < max; j++) {

        document.getElementById("metadataSwitch"+j).addEventListener("change", function () {

            if (document.getElementById("metadataSwitch"+j).checked === true) {

                for (let i = 0; i < tree.leaves.length; i++) {

                    (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] = (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] || {};

                    (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["colour"] = color[Object.values(metaData[tree.leaves[i].label])[j]];

                    if (document.getElementById("metadataSwitchDisplay").checked === true) {

                        (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = Object.values(metaData[tree.leaves[i].label])[j] || "No Data";

                    } else {

                        (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = "";

                    }
                }

            } else {

                for (let i = 0; i < tree.leaves.length; i++) {

                    delete (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]];

                }
            }

            tree.setTreeType(treeType); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.
            tree.setNodeSize(document.getElementById("nodeSize").value);
            tree.setTextSize(document.getElementById("textSize").value);
        });
    }
}

// -------------------------------------- Toggle Gear --------------------------------------

let treeToggleGear = document.createElement("IMG");

treeToggleGear.id = "toggle";
treeToggleGear.style.position = "absolute";
treeToggleGear.style.right = "10px";
treeToggleGear.style.top = "10px";
treeToggleGear.onclick = toggle;
treeToggleGear.style.zIndex = "1";
treeToggleGear.src = "../img/pixelmator/gear_black.png";
treeToggleGear.style.width = "25px";
treeToggleGear.style.cursor = "pointer";

document.getElementById("phylocanvas").appendChild(treeToggleGear);

// -------------------------------------- Tree --------------------------------------

let treeDiv = document.createElement("DIV");
let treeButton = document.createElement("IMG");
let treeDivInside = document.createElement("DIV");

let treeType1 = document.createElement("IMG");
let treeType2 = document.createElement("IMG");
let treeType3 = document.createElement("IMG");
let treeType4 = document.createElement("IMG");
let treeType5 = document.createElement("IMG");

treeDiv.id = "treeDiv";
treeDiv.classList.add("toggle");
treeDiv.style.position = "absolute";
treeDiv.style.zIndex = "2000";
treeDiv.style.right = "10px";
treeDiv.style.bottom = "10px";
treeDiv.style.display = "none";

treeButton.id = "treeButton";
treeButton.src = "../img/circular.png";
treeButton.style.width = "30px";
treeButton.style.cursor = "pointer";

treeDivInside.id = "treeDivInside";
treeDivInside.class = "dropdown-content";
treeDivInside.style.display = "none";
treeDivInside.style.position = "absolute";
treeDivInside.style.bottom = "30px";
treeDivInside.style.right = "0px";
treeDivInside.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
treeDivInside.style.backgroundColor = "black";
treeDivInside.style.borderRadius = "10px";

treeType1.id = "radial";
treeType1.style.cursor = "pointer";
treeType1.style.display = "block";
treeType1.style.padding = "5px 10px";
treeType1.src = "../img/radial.png";
treeType1.style.width = "30px";

treeType2.id = "rectangular";
treeType2.style.cursor = "pointer";
treeType2.style.display = "block";
treeType2.style.padding = "5px 10px";
treeType2.src = "../img/rectangular.png";
treeType2.style.width = "30px";

treeType3.id = "circular";
treeType3.style.cursor = "pointer";
treeType3.style.display = "block";
treeType3.style.padding = "5px 10px";
treeType3.src = "../img/circular.png";
treeType3.style.width = "30px";

treeType4.id = "diagonal";
treeType4.style.cursor = "pointer";
treeType4.style.display = "block";
treeType4.style.padding = "5px 10px";
treeType4.src = "../img/diagonal.png";
treeType4.style.width = "30px";

treeType5.id = "hierarchical";
treeType5.style.cursor = "pointer";
treeType5.style.display = "block";
treeType5.style.padding = "5px 10px";
treeType5.style.paddingBottom = "10px";
treeType5.src = "../img/hierarchical.png";
treeType5.style.width = "30px";

document.getElementById("phylocanvas").appendChild(treeDiv);

document.getElementById("treeDiv").appendChild(treeButton);
document.getElementById("treeDiv").appendChild(treeDivInside);

document.getElementById("treeDivInside").appendChild(treeType1);
document.getElementById("treeDivInside").appendChild(treeType2);
document.getElementById("treeDivInside").appendChild(treeType3);
document.getElementById("treeDivInside").appendChild(treeType4);
document.getElementById("treeDivInside").appendChild(treeType5);

// -------------------------------------- Style --------------------------------------

let treeStyleDiv = document.createElement("DIV");
let treeStyleButton = document.createElement("BUTTON");
let treeStyleDivInside = document.createElement("DIV");

let propertiesStyleDiv = document.createElement("LABEL"); // Metadata label.
let resetStyleButton = document.createElement("IMG"); // Metadata label.
let blockStyleButton = document.createElement("IMG"); // Metadata label.

let nodeSizeLabel = document.createElement("P");
let nodeSize = document.createElement("INPUT");

let textSizeLabel = document.createElement("P");
let textSize = document.createElement("INPUT");

let lineWidthLabel = document.createElement("P");
let lineWidth = document.createElement("INPUT");

let selectNodeColorLabel = document.createElement("P");
let selectNodeColor = document.createElement("SELECT");

treeStyleDiv.id = "treeStyleDiv";
treeStyleDiv.classList.add("toggle");
treeStyleDiv.style.position = "absolute";
treeStyleDiv.style.top = "10px";
treeStyleDiv.style.left = "170px";
treeStyleDiv.style.zIndex = "2000";
treeStyleDiv.style.display = "none";

treeStyleButton.id = "treeStyleButton";
treeStyleButton.innerHTML = "Style";
treeStyleButton.style.width = "50px";
treeStyleButton.style.height = "25px";
treeStyleButton.style.cursor = "pointer";
treeStyleButton.style.backgroundColor = "black";
treeStyleButton.style.borderColor = "white";
treeStyleButton.style.color = "white";
treeStyleButton.style.borderRadius = "10px";

treeStyleDivInside.id = "treeStyleDivInside";
treeStyleDivInside.class = "dropdown-content";
treeStyleDivInside.style.display = "none";
treeStyleDivInside.style.position = "absolute";
treeStyleDivInside.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
treeStyleDivInside.style.fontSize = "12px";
treeStyleDivInside.style.height = "200px";
treeStyleDivInside.style.overflow = "auto";
treeStyleDivInside.style.whiteSpace = "nowrap";
treeStyleDivInside.style.borderRadius = "10px";
treeStyleDivInside.style.backgroundColor = "black";
treeStyleDivInside.style.color = "white";
treeStyleDivInside.style.width = "150px";

propertiesStyleDiv.id = "propertiesStyleDiv";
propertiesStyleDiv.style.display = "block";
propertiesStyleDiv.style.paddingLeft = "10px";
propertiesStyleDiv.style.paddingRight = "10px";
propertiesStyleDiv.style.backgroundColor = "white";
propertiesStyleDiv.style.color = "black";
propertiesStyleDiv.style.textAlign = "center";

resetStyleButton.id = "resetStyleButton";
resetStyleButton.style.display = "inline-block";
resetStyleButton.style.paddingLeft = "15px";
resetStyleButton.style.paddingRight = "15px";
resetStyleButton.style.cursor = "pointer";
resetStyleButton.style.width = "10px";
resetStyleButton.src = "../img/reset.png";

blockStyleButton.id = "blockStyleButton";
blockStyleButton.style.display = "inline-block";
blockStyleButton.style.paddingLeft = "15px";
blockStyleButton.style.paddingRight = "15px";
blockStyleButton.style.cursor = "pointer";
blockStyleButton.style.width = "10px";
blockStyleButton.src = "../img/non_block.png";

nodeSizeLabel.id = "nodeSizeLabel";
nodeSizeLabel.innerHTML = "Node Size: 10px";
nodeSizeLabel.style.textAlign = "center";
nodeSizeLabel.style.color = "white";
nodeSizeLabel.style.lineHeight = "5px";

nodeSize.id = "nodeSize";
nodeSize.type = "range";
nodeSize.value = "10";
nodeSize.style.cursor = "pointer";
nodeSize.style.width = "130px";
nodeSize.style.margin = "auto";
nodeSize.style.display = "block";

textSizeLabel.id = "textSizeLabel";
textSizeLabel.innerHTML = "Label Size: 4px";
textSizeLabel.style.textAlign = "center";
textSizeLabel.style.color = "white";
textSizeLabel.style.lineHeight = "5px";

textSize.id = "textSize";
textSize.type = "range";
textSize.value = "4";
textSize.style.cursor = "pointer";
textSize.style.width = "130px";
textSize.style.display = "block";
textSize.style.margin = "auto";

lineWidthLabel.id = "lineWidthLabel";
lineWidthLabel.innerHTML = "Line Width: 1px";
lineWidthLabel.style.textAlign = "center";
lineWidthLabel.style.color = "white";
lineWidthLabel.style.lineHeight = "5px";

lineWidth.id = "lineWidth";
lineWidth.type = "range";
lineWidth.value = "20";
lineWidth.style.zIndex = "2";
lineWidth.style.cursor = "pointer";
lineWidth.style.width = "130px";
lineWidth.style.display = "block";
lineWidth.style.margin = "auto";

selectNodeColorLabel.id = "selectNodeColorLabel";
selectNodeColorLabel.innerHTML = "Color";
selectNodeColorLabel.style.textAlign = "center";
selectNodeColorLabel.style.color = "white";
selectNodeColorLabel.style.lineHeight = "5px";

selectNodeColor.id = "selectNodeColor";
selectNodeColor.style.display = "block";
selectNodeColor.style.width = "130px";
selectNodeColor.style.margin = "auto";
selectNodeColor.style.marginBottom = "10px";

document.getElementById("phylocanvas").appendChild(treeStyleDiv);

document.getElementById("treeStyleDiv").appendChild(treeStyleButton);
document.getElementById("treeStyleDiv").appendChild(treeStyleDivInside);

document.getElementById("treeStyleDivInside").appendChild(propertiesStyleDiv);

document.getElementById("propertiesStyleDiv").appendChild(resetStyleButton);
document.getElementById("propertiesStyleDiv").appendChild(blockStyleButton);

document.getElementById("treeStyleDivInside").appendChild(nodeSizeLabel);
document.getElementById("treeStyleDivInside").appendChild(nodeSize);

document.getElementById("treeStyleDivInside").appendChild(textSizeLabel);
document.getElementById("treeStyleDivInside").appendChild(textSize);

document.getElementById("treeStyleDivInside").appendChild(lineWidthLabel);
document.getElementById("treeStyleDivInside").appendChild(lineWidth);

document.getElementById("treeStyleDivInside").appendChild(selectNodeColorLabel);
document.getElementById("treeStyleDivInside").appendChild(selectNodeColor);

// -------------------------------------- Metadata --------------------------------------

let treeMetadataDiv = document.createElement("DIV");
let treeMetadataButton = document.createElement("BUTTON");
let treeMetadataDivInside = document.createElement("DIV");

let metadataSwitchLabel = document.createElement("LABEL");
let metadataSwitch = document.createElement("INPUT");

let metadataSwitchLabelDisplay = document.createElement("LABEL");
let metadataSwitchDisplay = document.createElement("INPUT");

treeMetadataDiv.id = "treeMetadataDiv";
treeMetadataDiv.classList.add("toggle");
treeMetadataDiv.style.position = "absolute";
treeMetadataDiv.style.left = "90px";
treeMetadataDiv.style.top = "10px";
treeMetadataDiv.style.zIndex = "2000";
treeMetadataDiv.style.display = "none";

treeMetadataButton.id = "treeMetadataButton";
treeMetadataButton.innerHTML = "Metadata";
treeMetadataButton.style.width = "75px";
treeMetadataButton.style.height = "25px";
treeMetadataButton.style.cursor = "pointer";
treeMetadataButton.style.backgroundColor = "black";
treeMetadataButton.style.borderColor = "white";
treeMetadataButton.style.color = "white";
treeMetadataButton.style.borderRadius = "10px";

treeMetadataDivInside.id = "treeMetadataDivInside";
treeMetadataDivInside.class = "dropdown-content";
treeMetadataDivInside.style.display = "none";
treeMetadataDivInside.style.position = "absolute";
treeMetadataDivInside.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
treeMetadataDivInside.style.fontSize = "12px";
treeMetadataDivInside.style.height = "200px";
treeMetadataDivInside.style.overflow = "auto";
treeMetadataDivInside.style.whiteSpace = "nowrap";
treeMetadataDivInside.style.borderRadius = "10px";
treeMetadataDivInside.style.backgroundColor = "black";
treeMetadataDivInside.style.color = "white";
treeMetadataDivInside.style.width = "150px";

metadataSwitchLabel.id = "metadataSwitchLabel";
metadataSwitchLabel.innerHTML = "Select All";
metadataSwitchLabel.style.display = "block";
metadataSwitchLabel.style.paddingLeft = "10px";
metadataSwitchLabel.style.paddingRight = "10px";
metadataSwitchLabel.style.backgroundColor = "white";
metadataSwitchLabel.style.color = "black";

metadataSwitch.id = "metadataSwitch";
metadataSwitch.type = "checkbox";
metadataSwitch.style.cursor = "pointer";
metadataSwitch.style.marginLeft = "10px";

metadataSwitchLabelDisplay.id = "metadataSwitchLabelDisplay";
metadataSwitchLabelDisplay.innerHTML = "Metadata Labels";
metadataSwitchLabelDisplay.style.display = "block";
metadataSwitchLabelDisplay.style.paddingLeft = "10px";
metadataSwitchLabelDisplay.style.paddingRight = "10px";
metadataSwitchLabelDisplay.style.backgroundColor = "white";
metadataSwitchLabelDisplay.style.color = "black";

metadataSwitchDisplay.id = "metadataSwitchDisplay";
metadataSwitchDisplay.type = "checkbox";
metadataSwitchDisplay.style.cursor = "pointer";
metadataSwitchDisplay.style.marginLeft = "10px";

document.getElementById("phylocanvas").appendChild(treeMetadataDiv);

document.getElementById("treeMetadataDiv").appendChild(treeMetadataButton);
document.getElementById("treeMetadataDiv").appendChild(treeMetadataDivInside);

document.getElementById("treeMetadataDivInside").appendChild(metadataSwitchLabelDisplay);
document.getElementById("metadataSwitchLabelDisplay").appendChild(metadataSwitchDisplay);

document.getElementById("treeMetadataDivInside").appendChild(metadataSwitchLabel);
document.getElementById("metadataSwitchLabel").appendChild(metadataSwitch);

// -------------------------------------- Legend --------------------------------------

let treeLegendDiv = document.createElement("DIV");
let treeLegendButton = document.createElement("BUTTON");
let treeLegendDivInside = document.createElement("DIV");

treeLegendDiv.id = "treeLegendDiv";
treeLegendDiv.classList.add("toggle");
treeLegendDiv.style.position = "absolute";
treeLegendDiv.style.left = "10px";
treeLegendDiv.style.top = "10px";
treeLegendDiv.style.zIndex = "2000";
treeLegendDiv.style.display = "none";

treeLegendButton.id = "treeLegendButton";
treeLegendButton.innerHTML = "Legend";
treeLegendButton.style.width = "75px";
treeLegendButton.style.height = "25px";
treeLegendButton.style.cursor = "pointer";
treeLegendButton.style.backgroundColor = "black";
treeLegendButton.style.borderColor = "white";
treeLegendButton.style.color = "white";
treeLegendButton.style.borderRadius = "10px";

treeLegendDivInside.id = "treeLegendDivInside";
treeLegendDivInside.class = "dropdown-content";
treeLegendDivInside.style.display = "none";
treeLegendDivInside.style.position = "absolute";
treeLegendDivInside.style.boxShadow = "0 8px 16px 0 rgba(0,0,0,0.9)";
treeLegendDivInside.style.fontSize = "12px";
treeLegendDivInside.style.height = "200px";
treeLegendDivInside.style.overflow = "auto";
treeLegendDivInside.style.whiteSpace = "nowrap";
treeLegendDivInside.style.borderRadius = "10px";
treeLegendDivInside.style.backgroundColor = "black";
treeLegendDivInside.style.color = "white";
treeLegendDivInside.style.width = "150px";
treeLegendDivInside.style.resize = "vertical";

document.getElementById("phylocanvas").appendChild(treeLegendDiv);

document.getElementById("treeLegendDiv").appendChild(treeLegendButton);
document.getElementById("treeLegendDiv").appendChild(treeLegendDivInside);

// -------------------------------------- Toggle Wheel --------------------------------------

function toggle() {

    let x = document.getElementsByClassName("toggle");

    for (let i = 0; i < x.length; i++) {
        if (x[i].style.display === "none") {
            x[i].style.display = "block";
            document.getElementById("treeButton").style.display = "block";
            document.getElementById("toggle").style.transform = "rotate(-15deg)";
        } else {
            x[i].style.display = "none";
            document.getElementById("treeButton").style.display = "none";
            document.getElementById("toggle").style.transform = "rotate(15deg)";
        }
    }
}

// -------------------------------------- Tree Picker --------------------------------------

let shapes = ["radial", "rectangular", "diagonal", "hierarchical", "circular"];

for (let i = 0; i < shapes.length; i++) {

    document.getElementById(shapes[i]).addEventListener("click", function () {

        document.getElementById("treeButton").src = "../img/" + shapes[i] + ".png";

        tree.setTreeType(shapes[i]); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.
        tree.setNodeSize(document.getElementById("nodeSize").value); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.
        //tree.draw();

        treeType = shapes[i];
    });
}

// -------------------------------------- Mouse Input Dynamics --------------------------------------

// -------------------------------- Node Size

document.getElementById("nodeSize").addEventListener("input", function () {

    tree.setNodeSize(document.getElementById("nodeSize").value);
    document.getElementById("nodeSizeLabel").innerHTML = "Node Size: " + document.getElementById("nodeSize").value + "px";
    document.getElementById("resetStyleButton").style.transform = "rotate(0deg)";

});

// -------------------------------- Text Size

document.getElementById("textSize").addEventListener("input", function () {

    tree.setTextSize(document.getElementById("textSize").value);
    document.getElementById("textSizeLabel").innerHTML = "Text Size: " + document.getElementById("textSize").value + "px";
    document.getElementById("resetStyleButton").style.transform = "rotate(0deg)";
});

// -------------------------------- Line Width

document.getElementById("lineWidth").addEventListener("input", function () {

    tree.lineWidth = document.getElementById("lineWidth").value/20;

    tree.setNodeSize(document.getElementById("nodeSize").value);
    tree.setTextSize(document.getElementById("textSize").value);

    document.getElementById("lineWidthLabel").innerHTML = "Line Width: " + document.getElementById("lineWidth").value/20 + "px";
    document.getElementById("resetStyleButton").style.transform = "rotate(0deg)";
});

// -------------------------------------- Mouse Over Dynamics --------------------------------------

// -------------------------------- Mouse Over

document.getElementById("treeDivInside").addEventListener("mouseover", function () {

    treeDivInside.style.display = "block";
});

document.getElementById("treeButton").addEventListener("mouseover", function () {

    treeDivInside.style.display = "block";
});

document.getElementById("treeStyleDivInside").addEventListener("mouseover", function () {

    treeStyleDivInside.style.display = "block";
});

document.getElementById("treeStyleButton").addEventListener("mouseover", function () {

    treeStyleDivInside.style.display = "block";
});

document.getElementById("treeMetadataDivInside").addEventListener("mouseover", function () {

    treeMetadataDivInside.style.display = "block";
});

document.getElementById("treeMetadataButton").addEventListener("mouseover", function () {

    treeMetadataDivInside.style.display = "block";
});

document.getElementById("treeLegendDivInside").addEventListener("mouseover", function () {

    treeLegendDivInside.style.display = "block";
});

document.getElementById("treeLegendButton").addEventListener("mouseover", function () {

    treeLegendDivInside.style.display = "block";
});

// -------------------------------- Mouse Out

document.getElementById("treeDivInside").addEventListener("mouseout", function () {

    treeDivInside.style.display = "none";
});

document.getElementById("treeButton").addEventListener("mouseout", function () {

    treeDivInside.style.display = "none";
});

document.getElementById("treeStyleDivInside").addEventListener("mouseout", function () {

    treeStyleDivInside.style.display = "none";
});

document.getElementById("treeStyleButton").addEventListener("mouseout", function () {

    if (document.getElementById("blockStyleButton").src.search("/img/non_block.png") !== -1) {

        treeStyleDivInside.style.display = "none";
    }
});

document.getElementById("treeMetadataDivInside").addEventListener("mouseout", function () {

    treeMetadataDivInside.style.display = "none";
});

document.getElementById("treeMetadataButton").addEventListener("mouseout", function () {

    treeMetadataDivInside.style.display = "none";
});

document.getElementById("treeLegendDivInside").addEventListener("mouseout", function () {

        treeLegendDivInside.style.display = "none";
});

document.getElementById("treeLegendButton").addEventListener("mouseout", function () {

    if (document.getElementById("block").src.search("/img/non_block.png") !== -1) {

        treeLegendDivInside.style.display = "none";
    }
});

// -------------------------------------- Select All Button --------------------------------------

function selectAlll (metaData, max) {

    document.getElementById("metadataSwitch").addEventListener("change", function () {

        if (document.getElementById("metadataSwitch").checked === true) {

            for (let i = 0; i < document.getElementsByClassName("metadataSwitch").length; i++) {

                document.getElementsByClassName("metadataSwitch")[i].checked = true;

            }

            for (let j = 0; j < max; j++) {

                        for (let i = 0; i < tree.leaves.length; i++) {

                            (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] = (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] || {};

                            (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["colour"] = color[Object.values(metaData[tree.leaves[i].label])[j]];

                            if (document.getElementById("metadataSwitchDisplay").checked === true) {

                                (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = Object.values(metaData[tree.leaves[i].label])[j] || "No Data";

                            } else {

                                (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = "";

                            }
                        }

                tree.setTreeType(treeType); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.
                tree.setNodeSize(document.getElementById("nodeSize").value);
                tree.setTextSize(document.getElementById("textSize").value);
            }

        } else {

            for (let i = 0; i < document.getElementsByClassName("metadataSwitch").length; i++) {

                document.getElementsByClassName("metadataSwitch")[i].checked = false;

            }

                for (let i = 0; i < tree.leaves.length; i++) {

                    tree.leaves[i].data = {
                    };

                }

            tree.setTreeType(treeType); // Choosing type of tree: takes radial, rectangular, circular, diagonal and hierarchy.
            tree.setNodeSize(document.getElementById("nodeSize").value);
            tree.setTextSize(document.getElementById("textSize").value);

        }
    });
}

// -------------------------------------- Metadata Labels Button --------------------------------------

function displayLabel (metaData, max) {

    document.getElementById("metadataSwitchDisplay").addEventListener("change", function () {

    let metaLabels = [];

    for (let i = 0; i < document.getElementsByClassName("metadataSwitch").length; i++) {

        if (document.getElementsByClassName("metadataSwitch")[i].checked === true) {

            metaLabels.push(document.getElementsByClassName("metadataSwitchLabel")[i].innerText);

        }
    }

    for (let j = 0; j < max; j++) {

                for (let i = 0; i < tree.leaves.length; i++) {

                    if (metaLabels.find(function(element) {
                        return (element === Object.keys(metaData[tree.leaves[i].label])[j]);
                    }) !== undefined) {

                        (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] = (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]] || {};

                        (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["colour"] = color[Object.values(metaData[tree.leaves[i].label])[j]];

                        if (document.getElementById("metadataSwitchDisplay").checked === true) {

                            (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = Object.values(metaData[tree.leaves[i].label])[j] || "No Data";

                        } else {

                            (tree.leaves[i].data)[Object.keys(metaData[tree.leaves[i].label])[j]]["label"] = "";

                        }
                    }
                }

        tree.setNodeSize(document.getElementById("nodeSize").value);
        tree.setTextSize(document.getElementById("textSize").value);
    }
    })
}