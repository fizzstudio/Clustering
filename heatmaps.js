var csv2json = require('csvjson-csv2json');
var data = csv2json(s2Data);
var Plotly = require('plotly.js-dist')


let dataArray = [];
for (let i = 0; i < data.length; i++) {
  dataArray.push([data[i]["x"], data[i]["y"]])
}

function generateHeatmap(dataArray, precision){


var precision = 50;

var y = [];
var x = [];

for (let point of dataArray){
    x.push(point[0]);
    y.push(point[1]);
  }


var yMax = Math.max(...y)*1.1;
var xMax = Math.max(...x)*1.1;
var yMin = Math.min(...y)*.91;
var xMin = Math.min(...x)*.91;



var grid = [];

for (let i = 0; i < precision; i++){
    grid.push([]);
    for (let j = 0; j < precision; j++){
        grid[i].push(0);
    }
}

for (let point of dataArray){
    let xIndex = Math.floor((point[0]-xMin)*precision/(xMax-xMin));
    let yIndex = Math.floor((point[1]-yMin)*precision/(yMax-yMin));
    grid[yIndex][xIndex]++;
}   



var heatmapData = [
    {
      z: grid,
      type: 'heatmap'
    }
  ];



TESTER1 = document.getElementById('tester1');

Plotly.newPlot(TESTER1, heatmapData);

TESTER2 = document.getElementById('tester2');
var trace1 = [{
    x: x,
    y: y,
    mode: 'markers',    
    type: 'scatter'
  }];

Plotly.newPlot(TESTER2, trace1)
}