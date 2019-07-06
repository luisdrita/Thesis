# Layered Label Propagation Algorithm

## Description

The update rule distinguishes Layered Label Propagation from Label Propagation. Instead of limiting the community choice to the one that
is predominant among the nodes in the neighborhood, it takes into account a factor that considers the labeled nodes
in the complete network. In fact, both algorithm versions are equivalent whenever this factor is considered 0.

Optimizing equation:

![Layered Label Propagation Equation](https://mscthesis.herokuapp.com/img/eq3.svg)

## Usage

Install package using NPM.

```cmd
npm i --save layered-label-propagation
```

Require it using Node.js. 

```node
const llp = require('layered-label-propagation');
```

Start community finding.

```node
let node2com = llp.jLayeredLabelPropagation(nodes, links, gamma, max);

// node2com = {nodeID1: commmunityID1, nodeID2: commmunityID2...}
// nodes = [nodeID1, nodeID2...]
// links = [{source: nodeID1, target: nodeID2, value: weight ...}]
// gamma 
// Whenever the number of iterations exceeds a given "max", algorithms stops further partitioning of the network. 
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