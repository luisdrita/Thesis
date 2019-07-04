# MSc Thesis 
[mscthesis.herokuapp.com](https://mscthesis.herokuapp.com/)

## Community Finding with Applications on Phylogenetic Networks

The aim of the <a href="https://mscthesis.herokuapp.com/pages/thesis.html" style="color: #1d68ca; text-decoration-line: none">thesis</a> (<a href="https://mscthesis.herokuapp.com/pages/abstract.html" style="color: #1d68ca; text-decoration-line: none">extended abstract</a>) was
        to implement three community finding algorithms – Louvain, Infomap and Layered Label
        Propagation; to benchmark them using two synthetic networks – Girvan-Newman and Lancichinetti-Fortunato-Radicchi; to test them in real networks, particularly, in one derived from a <i>Staphylococcus aureus</i> MLST dataset; to compare
        visualization frameworks – Cytoscape.js and D3.js (using SVG and Canvas elements), and, finally, to make it all available online.

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
- [_Staphylococcus aureus_ MLST Dataset](https://pubmlst.org/bigsdb?db=pubmlst_saureus_seqdef).

#### Parameters
##### Accuracy
Congruence of each partition inferred by Louvain, Infomap and LLP was determined using NMI.

##### Speed
Time required to run Louvain, Infomap and LLP, in GN and LFR networks, was measured. As well as, the time needed to execute 
GN Benchmark Network Generator, considering different mixing and average node degree parameters.

### Visualization Interface

- [Cytoscape.js](http://js.cytoscape.org/);
- [D3.js (Version 4 & SVG)](https://bl.ocks.org/pkerpedjiev/f2e6ebb2532dae603de13f0606563f5b);
- [D3.js (Version 4 & Canvas)](https://bl.ocks.org/jodyphelan/5dc989637045a0f48418101423378fbd).

### Phyl
Web application which integrates all the previous components. [Image](https://hub.docker.com/r/warcraft12321/thesis) available in Docker Hub. Description video below.

[![Phyl](http://img.youtube.com/vi/5QMJ66PVxLg/0.jpg)](http://www.youtube.com/watch?v=5QMJ66PVxLg "Phyl")

### Supervision Team

Alexandre Francisco ([INESC-ID](https://www.inesc-id.pt/) & [IST](https://tecnico.ulisboa.pt/pt/)) | João Carriço ([iMM](https://imm.medicina.ulisboa.pt/pt/) & [IST](https://tecnico.ulisboa.pt/pt/)) | Vítor Borges ([INSA](http://www.insa.pt/))  
  
  Roadmap -> [Wiki](https://github.com/warcraft12321/Thesis/wiki)
  
  [![DOI](https://zenodo.org/badge/162063699.svg)](https://zenodo.org/badge/latestdoi/162063699)

