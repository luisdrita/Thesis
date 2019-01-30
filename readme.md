# MSc Thesis

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

[Stanford Large Network Dataset Collection]()

### Visualization Interface

- Cytoscape.js;
- [D3.js (Version 4 & SVG)](https://bl.ocks.org/pkerpedjiev/f2e6ebb2532dae603de13f0606563f5b);
- [D3.js (Version 4 & Canvas)](https://bl.ocks.org/jodyphelan/5dc989637045a0f48418101423378fbd).

### User Guide

1. Insert text file (.txt) with data in this [format]();
2. Choose CF algorithm;
3. Choose visualization interface;
4. Run;
5. Networks above are draggable, zoomable and pannable. 

### Supervision Team

Bruno Gonçalves ([IMM](https://imm.medicina.ulisboa.pt/pt/)) | Alexandre Francisco ([INESC-ID](https://www.inesc-id.pt/) & [IST](https://tecnico.ulisboa.pt/pt/)) | João Carriço ([IMM](https://imm.medicina.ulisboa.pt/pt/) & [IST](https://tecnico.ulisboa.pt/pt/))

### Status

[21/12/2018] Louvain algorithm implemented;

[13/01/2019] Label Propagation, Weighted Label Propagation and Layered Label Propagation algorithms implemented.

[16/01/2019] Infomap algorithm implemented;

[17/01/2019] Improved code readability;

[18/01/2019] Added compressed algorithms (for enhanced performance) - Credits to UglifyJS 3 (https://skalman.github.io/UglifyJS-online/); 

[19/01/2019] Increased code robustness;

[21/01/2019] Testing algorithms with big data (1) - Credits to SNAP (http://snap.stanford.edu/data/index.html#socnets);

[Next] Develop interface;

[Next] Benchmark each one.


