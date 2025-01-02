var csv2json = require('csvjson-csv2json');
var data = csv2json(s2Data);
var Plotly = require('plotly.js-dist')


let dataArray = [];
for (let i = 0; i < data.length; i++) {
  dataArray.push([data[i]["x"], data[i]["y"]])
}


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

function shoelace(data){
  let sum = 0;
  let n = data.length;
  for (let i = 0; i < n - 1; i++){
      sum += data[i].x * data[i + 1].y - data[i].y * data[i + 1].x
  }
  sum += data[n - 1].x * data[0].y - data[n - 1].y * data[0].x
  return Math.abs(sum/2);
}

function perimeter(data){
  let sum = 0;
  let n = data.length;
  for (let i = 0; i < n - 1; i++){
    pointer = [data[i].x, data[i].y];
    next = [data[i + 1].x, data[i + 1].y];
    sum += euclidDistance(pointer, next);
  }
  sum += euclidDistance([data[n-1].x, data[n-1].y], [data[0].x, data[0].y])
  return sum;
}

function euclidDistance(p, q) {
  //Returns euclidean distance between vectors p and q.
  var sum = 0;
  var i = Math.min(p.length, q.length);

  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }

  return Math.sqrt(sum);
};

console.log(dataArray);
shellPoints = convexhull.makeHull(data)
console.log(shellPoints);
shellArea = shoelace(shellPoints)
console.log(shellArea)
shellPerim = perimeter(shellPoints)
console.log(shellPerim)
console.log(2*Math.sqrt(shellArea*Math.PI)/shellPerim);









function deCoordinate(array){
  var dataArray = [];
  for (let i = 0; i < array.length; i++) {
    dataArray.push([array[i]["x"], array[i]["y"]])
  }
  return dataArray;
}

function coordinate(array){
  var dataArray = [];
  for (let i = 0; i < array.length; i++) {
    dataArray.push({x : array[i][0], y : array[i][1]})
  }
  return dataArray;
}