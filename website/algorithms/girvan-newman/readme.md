# Girvan-Newman Benchmark Network

## Description

This algorithm generates a Girvan-Newman synthetic network based on the input of 2 value: mix parameter and average degree.
This way, 4 different ground-truth communities are generated with 32 nodes each. Each node will present a number of connections 
equal to the average degree. Moreover, the fraction of links between itself and nodes outside of the community it belongs
will be equal to the mix parameter.

![Alt text](../../img/gn.png)
<img src="../../img/gn.png">

Girvan-Newman Network | mix = 0.1 | avg_deg = 16

## Usage

Install package using NPM.

```cmd
npm i --save girvan-newman-benchmark
```

Require it using Node.js. 

```node
const gn = require('girvan-newman-benchmark');
```

Run it!

```node
let node2com = gn.jGirvan_Newman(mix, cyto, deg);

// "mix" is the fraction of links connected to any node going outwards the group it belongs to.
// "cyto" is a boolean value that should be set depending on the format we want the algorithm to return.
// "deg" is the degree of every node.
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

Alexandre Francisco ([INESC-ID](https://www.inesc-id.pt/) & [IST](https://tecnico.ulisboa.pt/pt/)) | João Carriço ([iMM](https://imm.medicina.ulisboa.pt/pt/)) | Vítor Borges ([INSA](http://www.insa.pt/))

I am deeply grateful for their help along this unique journey... 