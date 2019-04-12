# Normalized Mutual Information

## Description

Given 2 partitions of the same network, NMI allows us to check how correlated are both.
This value varies between 0 (disparate partitioning) and 1 (same clusters were identified).  

## Usage

Install package using NPM.

```cmd
npm i --save normalized-mutual-information
```

Require it using Node.js. 

```node
const nmi = require('normalized-mutual-information');
```

Run it!

```node
let node2com = nmi.jNMI(array1, array2);

// Each value of the array is the community to which each node (given by the position in the array) belongs.
``` 

## More

#### *Community Finding with Applications on Phylogenetic Networks* (Master Thesis)

[Louvain](), [Infomap](https://www.npmjs.com/package/infomap), [Layered Label Propagation](https://www.npmjs.com/package/layered-label-propagation),
 [Label Propagation](https://www.npmjs.com/package/layered-label-propagation), [Hamming Distance](), [Girvan-Newman Benchmark](https://www.npmjs.com/package/girvan-newman-benchmark)
  and [Normalized Mutual Information](https://www.npmjs.com/package/normalized-mutual-information) algorithms were developed in JavaScript. To visualize the results, an interface 
  using D3.js (SVG and Canvas) and Cytoscape was implemented. Every community finding algorithm was tested in terms of accuracy, speed and memory against 2 synthetic networks (Girvan-Newman
   and Lacichinetti-Fortunato-Radicchi networks with varying parameters). Final goal was to cluster microbiological data. <br/>

Check out more in the thesis [website](https://mscthesis.herokuapp.com/). You may also download an image of the application in [Docker Hub](https://cloud.docker.com/u/warcraft12321/repository/docker/warcraft12321/thesis).

#### Supervision Team

Bruno Gonçalves ([iMM](https://imm.medicina.ulisboa.pt/pt/)) | Alexandre Francisco ([INESC-ID](https://www.inesc-id.pt/) & [IST](https://tecnico.ulisboa.pt/pt/)) | João Carriço ([iMM](https://imm.medicina.ulisboa.pt/pt/) & [IST](https://tecnico.ulisboa.pt/pt/))

I am deeply grateful for their help along this unique journey... 