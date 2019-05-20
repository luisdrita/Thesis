# Infomap Algorithm

## Description

The execution of this algorithm is divided in 2 phases: minimizing description length (using [map equation](http://www.mapequation.org/index.html)) and community
 aggregation. Although the implementation is similar to the [Louvain algorithm](), the optimizing function is different.

## Usage

Install package using NPM.

```cmd
npm i --save infomap
```

Require it using Node.js. 

```node
const infomap = require('infomap');
```

Start community finding.

```node
let node2com = infomap.jInfomap(nodes, links, min);

// node2com = {nodeID1: commmunityID1, nodeID2: commmunityID2...}
// nodes = [nodeID1, nodeID2...]
// links = [{source: nodeID1, target: nodeID2, value: weight ...}]
// Whenever the MDL between 2 partitions is lower than a value "min", the iteration stops.
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