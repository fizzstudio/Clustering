//var s1 = require('./s1.js')
//console.log(s1.data);
var clustering = require('./node_modules/density-clustering');
const silhouette = require('@robzzson/silhouette');
var csv2json = require('csvjson-csv2json');
var Plotly = require('plotly.js-dist');

const data = csv2json(s1Data);
let dataArray = [];
for (let i = 0; i < data.length; i++) {
  dataArray.push([Number(data[i]["x"]), Number(data[i]["y"])])
}

//distAvg averges out the nearest neighbor distances over each point in the set
let distAvg = [];
let master = [];
for (let i = 0; i < dataArray.length; i++) {
  master.push(nNDistances(dataArray, i))
}
for (let i = 0; i < dataArray.length; i++) {
  let sum = 0;
  for (let j = 0; j < dataArray.length; j++) {
  sum += master[j][i];
}
distAvg.push(sum)
}
distAvg = distAvg.map((x) => x / dataArray.length)


let minPts = 4;

var fizzscan = new clustering.FIZZSCAN();
var clusters = fizzscan.run(dataArray, 2*distAvg[minPts], minPts, false);
console.log(clusters, fizzscan.noise);
console.log(`Number of clusters: ${clusters.length}`)
console.log(`Total elements: ${clusters.flat().length + fizzscan.noise.length}`)
console.log(`Total clustered elements: ${clusters.flat().length}`)
console.log(`Total noise elements: ${fizzscan.noise.length}`)

//var datasetCentroid = getCentroid(dataArray);

let clusterRegions = region(fizzscan.clusterCentroids);

console.log("-------------------------")
console.log("Individual Cluster Analysis")
console.log("-------------------------")



let masterArray = [];
let i = 0;
let mostDense = [0,0];
const palette = ["red", "orange", "yellow", "green", "blue", "cyan", "darkblue", "pink", "darkmagenta", "chocolate", "dodgerblue", "gold", "firebrick", "lawngreen", "red", "orange", "yellow", "green", "blue", "cyan", "darkblue", "pink", "darkmagenta", "chocolate", "dodgerblue", "gold", "firebrick", "lawngreen"];
for (let cluster of clusters){
  let clusterObject = {};
  let clusterData = [];
  for (let point of cluster){
    clusterData.push(dataArray[point]);
  }
  //console.log(clusterData);
  clusterObject.dataPoints = clusterData;
  console.log(`This is cluster Number ${i}`)
  clusterObject.id = i;
  console.log(`This cluster is in the ${clusterRegions[i]} of the overall data.`);
  clusterObject.region = clusterRegions[i];
  console.log(`This cluster is colored ${palette[i]}`);
  let area = shoelace(coordinate(clusterData));
  let flat = flatness(convexhull.makeHull(coordinate(clusterData)))
  let shape = judgeShape(flat);
  console.log(`The shape of the data is ${shape}`)
  clusterObject.shape = shape;
  let density = cluster.length / area;
  clusterObject.density = density;






  clusterObject.relations = [];
  let closest = nNIndices(fizzscan.clusterCentroids, i);
  //clusterObject.nearestIndices = closest;
  let distances = nNDistances(fizzscan.clusterCentroids, i)
  //clusterObject.nearestDistances = distances;

  let angles =[];
  for (let j = 0; j < clusters.length; j++){
    let angle = judgeAngle(fizzscan.clusterCentroids[i], fizzscan.clusterCentroids[closest[j]]);
    angles.push(angle);
    clusterObject.relations.push({
      "id": closest[j],
      "distance": distances[j],
      "angle": angle
    })
  }
  clusterObject.isMostDense = false;
  masterArray.push(clusterObject);

  if (density > mostDense[1]){
    mostDense[1] = density;
    masterArray[mostDense[0]].isMostDense = false;
    masterArray[i].isMostDense = true;
    mostDense[0] = i;
  }

  console.log(clusterObject);
  /*
  console.log(`The closest clusters are Cluster ${closest[1] + 1} (${Math.round(distances[1])} units away to the ${getAngle(1)}),
    Cluster ${closest[2] + 1} (${Math.round(distances[2])} units away to the ${getAngle(2)}), 
    and Cluster ${closest[3] + 1} (${Math.round(distances[3])} units away to the ${getAngle(3)})
  `)
  */
  console.log("-------------------------");
  
  i++;
}
console.log("stop");

var precision = 50;
generateHeatmap(dataArray, precision);

//Draws the main graph

const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    canvas.height = 1000;
    canvas.width=1000;
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
    

    const xArray = [];
    const yArray = [];



    for (let i = 0; i<dataArray.length; i++){
      xArray.push(dataArray[i][0]);
      yArray.push(dataArray[i][1]);
    }
    

    for (let i = 0; i < xArray.length-1; i++) {
      let x = xArray[i]/1000;
      let y = yArray[i]/1000;
      ctx.beginPath();
      for (let j = 0; j < clusters.length; j++){
        if (clusters[j].includes(i)){
          ctx.fillStyle = palette[j];
          ctx.ellipse(x, y, 2, 2, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      if (fizzscan.noise.includes(i)){
        ctx.fillStyle = "gray";
        ctx.ellipse(x, y, 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      

    }
    for (let i = 0; i < fizzscan.clusterCentroids.length; i++){
      let x = fizzscan.clusterCentroids[i][0]/1000;
      let y = fizzscan.clusterCentroids[i][1]/1000;
      ctx.beginPath();
      ctx.fillStyle = palette[i];
      ctx.ellipse(x, y, 5, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.ellipse(x, y, 6, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    }
    for (let cluster of clusters){
      let clusterData = [];
      for (let point of cluster) {
        clusterData.push(dataArray[point]);
      }
      let shell = convexhull.makeHull(coordinate(clusterData));
      ctx.beginPath();
      ctx.moveTo(shell[0].x / 1000, shell[0].y / 1000)
      for (let point of shell){
        ctx.lineTo(point.x / 1000, point.y / 1000);
        ctx.stroke();
      }
      ctx.lineTo(shell[0].x / 1000, shell[0].y / 1000)
      ctx.stroke();
      ctx.closePath();
    }





//Helper functions






function euclidDistance(p, q) {
  //Returns euclidean distance between vectors p and q.
  var sum = 0;
  var i = Math.min(p.length, q.length);

  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }

  return Math.sqrt(sum);
};

function nNDistances(dataset, pointId) {
  //Returns list of distances from nearest neighbors for a point, sorted low to high.
  var distances = [];
  for (var id = 0; id < dataset.length; id++) {
    var dist = euclidDistance(dataset[pointId], dataset[id]);
    distances.push(dist);
  }
  
  return distances.sort((a, b) => { return a - b; });
};

function nNIndices(dataset, pointId) {
  //Returns list of nearest indices to a point, sorted low to high, including the point itself.
  var distances = [];
  for (var id = 0; id < dataset.length; id++) {
    var dist = [id, euclidDistance(dataset[pointId], dataset[id])];
    distances.push(dist);
  }
  
  distances = distances.sort((a, b) => { return a[1] - b[1]; });
  let indices = [];
  for (let i = 0; i < dataset.length; i++){
    indices.push(distances[i][0]);
  }
  return indices;
};

function getCentroid(c) {
  //Calculates centroid point of a data set
  var centroid = [];
  var i = 0;
  var j = 0;
  var l = c.length;

  for (i = 0; i< l; i++){
      for (j = 0; j< c[i].length; j++){
          if (centroid[j] !== undefined){
              centroid[j] += c[i][j]/l;
          }
          else{
              centroid.push(0);
              centroid[j] += c[i][j]/l;
          }
      }
  }
  return centroid;
}

/*

var BCSS = 0;
var WCSS = 0;
for (let i = 0; i < clusters.length; i++){
  var clusteredData = [];
  for (let j = 0; j < clusters[i].length; j++){
    clusteredData.push(dataArray[clusters[i][j]])
  }
  BCSS += clusteredData.length * euclidDistance(getCentroid(clusteredData), datasetCentroid);
}
for (let i = 0; i < clusters.length; i++){
  var clusteredData = [];
  for (let j = 0; j < clusters[i].length; j++){
    clusteredData.push(dataArray[clusters[i][j]])
  }
  for (let j = 0; j < clusteredData.length; j++){
    WCSS += euclidDistance(clusteredData[j], getCentroid(clusteredData));
  }
  
}
CHI = BCSS*(dataArray.length-clusters.length)/(WCSS*(clusters.length-1))
console.log(`Calinski–Harabasz index: ${CHI}`)



var silhouetteLabels = [];
for (let i = 0; i < dataArray.length; i++){
  silhouetteLabels.push(0);
}
for (let i = 0; i < clusters.length; i++){
  //console.log(i);
  for (let j = 0; j < clusters[i].length; j++){
    //console.log(j);
    silhouetteLabels[clusters[i][j]] = i;
  }
}
let silhouetteScore = silhouette(dataArray, silhouetteLabels);
console.log(`Sillhouette score: ${silhouetteScore}`);
*/

function shoelace(data){
  //Calculates area from set of points, intended to be used on convex hull with points ordered either c-wise or cc-wise
  let sum = 0;
  let n = data.length;
  for (let i = 0; i < n - 1; i++){
      sum += data[i].x * data[i + 1].y - data[i].y * data[i + 1].x
  }
  sum += data[n - 1].x * data[0].y - data[n - 1].y * data[0].x
  return Math.abs(sum/2);
}

function perimeter(data){
  //Calculates perimeter from set of points, intended to be used on convex hull with points ordered either c-wise or cc-wise
  let sum = 0;
  let n = data.length;
  if (n == 2){
    return euclidDistance([data[0].x, data[0].y], [data[1].x, data[1].y])
  }
  for (let i = 0; i < n - 1; i++){
    let pointer = [data[i].x, data[i].y];
    let next = [data[i + 1].x, data[i + 1].y];
    sum += euclidDistance(pointer, next);
  }
  sum += euclidDistance([data[n-1].x, data[n-1].y], [data[0].x, data[0].y])
  return sum;
}

function flatness(data){
  //Gets flatness coefficient from perimeter and area
  return 2*Math.sqrt(shoelace(data)*Math.PI)/perimeter(data);
}

function judgeShape(flatness){
  if (flatness > .9){
    return "roughly circular";
  }
  else if (flatness > .6){
    return "irregular";
  }
  else{
    return "roughly linear";
  }
}






function deCoordinate(array){
  //Removes x-y coordinates from arrays
  var dataArray = [];
  for (let i = 0; i < array.length; i++) {
    dataArray.push([array[i]["x"], array[i]["y"]])
  }
  return dataArray;
}

function coordinate(array){
  //Adds x-y coordinates to arrays
  var dataArray = [];
  for (let i = 0; i < array.length; i++) {
    dataArray.push({x : array[i][0], y : array[i][1]})
  }
  return dataArray;
}


function generateHeatmap(dataArray, precision){




let y = [];
let x = [];

for (let point of dataArray){
    x.push(point[0]);
    y.push(point[1]);
  }


let yMax = Math.max(...y)*1.1;
let xMax = Math.max(...x)*1.1;
let yMin = Math.min(...y)*.91;
let xMin = Math.min(...x)*.91;



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

  var heatmapData2 = [
    {
      z: grid,
      colorscale: [
        ['0.0', 'rgb(255,255,255)'],
        ['0.111111111111', 'rgb(191,191,191)'],
        ['0.222222222222', 'rgb(170,170,170)'],
        ['0.333333333333', 'rgb(149,149,149)'],
        ['0.444444444444', 'rgb(128,128,128)'],
        ['0.555555555556', 'rgb(106,106,106)'],
        ['0.666666666667', 'rgb(85,85,85)'],
        ['0.777777777778', 'rgb(64,64,64)'],
        ['0.888888888889', 'rgb(43,43,43)'],
        ['1.0', 'rgb(21,21,21)']
      ],
      type: 'heatmap'
    }
  ];


HEATMAP1 = document.getElementById('heatmap1');

Plotly.newPlot(HEATMAP1, heatmapData);

HEATMAP2 = document.getElementById('heatmap2');

Plotly.newPlot(HEATMAP2, heatmapData2);

TESTER2 = document.getElementById('tester2');
var trace1 = [{
    x: x,
    y: y,
    mode: 'markers',    
    type: 'scatter'
  }];

Plotly.newPlot(TESTER2, trace1)
}

function region(data){
  //Classifies datapoints into one of 9 regions (3x3) and returns an array of strings describing those regions.

  let regions = [];
  let n = data.length;
  let xMax = data[0][0];
  let yMax = data[0][1];
  let xMin = data[0][0];
  let yMin = data[0][1];
  for (let i = 0; i < n; i++){
    if (xMax < data[i][0]){
      xMax = data[i][0];
    }
    if (xMin > data[i][0]){
      xMin = data[i][0];
    }
    if (yMax < data[i][1]){
      yMax = data[i][1];
    }
    if (yMin > data[i][1]){
      yMin = data[i][1];
    }
  }
  let left = ((xMax-xMin) / 3) + xMin;
  let right = ((xMax-xMin) * 2 / 3) + xMin;
  let down = ((yMax-yMin) / 3) + yMin;
  let up = ((yMax-yMin) * 2 / 3) + yMin;

  for (let point of data){
  let test = [point[0] < left , point[0]< right, point[1] < down, point[1] < up];
    switch (true) {
      case JSON.stringify(test) == JSON.stringify([true, true, true, true]) :
           regions.push("bottom left");
           break;
      case JSON.stringify(test) == JSON.stringify([false, true, true, true]) :
           regions.push("bottom center");
           break;
      case JSON.stringify(test) == JSON.stringify([false, false, true, true]) :
           regions.push("bottom right");
           break;
      case JSON.stringify(test) == JSON.stringify([true, true, false, true]) :
           regions.push("left");
           break;
      case JSON.stringify(test) == JSON.stringify([false, true, false, true]) :
           regions.push("center");
           break;
      case JSON.stringify(test) == JSON.stringify([false, false, false, true]) :
           regions.push("right");
           break;
      case JSON.stringify(test) == JSON.stringify([true, true, false, false]) :
           regions.push("top left");
           break;
      case JSON.stringify(test) == JSON.stringify([false, true, false, false]) :
           regions.push("top center");
           break;
      case JSON.stringify(test) == JSON.stringify([false, false, false, false]) :
           regions.push("top right");
    }
  }
  return regions;
}

function judgeAngle(x, y){
  const subtraction = y.map((num, index) => num - x[index]);
  let angle = 0;
  if (subtraction[0] == 0 && subtraction[1] > 0){
    angle = Math.PI / 2
  }
  else if (subtraction[0] == 0 && subtraction[1] > 0){
    angle = -Math.PI / 2
  }
  else {
    
    switch (true){
      case subtraction[0] > 0 && subtraction[1] > 0:
        angle = Math.atan(subtraction[1] / subtraction[0])
        break;
      case subtraction[0] < 0 && subtraction[1] > 0:
        angle = Math.atan(subtraction[0] / subtraction[1])
        angle = Math.abs(angle) + Math.PI / 2;
        break;
      case subtraction[0] < 0 && subtraction[1] < 0:
        angle = Math.atan(subtraction[1] / subtraction[0])
        angle = Math.abs(angle) + Math.PI;  
        break;
      case subtraction[0] > 0 && subtraction [1] < 0:
        angle = Math.atan(subtraction[0] / subtraction[1])
        angle = Math.abs(angle) + 3 * Math.PI / 2;
        break;
    }
  }
  
  angle = angle * 180 / Math.PI;
  switch (true){
    case 345 < angle || angle < 15:
      return "east";
    case 15 < angle && angle < 75:
      return "north-east";  
    case 75 < angle && angle < 105:
      return "north";  
    case 105 < angle && angle < 165:
      return "north-west";
    case 165 < angle && angle < 195:
      return "west";
    case 195 < angle && angle < 255:
      return "south-west";        
    case 255 < angle && angle < 285:
      return "south";  
    case 285 < angle && angle < 345:
      return "south-east";                  
  }
}

function mostFrequent(arr) {
  let m = new Map();
  let maxCount = 0;
  let res = null;

  for (let num of arr) {
      let count = (m.get(num) || 0) + 1;
      m.set(num, count);

      if (count > maxCount) {
          maxCount = count;
          res = num;
      }
  }

  return res;
}