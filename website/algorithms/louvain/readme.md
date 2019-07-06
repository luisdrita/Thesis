# Louvain Algorithm

## Description

This algorithm is divided in 2 phases: Modularity Optimization and Community Aggregation. Just after the first is
completed, the second takes place. Louvain will iteratively go through both until we get an optimized partition of the network.
Modularity Optimization - At the beginning of this phase, the algorithm will randomly order all the nodes in the network such that, one by one,
it will remove and insert it in a different community. This will continue until no significant variation in modularity is
achieved (given by a constant defined below - __MIN).
Community Aggregation - After finalizing the first pass, every node belonging to the same community is merged into a single giant one and
the links connecting these will be formed by the sum of the ones previously connecting nodes from the same different communities. From now on,
there will also exist self-loops that represent the sum of all links in a given community (strictly connecting nodes inside of it) before being
collapsed into a single one.

Optimizing equation:

![Louvain Equation](https://mscthesis.herokuapp.com/img/eq1.svg)

## Usage

Install package using NPM.

```cmd
npm i --save louvain-algorithm
```

Require it using Node.js. 

```node
const louvain = require('louvain-algorithm');
```

Start community finding.

```node
let node2com = louvain.jLouvain(nodes, links, min);

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

Check out more in the thesis [website](https://mscthesis.herokuapp.com/). You may also download an image of the application in [Docker Hub](https://cloud.docker.com/u/warcraft12321/repository/docker/warcraft12321/thesis). A description video is below.

[![Phyl](http://img.youtube.com/vi/5QMJ66PVxLg/0.jpg)](http://www.youtube.com/watch?v=5QMJ66PVxLg "Phyl")

#### Supervision Team

Alexandre Francisco ([INESC-ID](https://www.inesc-id.pt/) & [IST](https://tecnico.ulisboa.pt/pt/)) | João Carriço ([iMM](https://imm.medicina.ulisboa.pt/pt/)) | Vítor Borges ([INSA](http://www.insa.pt/))