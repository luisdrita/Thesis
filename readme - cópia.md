# MSc Thesis 
[https://mscthesis.herokuapp.com/](https://mscthesis.herokuapp.com/)

## Community Finding with Applications on Phylogenetic Networks

The aim of the thesis was to develop an improved version of [PHYLOViZ](http://www.phyloviz.net/) Online by
implementing CF algorithms, as well as, adding new tools for
data visualization. Similar algorithms are being used in other domains. In
phylogenetics, it is a step forward for handling infectious diseases.

This tool is intended to assist distinct health professionals, including doctors and
bioinformaticians, and is designed to enable medical and research purposes.

### Implemented Algorithms

- [Louvain](https://www.npmjs.com/package/louvain-algorithm);
- [Infomap](https://www.npmjs.com/package/infomap);
- [Layered Label Propagation](https://www.npmjs.com/package/layered-label-propagation);
- [Girvan-Newman Benchmark Network Generator](https://www.npmjs.com/package/girvan-newman-benchmark);
- [Normalized Mutual Information (NMI)](https://www.npmjs.com/package/normalized-mutual-information);
- [Hamming Distance](https://www.npmjs.com/package/hamming-dist).

### Benchmark
#### Synthetic Networks
- [Girvan-Newman (GN)](https://www.npmjs.com/package/girvan-newman-benchmark);
- [Lancichinetti-Fortunato-Radicchi (LFR)](https://sites.google.com/site/santofortunato/inthepress2).

#### Real Networks
- [Amazon](http://snap.stanford.edu/data/com-Amazon.html);
- [Zachary's Karate Club](https://www.researchgate.net/publication/248519014_An_Information_Flow_Model_for_Conflict_and_Fission_in_Small_Groups1);
- [_Staphylococcus aureus_](https://pubmlst.org/bigsdb?db=pubmlst_saureus_seqdef).

#### Parameters
##### Accuracy
Congruence calculation using NMI.

##### Speed
Time required to run each algorithm in GN and LFR networks.

### Visualization Interface

- [Cytoscape.js](http://js.cytoscape.org/);
- [D3.js (Version 4 & SVG)](https://bl.ocks.org/pkerpedjiev/f2e6ebb2532dae603de13f0606563f5b);
- [D3.js (Version 4 & Canvas)](https://bl.ocks.org/jodyphelan/5dc989637045a0f48418101423378fbd).

### Phyl
Web application which integrates all the previous components. [Image](https://hub.docker.com/r/warcraft12321/thesis) available in Docker Hub.

### User Guide

1. Insert text file (.txt) with data in this [format](https://github.com/warcraft12321/Thesis/blob/master/uploads/Input.txt) and "Input.txt" name. Or just use the standard file included in the app (for now), in other words, ignore the input field;
2. Choose visualization interface;
3. Choose CF algorithm;
4. Run;
5. Networks above are draggable, zoomable and pannable. 

### Supervision Team

Bruno Gonçalves ([iMM](https://imm.medicina.ulisboa.pt/pt/)) | Alexandre Francisco ([INESC-ID](https://www.inesc-id.pt/) & [IST](https://tecnico.ulisboa.pt/pt/)) | João Carriço ([iMM](https://imm.medicina.ulisboa.pt/pt/) & [IST](https://tecnico.ulisboa.pt/pt/)) | Vítor Borges ([INSA](http://www.insa.pt/))

### Results

![Community_Finding Screenshot](./website/img/communityFinding.png)

Fig. 1 - Amazon product co-purchasing network (10 000 samples) and detected communities. Using D3.js, SVG and Layered Label Propagation algorithm.

![Community_Finding Screenshot](./website/img/networks/gn.png)

Fig. 2 - Girvan-Newman synthetic network. 
N = 128 | mix = 0.1 | k = 16 | Interface: D3.js & SVG.

![Community_Finding Screenshot](./website/img/networks/karate.png)

Fig. 3 - Zachary's karate club network (JSON file in the repo).

![Community_Finding Screenshot](./website/img/networks/lfr.png)

Fig. 4 - Lancichinetti-Fortunato-Radicchi Benchmark Network.
N = 1000 | mix = 0.1 | avg_k = 15 | max_k = 50 | min_c = 20 | max_c = 50 | Interface: D3.js & SVG.