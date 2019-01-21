
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

function edge (source, target) {
    return {source: source, target: target};
}

fs.readFile('Input.txt', 'utf8', function(err,data) {
    if(err) throw err;
    let obj = [];
    let splitted = data.toString().split("\n");

    for (let i = 0; i<splitted.length; i++) {
        let splitLine = splitted[i].split("\t");
       /* obj[splitLine[0]] = splitLine[1]; */
        obj.push(edge(splitLine[0],splitLine[1]));
    }
    console.log(obj[0]);
    fs.writeFile("./message.json", JSON.stringify(obj), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
});

app.use(express.static('CF'));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

