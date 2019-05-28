# MSc Thesis 
[https://mscthesis.herokuapp.com/](https://mscthesis.herokuapp.com/)

## Community Finding with Applications on Phylogenetic Networks

The aim of the thesis was to develop an improved version of [PHYLOViZ](http://www.phyloviz.net/) Online by
implementing community finding (CF) algorithms, as well as, adding new tools for
data visualization. Similar algorithms are being used in other domains. In
phylogenetics, it is a step forward for handling infectious diseases.

This tool is intended to assist distinct health professionals, including doctors and
bioinformaticians, and is designed to enable medical and research purposes.

### Implemented Algorithms

- [Louvain](https://www.npmjs.com/package/louvain-algorithm);
- [Infomap](https://www.npmjs.com/package/infomap);
- [Layered Label Propagation (LLP)](https://www.npmjs.com/package/layered-label-propagation);
- [Girvan-Newman (GN) Benchmark Network Generator](https://www.npmjs.com/package/girvan-newman-benchmark);
- [Normalized Mutual Information (NMI)](https://www.npmjs.com/package/normalized-mutual-information);
- [Hamming Distance](https://www.npmjs.com/package/hamming-dist).

### Benchmark & Testing
#### Synthetic Networks
- [Girvan-Newman](https://www.npmjs.com/package/girvan-newman-benchmark);
- [Lancichinetti-Fortunato-Radicchi (LFR)](https://sites.google.com/site/santofortunato/inthepress2).

#### Real Networks
- [Amazon](http://snap.stanford.edu/data/com-Amazon.html);
- [Zachary's Karate Club](https://www.researchgate.net/publication/248519014_An_Information_Flow_Model_for_Conflict_and_Fission_in_Small_Groups1);
- [_Staphylococcus aureus_](https://pubmlst.org/bigsdb?db=pubmlst_saureus_seqdef).

#### Parameters
##### Accuracy
Congruence of each partition inferred by Louvain, Infomap and LLP was determined using NMI.

##### Speed
Time required to run Louvain, Infomap, LLP and GN Benchmark Network Generator, in GN and LFR networks, was measured.

### Visualization Interface

- [Cytoscape.js](http://js.cytoscape.org/);
- [D3.js (Version 4 & SVG)](https://bl.ocks.org/pkerpedjiev/f2e6ebb2532dae603de13f0606563f5b);
- [D3.js (Version 4 & Canvas)](https://bl.ocks.org/jodyphelan/5dc989637045a0f48418101423378fbd).

### Phyl
Web application which integrates all the previous components. [Image](https://hub.docker.com/r/warcraft12321/thesis) available in Docker Hub.

### User Guide

1. Insert text file (.txt) with data in this [format](https://github.com/warcraft12321/Thesis/blob/master/uploads/Input.txt) and "Input.txt" name. Or, just use a standard network included in the app;
2. Choose visualization interface;
3. Choose CF algorithm;
4. Run;
5. Generated networks are draggable, zoomable and pannable. 

### Supervision Team

Bruno Gonçalves ([iMM](https://imm.medicina.ulisboa.pt/pt/)) | Alexandre Francisco ([INESC-ID](https://www.inesc-id.pt/) & [IST](https://tecnico.ulisboa.pt/pt/)) | João Carriço ([iMM](https://imm.medicina.ulisboa.pt/pt/) & [IST](https://tecnico.ulisboa.pt/pt/)) | Vítor Borges ([INSA](http://www.insa.pt/))  
  
  Roadmap -> [Wiki](https://github.com/warcraft12321/Thesis/wiki)
