# MSc Thesis 
##### https://mscthesis.herokuapp.com/

## Community Finding (CF) in Phylogenetic Trees using PHYLOViZ Online

The aim of the thesis was to develop an improved version of [PHYLOViZ](http://www.phyloviz.net/) Online by
implementing CF algorithms, as well as, adding new tools for
data visualization. Similar algorithms are being used in other domains. In
phylogenetics, it is a step forward for handling infectious diseases.

This tool is intended to assist distinct health professionals, including doctors and
bioinformaticians, and is designed to enable medical and research purposes.

### Implemented Algorithms

- Louvain;
- Infomap;
- Label propagation;
- Weighted label propagation;
- Layered label propagation.

### Benchmark

[Stanford Large Network Dataset Collection](http://snap.stanford.edu/data/index.html)

### Visualization Interface

- [Cytoscape.js](http://js.cytoscape.org/);
- [D3.js (Version 4 & SVG)](https://bl.ocks.org/pkerpedjiev/f2e6ebb2532dae603de13f0606563f5b);
- [D3.js (Version 4 & Canvas)](https://bl.ocks.org/jodyphelan/5dc989637045a0f48418101423378fbd).

### User Guide

1. Insert text file (.txt) with data in this [format](https://github.com/warcraft12321/Thesis/blob/master/uploads/Input.txt) and "Input.txt" name. Or just use the standard file included in the app (for now), in other words, ignore the input field;
2. Choose visualization interface;
3. Choose CF algorithm;
4. Run;
5. Networks above are draggable, zoomable and pannable. 

### Supervision Team

Bruno Gonçalves ([iMM](https://imm.medicina.ulisboa.pt/pt/)) | Alexandre Francisco ([INESC-ID](https://www.inesc-id.pt/) & [IST](https://tecnico.ulisboa.pt/pt/)) | João Carriço ([iMM](https://imm.medicina.ulisboa.pt/pt/) & [IST](https://tecnico.ulisboa.pt/pt/))

### Status

[21/12/2018] Louvain algorithm implemented;

[13/01/2019] Label Propagation, Weighted Label Propagation and Layered Label Propagation algorithms implemented.

[16/01/2019] Infomap algorithm implemented;

[17/01/2019] Improved code readability;

[18/01/2019] Added compressed algorithms (for enhanced performance) - Credits to UglifyJS 3 (https://skalman.github.io/UglifyJS-online/); 

[19/01/2019] Increased code robustness;

[21/01/2019] Testing algorithms with big data (1) - Credits to SNAP (http://snap.stanford.edu/data/index.html#socnets);

[02/02/2019] Implemented D3.js (using Canvas and SVG) and Cytoscape.js interface;

[Next] Benchmark algorithms;

[Next] PHYLOViZ integration.


