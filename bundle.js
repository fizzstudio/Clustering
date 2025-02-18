(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//const silhouette = require('@robzzson/silhouette');
var csv2json = require('csvjson-csv2json');
//var Plotly = require('plotly.js-dist');
var classifyPoint = require("robust-point-in-polygon");
const data = csv2json(s1Data);


let dataArray = [];
for (let i = 0; i < data.length; i++) {
  dataArray.push([Number(data[i]["x"]), Number(data[i]["y"])])
}

let minPts = 4;

//distAvg averges out the nearest neighbor distances over each point in the set
let distAvg = [];
let distanceStorage = [];

for (let i = 0; i < dataArray.length; i++) {
  distanceStorage.push(nNDistancesSpecial(dataArray, i, minPts))
}



for (let i = 0; i < dataArray.length; i++) {
  let sum = 0;
  for (let j = 0; j < dataArray.length; j++) {
  sum += distanceStorage[j][i];
}
distAvg.push(sum)
}
distAvg = distAvg.map((x) => x / dataArray.length)




var fizzscan = new FIZZSCAN();
var clusters = fizzscan.run(dataArray, 2*distAvg[minPts], minPts, false);


console.log(clusters, fizzscan.noise, fizzscan.noiseAssigned);
console.log(`Number of clusters: ${clusters.length}`)
console.log(`Total elements: ${clusters.flat().length + fizzscan.noise.length}`)
console.log(`Total clustered elements: ${clusters.flat().length}`)
console.log(`Total noise elements: ${fizzscan.noise.length}`)

//var datasetCentroid = getCentroid(dataArray);

let clusterRegions = getRegion(fizzscan.clusterCentroids);
let clusterRegionsJudged = judgeRegion(clusterRegions);


console.log("-------------------------")
console.log("Individual Cluster Analysis")
console.log("-------------------------")



let masterArray = [];
let densitySorted = [];
let i = 0;
const palette = ["red", "orange", "yellow", "green", "blue", "cyan", "darkblue", "pink", "darkmagenta", "chocolate", "dodgerblue", "gold", "firebrick", "lawngreen", "red", "orange", "yellow", "green", "blue", "cyan", "darkblue", "pink", "darkmagenta", "chocolate", "dodgerblue", "gold", "firebrick", "lawngreen"];
for (let cluster of clusters){
  let clusterObject = {};
  let clusterData = [];
  for (let point of cluster){
    clusterData.push(dataArray[point]);
  }
  //console.log(clusterData);
  clusterObject.dataPoints = clusterData;
  let xMin = clusterData[0][0];
  let xMax = clusterData[0][0];
  let yMin = clusterData[0][1];
  let yMax = clusterData[0][1];
  for (let point of clusterData){
    if (point[0] < xMin){
      xMin = point[0];
    }
    if (point[0] > xMax){
      xMax = point[0];
    }
    if (point[1] < yMin){
      yMin = point[1];
    }
    if (point[1] > yMax){
      yMax = point[1];
    }
  }
  clusterObject.xMin = xMin;
  clusterObject.xMax = xMax;
  clusterObject.yMin = yMin;
  clusterObject.yMax = yMax;
  console.log(`This is cluster Number ${i}`)
  clusterObject.id = i;
  console.log(`This cluster is in the ${clusterRegionsJudged[i]} of the overall data.`);
  clusterObject.region = clusterRegions[i];
  clusterObject.regionDesc = clusterRegionsJudged[i];
  console.log(`This cluster is colored ${palette[i]}`);
  let area = shoelace(coordinate(clusterData));
  let hull = convexhull.makeHull(coordinate(clusterData));
  clusterObject.hull = hull;
  let hullSimplified = simplifyHull(hull);
  clusterObject.hullSimplified = hullSimplified;
  let shape = judgeShape(clusterData);
  console.log(`The shape of the data is ${shape.description}`)
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
    let angle = getAngle(fizzscan.clusterCentroids[i], fizzscan.clusterCentroids[closest[j]]);
    let card =  judgeAngle(fizzscan.clusterCentroids[i], fizzscan.clusterCentroids[closest[j]]);
    angles.push(angle);
    clusterObject.relations.push({
      "id": closest[j],
      "distance": distances[j],
      "angle": angle,
      "cardDirection": card
    })
  }
  masterArray.push(clusterObject);
  console.log(clusterObject);
  console.log(findHoles(clusterObject));
  /*
  console.log(`The closest clusters are Cluster ${closest[1] + 1} (${Math.round(distances[1])} units away to the ${getAngle(1)}),
    Cluster ${closest[2] + 1} (${Math.round(distances[2])} units away to the ${getAngle(2)}), 
    and Cluster ${closest[3] + 1} (${Math.round(distances[3])} units away to the ${getAngle(3)})
  `)
  */
  console.log("-------------------------");
  i++;
}

densitySorted = masterArray.toSorted((a, b) => {
  return a.density - b.density;
})
for (let cluster of masterArray){
cluster.densityRank = densitySorted.indexOf(cluster);
}

i = 0;
j = 0;

//Designates "neighbors" of each cluster
neighborParameter = 1.2
for (let cluster of fizzscan.clusterCentroids){
  j = 0;
  for (let target of fizzscan.clusterCentroids){
    let cloneCentroids = [];
    if (i == j){
      masterArray[i].relations[0].isNeighbor = true;
      j++;
    }
    else {
      if (i < j){
        cloneCentroids = [...fizzscan.clusterCentroids.slice(0, i), ...fizzscan.clusterCentroids.slice(i + 1)];
        cloneCentroids.splice(j - 1, 1);
      }
      if (i > j){
        cloneCentroids = [...fizzscan.clusterCentroids.slice(0, j), ...fizzscan.clusterCentroids.slice(j + 1)];
        cloneCentroids.splice(i - 1, 1);
      }
  
      let directDistance = euclidDistance(cluster, target);
      let branchDistances = [];
      for (let branch of cloneCentroids){
        if (euclidDistance(cluster, branch) < euclidDistance(cluster, target)){
          branchDistances.push(euclidDistance(cluster, branch) + euclidDistance(branch, target));
        }
      }
      let targetRelation = {};
      for (relation of masterArray[i].relations){
        if (relation.id == j){
          targetRelation = relation;  
        }
      }
      if (Math.min(...branchDistances) < neighborParameter * directDistance){
        masterArray[i].relations[masterArray[i].relations.indexOf(targetRelation)].isNeighbor = false;
      }
      else{
        masterArray[i].relations[masterArray[i].relations.indexOf(targetRelation)].isNeighbor = true;
      }
      j++;
    }
  }
  i++;
}


console.log(masterArray);
console.log("stop");


//Draws the main graph

var precision = 50;
//generateHeatmap(dataArray, precision);


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
      //shell = simplifyHull(shell);
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
  const start = Date.now();
  var distances = [];
  for (var id = 0; id < dataset.length; id++) {
    var dist = euclidDistance(dataset[pointId], dataset[id]);
    distances.push(dist);
  }
  let typedArray = Float32Array.from(distances)
  typedArray.sort((a, b) => { return a - b; });
  return typedArray;
  
};

function nNDistancesSpecial(dataset, pointId, minPts) {
  //Returns list of distances from nearest neighbors for a point, sorted low to high.
  const start = Date.now();
  var distances = [];
  for (var id = 0; id < dataset.length; id++) {
    var dist = euclidDistance(dataset[pointId], dataset[id]);
    distances.push(dist);
  }
  let typedArray = Float32Array.from(distances)
  if (minPts < 100) return partialSort(typedArray, 2 * minPts);
  else return typedArray.sort((a, b) => { return a - b; });;  
};


function bisect(items, x, lo, hi) {
  var mid;
  if (typeof(lo) == 'undefined') lo = 0;
  if (typeof(hi) == 'undefined') hi = items.length;
  while (lo < hi) {
    mid = Math.floor((lo + hi) / 2);
    if (x < items[mid]) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

function insort(items, x) {
  items.splice(bisect(items, x), 0, x);
}

function partialSort(items, k) {
  var smallest = [];
  for (var i = 0, len = items.length; i < len; ++i) {
    var item = items[i];
    if (smallest.length < k || item < smallest[smallest.length - 1]) {
      insort(smallest, item);
      if (smallest.length > k)
        smallest.splice(k, 1);
    }
  }
  return smallest;
}

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
  if (n < 2){
    return -1;
  }
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

function judgeShape(data) {
  //console.log(data);
  let h = convexhull.makeHull(coordinate(data));
  //console.log(h);
  let flat = flatness(h);
  console.log(flat);
  if (flat > .92) {
    return {
      description: "roughly circular",
      radius: Math.sqrt(shoelace(h) / Math.PI)
    };
  }
  else if (flat > .7) {
    let simple = deCoordinate(simplifyHull(h));
    let sides = simple.length;
    switch (true) {
      case sides == 3:
        return {
          description: "triangular",
          averageSideLength: (euclidDistance(simple[0], simple[1]) + euclidDistance(simple[1], simple[2]) + euclidDistance(simple[2], simple[0])) / 3
        };
      case sides == 4:
        let angle1 = getAngle(simple[0], simple[1]);
        let angle2 = getAngle(simple[1], simple[2]);
        let angle3 = getAngle(simple[2], simple[3]);
        let angle4 = getAngle(simple[3], simple[0]);
        let difference1 = angle2 - angle1;
        let difference2 = angle3 - angle2;
        let difference3 = angle4 - angle3;
        let difference4 = angle1 - angle4;
        //console.log(angle1, angle2, angle3, angle4)
        //console.log(difference1, difference2, difference3, difference4);
        if ((Math.abs(((difference1 + 720) % 360) - 270) < 15) && (Math.abs(((difference2 + 720) % 360) - 270) < 15) && (Math.abs(((difference3 + 720) % 360) - 270) < 15) && (Math.abs(((difference4 + 720) % 360) - 270) < 15)) {
          let distance1 = euclidDistance(simple[0], simple[1]);
          let distance2 = euclidDistance(simple[1], simple[2]);
          let distance3 = euclidDistance(simple[2], simple[3]);
          let distance4 = euclidDistance(simple[3], simple[0]);
          let average = (distance1 + distance2 + distance3 + distance4) / 4;
          if ((average * .91 < distance1 && distance1 < average * 1.1) && (average * .91 < distance2 && distance2 < average * 1.1) && (average * .91 < distance3 && distance3 < average * 1.1) && (average * .91 < distance4 && distance4 < average * 1.1)) {
            //console.log((angle1 % 90 + angle2 % 90 + angle3 % 90 + angle4 % 90) / 4);
            if ((((angle1 % 90 + angle2 % 90 + angle3 % 90 + angle4 % 90) / 4) > 25) && (((angle1 % 90 + angle2 % 90 + angle3 % 90 + angle4 % 90) / 4) < 65)) {
              return { description: "diamond" };
            }
            else {
              return { description: "square" };
            }
          }
          else {
            return { description: "rectangular" };
          }
        }
        else if (Math.abs((difference1 + 720) % 360 - (difference3 + 720) % 360) < 20 && Math.abs((difference2 + 720) % 360 - (difference4 + 720) % 360) < 20) {
          return { description: "parallelogram" };
        }
        else {
          return { description: "irregular quadrilateral" };
        }
      case sides == 5:
        return { description: "pentagon" };
      case sides > 5:
        let xData = [];
        let yData = [];
        for (let i = 0; i < data.length; i++) {
          xData.push(data[i][0]);
          yData.push(data[i][1]);
        }
        let slope = lin_reg(xData, yData)[1];
        switch (true) {
          case slope > 5 || slope < -5:
            return {
              description: "elliptical: vertical",
              slope: slope
            }
          case slope > .2:
            return {
              description: "elliptical: positively correlated",
              slope: slope
            }
          case slope < .2 && slope > -.2:
            return {
              description: "elliptical: horizontal",
              slope: slope
            }
          case slope < -.2:
            return {
              description: "elliptical: negatively correlated",
              slope: slope
            }
        }
    }
  }
  else {
    let xData = [];
    let yData = [];
    for (let i = 0; i < data.length; i++) {
      xData.push(data[i][0]);
      yData.push(data[i][1]);
    }
    let slope = lin_reg(xData, yData)[1];
    switch (true) {
      case slope > 5 || slope < -5:
        return {
          description: "roughly linear: vertical",
          slope: slope
        }
      case slope > .2:
        return {
          description: "roughly linear: positively correlated",
          slope: slope
        }
      case slope < .2 && slope > -.2:
        return {
          description: "roughly linear: horizontal",
          slope: slope
        }
      case slope < -.2:
        return {
          description: "roughly linear: negatively correlated",
          slope: slope
        }
    }
  }
}

function deCoordinate(array){
  //Removes x-y coordinates from arrays
  if (Array.isArray(array[0])){
      return array;
    }  
  var dataArray = [];
  for (let i = 0; i < array.length; i++) {
    dataArray.push([array[i]["x"], array[i]["y"]])
  }
  return dataArray;
}

function coordinate(array) {
  //Adds x-y coordinates to arrays
  if (!(Array.isArray(array[0]))) {
      return array;
  }
  var dataArray = [];
  for (let i = 0; i < array.length; i++) {
      dataArray.push({ x: array[i][0], y: array[i][1] })
  }
  return dataArray;
}

/*
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
*/
function getRegion(data){
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
           //regions.push("bottom left");
           regions.push(0);
           break;
      case JSON.stringify(test) == JSON.stringify([false, true, true, true]) :
           //regions.push("bottom center");
           regions.push(1);
           break;
      case JSON.stringify(test) == JSON.stringify([false, false, true, true]) :
           //regions.push("bottom right");
           regions.push(2);
           break;
      case JSON.stringify(test) == JSON.stringify([true, true, false, true]) :
           //regions.push("left");
           regions.push(3);
           break;
      case JSON.stringify(test) == JSON.stringify([false, true, false, true]) :
           //regions.push("center");
           regions.push(4);
           break;
      case JSON.stringify(test) == JSON.stringify([false, false, false, true]) :
           //regions.push("right");
           regions.push(5);
           break;
      case JSON.stringify(test) == JSON.stringify([true, true, false, false]) :
           //regions.push("top left");
           regions.push(6);
           break;
      case JSON.stringify(test) == JSON.stringify([false, true, false, false]) :
           //regions.push("top center");
           regions.push(7);
           break;
      case JSON.stringify(test) == JSON.stringify([false, false, false, false]) :
           //regions.push("top right");
           regions.push(8);
    }
  }
  return regions;
}

function judgeRegion(regionIDS){
  let regions = [];
  let n = data.length;
  for (let i = 0; i < n; i++){
    let regionID = regionIDS[i];
    switch(true){
      case regionID == 0:
           regions.push("bottom left");
           break;
      case regionID == 1:
           regions.push("bottom center");
           break;
      case regionID == 2:
           regions.push("bottom right");
           break;
      case regionID == 3:
           regions.push("left");
           break;
      case regionID == 4:
           regions.push("center");
           break;
      case regionID == 5:
           regions.push("right");
           break;
      case regionID == 6:
           regions.push("top left");
           break;
      case regionID == 7:
           regions.push("top center");
           break;
      case regionID == 8:
           regions.push("top right");
    }
  }
  return regions;
}


function getAngle(x, y){
  const subtraction = y.map((num, index) => num - x[index]);
  let angle = 0;
  if (subtraction[0] == 0 && subtraction[1] > 0){
    return 90;
  }
  else if (subtraction[0] == 0 && subtraction[1] < 0){
    return 270;
  }
  else if (subtraction[1] == 0 && subtraction[0] >= 0){
      return 0
  }
  else if (subtraction[1] == 0 && subtraction[0] < 0){
      return 180
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
  return angle;
}


function judgeAngle(x, y){
  angle = getAngle(x,y);
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

function simplifyHull(inputShell){
  let shell = deCoordinate(inputShell);
  let n = shell.length;
  let precision = 15;
  let angle1 = 0;
  let angle2 = 0;
  let difference = 0;
  //Trims vertices from the shell which change the angle of the incoming line by less than precision degrees
  for (let i = 0; i < n; i++){
      angle1 = getAngle(shell[i % n], shell[(i + 1) % n]);
      angle2 = getAngle(shell[(i + 1) % n], shell[(i + 2) % n]);
      difference = angle2 - angle1;
      if ((Math.abs(difference) < precision) || (Math.abs(difference + 360) < precision) || (Math.abs(difference - 360) < precision)){
          shell.splice((i + 1) % n, 1);
          i--;
          n--;
      }
  }   

  //'Fills in' small edges near corners
  let peri = perimeter(coordinate(shell));
  for (let i = 0; i < n; i++) {
    if (euclidDistance(shell[(i + 1) % n], shell[(i + 2) % n]) < (peri / 16)) {
      angle1 = getAngle(shell[i % n], shell[(i + 1) % n]);
      angle2 = getAngle(shell[(i + 2) % n], shell[(i + 3) % n]);
      difference = angle2 - angle1;
      if (!(160 < ((difference + 720) % 360) && ((difference + 720) % 360) < 200)) {
        let newPoint = completeAngle(shell[i % n], shell[(i + 1) % n], shell[(i + 2) % n], shell[(i + 3) % n])
        shell[(i + 1) % n] = newPoint;
        shell.splice((i + 2) % n, 1);
        i--;
        n--;
      }
    }
  }
  return coordinate(shell);    
}


function completeAngle(p1, p2, p3, p4) {
  //Calculates and returns the intersection point of the lines bridging p1-p2 and p3-p4.
  //See derivation here: https://www.desmos.com/calculator/vmgoniltui If whoever's reading this has an easier way to do this let me know

  if (p1.x !== undefined) { p1 = [p1.x, p1.y] }
  if (p2.x !== undefined) { p2 = [p2.x, p2.y] }
  if (p3.x !== undefined) { p3 = [p3.x, p3.y] }
  if (p4.x !== undefined) { p4 = [p4.x, p4.y] }

  //Handles edge case when two points are aligned vertically
  if ((p2[0] - p1[0]) == 0) {
      if ((p4[0] - p3[0]) == 0) {
          //This should never happen if used on a convex polygon
          return -1;
      }
      return (p4[1] - p3[1]) / (p4[0] - p3[0]) * p1[0] + p3[1] - (p4[1] - p3[1]) / (p4[0] - p3[0]) * p3[0];
  }

  if ((p4[0] - p3[0]) == 0) {
      return (p2[1] - p1[1]) / (p2[0] - p1[0]) * p3[0] + p1[1] - (p2[1] - p1[1]) / (p2[0] - p1[0]) * p1[0];
  }

  let slope12 = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  let slope34 = (p4[1] - p3[1]) / (p4[0] - p3[0]);
  if ((slope12 - slope34) == 0) {
      //This should also never happen if used on a convex polygon
      return -1;
  }
  let x = (p1[1] - p3[1] - slope12 * p1[0] + slope34 * p3[0]) / (slope34 - slope12);
  let newPoint = [x, slope12 * x + p1[1] - slope12 * p1[0]];
  return newPoint;
}
  
function lin_reg(x, y) {
    //Get slope and intercept from x and y arrays.  
    let x_sum = 0;
    let y_sum = 0;
    let xy_sum = 0;
    let x2_sum = 0;
    const n = x.length;
    let i = 0;
    for (i = 0; i < n; i++) {
        let x_val = x[i];
        let y_val = y[i];
        x_sum += x_val;
        y_sum += y_val;
        xy_sum += x_val * y_val;
        x2_sum += x_val * x_val;
    }
    let slope = (n * xy_sum - x_sum * y_sum) / (n * x2_sum - x_sum * x_sum);
    let intercept = (y_sum / n) - slope * (x_sum / n);
    return [intercept, slope];
}

function residuals(x, y) {
    //Get residuals from x and y arrays from a simple linear regression.
    let lin = lin_reg(x, y);
    let slope = lin[1];
    let intercept = lin[0];
    let residuals = [];
    let i = 0;
    const n = x.length;
    for (i = 0; i < n; i++) {
        residuals.push(y[i] - (x[i] * slope + intercept))
    }
    return residuals;
}

function mean(x) {
    //Get mean of array
    let i = 0;
    let sum = 0;
    const n = x.length;
    for (i = 0; i < n; i++) {
        sum += x[i]
    }
    return sum / n;
}

function rSquared(x, y) {
    //Calculates R^2 of x and y arrays from a simple linear regression.
    if (x.length != y.length){
        return "Error: Array lengths do not match";
    }
    let resid = residuals(x, y)
    let squared_resid_sum = 0;
    let sum_of_squares_total = 0;
    let y_mean = mean(y);
    let i = 0;
    const n = x.length;
    for (i = 0; i < n; i++) {
        squared_resid_sum += resid[i] ** 2;
        sum_of_squares_total += (y[i] - y_mean) ** 2
    }
    return (squared_resid_sum / sum_of_squares_total);
}


function findHoles(cluster) {
  //Returns a list of the lar
  let clusterData = coordinate(cluster.dataPoints);

  var voronoi = new Voronoi();
  //var bbox = { xl: 500000, xr: 750000, yt: 450000, yb: 700000 }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
  var bbox = { xl: cluster.xMin - .1, xr: cluster.xMax + .1, yt: cluster.yMax + .1, yb: cluster.yMin - .1}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
  var sites = clusterData;


  var diagram = voronoi.compute(sites, bbox);
  console.log(JSON.parse(JSON.stringify(diagram)));
  let shell = convexhull.makeHull(coordinate(clusterData))
  //var polygon = deCoordinate(shell);

  let edgePoints = [];
  let verticesInside = [];

  //console.log(JSON.parse(JSON.stringify(edgePoints)));
  for (let edge of diagram.edges) {
    let va = [edge.va.x, edge.va.y];
    let vb = [edge.vb.x, edge.vb.y];
    let n = shell.length;
    for (let i = 0; i < n; i++) {
      let intersection = completeAngle(va, vb, shell[i % n], shell[(i + 1) % n])
      if (((intersection[0] > va[0] && intersection[0] < vb[0]) || (intersection[0] < va[0] && intersection[0] > vb[0])) && ((intersection[1] > va[1] && intersection[1] < vb[1]) || (intersection[1] < va[1] && intersection[1] > vb[1]))) {
        edgePoints.push(intersection);
      }
    }
  }



  for (point of deCoordinate(diagram.vertices)) {
    if (classifyPoint(deCoordinate(shell), point) < 1) {
      verticesInside.push(point);
    }
  }


  for (point of edgePoints) {
    if (classifyPoint(deCoordinate(shell), point) < 1) {
      verticesInside.push(point);
    }
  }


  //console.log(JSON.parse(JSON.stringify(verticesInside)));


  let minsArray = [];
  for (let vertexID in verticesInside) {
    let vertex = verticesInside[vertexID];
    let min = [0, 0];
    for (let point of deCoordinate(clusterData)) {
      if (min[1] == 0) {
        min = [vertexID, euclidDistance(vertex, point)]
      }
      else if (min[1] > euclidDistance(vertex, point)) {
        min = [vertexID, euclidDistance(vertex, point)]
      }
    }
    minsArray.push(min);
  }


  let sorted = minsArray.sort((a, b) => {return b[1] - a[1]})
  let closest = []
  for (let i = 0; i < 10; i++){
    closest.push([verticesInside[sorted[i][0]], sorted[i][1]])
  }

  return(closest);
}
},{"csvjson-csv2json":2,"robust-point-in-polygon":4}],2:[function(require,module,exports){
(function() {
  /**
   *
   * Node:
   * const csv2json = require('./csv2json.js');
   * csv2json(csv, options)
   *
   * Browser:
   * CSVJSON.csv2json(csv, options)
   *
   * Converts CSV to JSON. Returns an object. Use JSON.stringify to convert to a string.
   *
   * Available options:
   *  - separator: Optional. Character which acts as separator. If omitted,
   *               will attempt to detect comma (,), semi-colon (;) or tab (\t).
   *  - parseNumbers: Optional. Will attempt to convert a value to a number, if possible.
   *  - parseJSON: Optional. Will attempt to convert a value to a valid JSON value if possible.
   *               Detects numbers, null, false, true, [] and {}.
   *  - transpose: Optional. Will pivot the table. Default is false.
   *  - hash: Optional. Will use the first column as a key and return a hash instead of
   *               an array of objects. Default is false.
   *
   * Copyright (c) 2014-2019 Martin Drapeau
   *
   */

  var errorDetectingSeparator = "We could not detect the separator.",
      errorNotWellFormed = "CSV is not well formed",
      errorEmpty = "Empty CSV. Please provide something.",
      errorEmptyHeader = "Could not detect header. Ensure first row cotains your column headers.",
      separators = [",", ";", "\t"],
      pegjsSeparatorNames = {
        ",": "comma",
        ";": "semicolon",
        "\t": "tab"
      };

  // Picks the separator we find the most.
  function detectSeparator(csv) {
    var counts = {},
        sepMax;
    separators.forEach(function(sep, i) {
      var re = new RegExp(sep, 'g');
      counts[sep] = (csv.match(re) || []).length;
      sepMax = !sepMax || counts[sep] > counts[sepMax] ? sep : sepMax;
    });
    return sepMax;
  }

  // Source: https://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function
  function zip() {
    var args = [].slice.call(arguments);
    var longest = args.reduce(function(a,b) {
      return a.length>b.length ? a : b;
    }, []);

    return longest.map(function(_,i) {
      return args.map(function(array) {
        return array[i];
      });
    });
  }

  function uniquify(keys) {
    var counts = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (counts[key] === undefined) {
        counts[key] = 0;
      } else {
        counts[key]++;
      }
    }

    var result = [];
    for (var i = keys.length-1; i >= 0; i--) {
      var key = keys[i];
      if (counts[key] > 0) key = key + '__' + counts[key]--;
      result.unshift(key);
    }

    return result;
  }

  function convert(csv, options) {
    options || (options = {});
    if (csv.length == 0) throw errorEmpty;

    var separator = options.separator || detectSeparator(csv);
    if (!separator) throw errorDetectingSeparator;

    var a = [];
    try {
      var a = csvParser.parse(csv, pegjsSeparatorNames[separator]);
    } catch(error) {
      var start = csv.lastIndexOf('\n', error.offset),
          end = csv.indexOf('\n', error.offset),
          line = csv.substring(start >= -1 ? start : 0, end > -1 ? end : csv.length);
      throw error.message + ' On line ' + error.line + ' and column ' + error.column + '.\n' + line;
    }

    if (options.transpose) a = zip.apply(this, a);

    var keys = a.shift();
    if (keys.length == 0) throw errorEmptyHeader;
    keys = keys.map(function(key) {
      return key.trim().replace(/(^")|("$)/g, '');
    });

    keys = uniquify(keys);

    var	json = options.hash ? {} : [];
    for (var l = 0; l < a.length; l++) {
      var row = {},
      hashKey;
      for (var i = 0; i < keys.length; i++) {
        var value = (a[l][i]||'').trim().replace(/(^")|("$)/g, '');
        var number = value === "" ? NaN : value - 0;
        if (options.hash && i == 0) {
          hashKey = value;
        }
        else {
          if (options.parseJSON || options.parseNumbers && !isNaN(number)) {
            try {
              row[keys[i]] = JSON.parse(value);
            } catch(error) {
              row[keys[i]] = value;
            }
          }
          else {
            row[keys[i]] = value;
          }
        }
      }
      if (options.hash)
        json[hashKey] = row;
      else
        json.push(row);
    }

    return json;
  };

  var csvParser = (function(){
    /*
     * Generated by PEG.js 0.7.0.
     *
     * http://pegjs.majda.cz/
     *
     * source: https://gist.github.com/trevordixon/3362830
     * Martin 2018-04-2: Added parse_semicolon function.
     *
     */
    
    function quote(s) {
      /*
       * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
       * string literal except for the closing quote character, backslash,
       * carriage return, line separator, paragraph separator, and line feed.
       * Any character may appear in the form of an escape sequence.
       *
       * For portability, we also escape escape all control and non-ASCII
       * characters. Note that "\0" and "\v" escape sequences are not used
       * because JSHint does not like the first and IE the second.
       */
       return '"' + s
        .replace(/\\/g, '\\\\')  // backslash
        .replace(/"/g, '\\"')    // closing quote character
        .replace(/\x08/g, '\\b') // backspace
        .replace(/\t/g, '\\t')   // horizontal tab
        .replace(/\n/g, '\\n')   // line feed
        .replace(/\f/g, '\\f')   // form feed
        .replace(/\r/g, '\\r')   // carriage return
        .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
        + '"';
    }
    
    var result = {
      /*
       * Parses the input with a generated parser. If the parsing is successfull,
       * returns a value explicitly or implicitly specified by the grammar from
       * which the parser was generated (see |PEG.buildParser|). If the parsing is
       * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
       */
      parse: function(input, startRule) {
        var parseFunctions = {
          "comma": parse_comma,
          "semicolon": parse_semicolon,
          "tab": parse_tab,
          "sv": parse_sv,
          "line": parse_line,
          "field": parse_field,
          "char": parse_char
        };
        
        if (startRule !== undefined) {
          if (parseFunctions[startRule] === undefined) {
            throw new Error("Invalid rule name: " + quote(startRule) + ".");
          }
        } else {
          startRule = "comma";
        }
        
        var pos = 0;
        var reportFailures = 0;
        var rightmostFailuresPos = 0;
        var rightmostFailuresExpected = [];
        
        function padLeft(input, padding, length) {
          var result = input;
          
          var padLength = length - input.length;
          for (var i = 0; i < padLength; i++) {
            result = padding + result;
          }
          
          return result;
        }
        
        function escape(ch) {
          var charCode = ch.charCodeAt(0);
          var escapeChar;
          var length;
          
          if (charCode <= 0xFF) {
            escapeChar = 'x';
            length = 2;
          } else {
            escapeChar = 'u';
            length = 4;
          }
          
          return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
        }
        
        function matchFailed(failure) {
          if (pos < rightmostFailuresPos) {
            return;
          }
          
          if (pos > rightmostFailuresPos) {
            rightmostFailuresPos = pos;
            rightmostFailuresExpected = [];
          }
          
          rightmostFailuresExpected.push(failure);
        }
        
        function parse_comma() {
          var result0, result1;
          var pos0, pos1;
          
          pos0 = pos;
          pos1 = pos;
          result0 = (function(offset) { return separator = ','; })(pos) ? "" : null;
          if (result0 !== null) {
            result1 = parse_sv();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, sv) { return sv; })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          return result0;
        }
        
        function parse_semicolon() {
          var result0, result1;
          var pos0, pos1;
          
          pos0 = pos;
          pos1 = pos;
          result0 = (function(offset) { return separator = ';'; })(pos) ? "" : null;
          if (result0 !== null) {
            result1 = parse_sv();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, sv) { return sv; })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          return result0;
        }
        
        function parse_tab() {
          var result0, result1;
          var pos0, pos1;
          
          pos0 = pos;
          pos1 = pos;
          result0 = (function(offset) { return separator = '\t'; })(pos) ? "" : null;
          if (result0 !== null) {
            result1 = parse_sv();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, sv) { return sv; })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          return result0;
        }
        
        function parse_sv() {
          var result0, result1, result2, result3, result4;
          var pos0, pos1, pos2, pos3;
          
          pos0 = pos;
          pos1 = pos;
          result0 = [];
          if (/^[\n\r]/.test(input.charAt(pos))) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("[\\n\\r]");
            }
          }
          while (result1 !== null) {
            result0.push(result1);
            if (/^[\n\r]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[\\n\\r]");
              }
            }
          }
          if (result0 !== null) {
            result1 = parse_line();
            if (result1 !== null) {
              result2 = [];
              pos2 = pos;
              pos3 = pos;
              if (/^[\n\r]/.test(input.charAt(pos))) {
                result4 = input.charAt(pos);
                pos++;
              } else {
                result4 = null;
                if (reportFailures === 0) {
                  matchFailed("[\\n\\r]");
                }
              }
              if (result4 !== null) {
                result3 = [];
                while (result4 !== null) {
                  result3.push(result4);
                  if (/^[\n\r]/.test(input.charAt(pos))) {
                    result4 = input.charAt(pos);
                    pos++;
                  } else {
                    result4 = null;
                    if (reportFailures === 0) {
                      matchFailed("[\\n\\r]");
                    }
                  }
                }
              } else {
                result3 = null;
              }
              if (result3 !== null) {
                result4 = parse_line();
                if (result4 !== null) {
                  result3 = [result3, result4];
                } else {
                  result3 = null;
                  pos = pos3;
                }
              } else {
                result3 = null;
                pos = pos3;
              }
              if (result3 !== null) {
                result3 = (function(offset, data) { return data; })(pos2, result3[1]);
              }
              if (result3 === null) {
                pos = pos2;
              }
              while (result3 !== null) {
                result2.push(result3);
                pos2 = pos;
                pos3 = pos;
                if (/^[\n\r]/.test(input.charAt(pos))) {
                  result4 = input.charAt(pos);
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("[\\n\\r]");
                  }
                }
                if (result4 !== null) {
                  result3 = [];
                  while (result4 !== null) {
                    result3.push(result4);
                    if (/^[\n\r]/.test(input.charAt(pos))) {
                      result4 = input.charAt(pos);
                      pos++;
                    } else {
                      result4 = null;
                      if (reportFailures === 0) {
                        matchFailed("[\\n\\r]");
                      }
                    }
                  }
                } else {
                  result3 = null;
                }
                if (result3 !== null) {
                  result4 = parse_line();
                  if (result4 !== null) {
                    result3 = [result3, result4];
                  } else {
                    result3 = null;
                    pos = pos3;
                  }
                } else {
                  result3 = null;
                  pos = pos3;
                }
                if (result3 !== null) {
                  result3 = (function(offset, data) { return data; })(pos2, result3[1]);
                }
                if (result3 === null) {
                  pos = pos2;
                }
              }
              if (result2 !== null) {
                result3 = [];
                if (/^[\n\r]/.test(input.charAt(pos))) {
                  result4 = input.charAt(pos);
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("[\\n\\r]");
                  }
                }
                while (result4 !== null) {
                  result3.push(result4);
                  if (/^[\n\r]/.test(input.charAt(pos))) {
                    result4 = input.charAt(pos);
                    pos++;
                  } else {
                    result4 = null;
                    if (reportFailures === 0) {
                      matchFailed("[\\n\\r]");
                    }
                  }
                }
                if (result3 !== null) {
                  result0 = [result0, result1, result2, result3];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, first, rest) { rest.unshift(first); return rest; })(pos0, result0[1], result0[2]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          return result0;
        }
        
        function parse_line() {
          var result0, result1, result2, result3, result4;
          var pos0, pos1, pos2, pos3;
          
          pos0 = pos;
          pos1 = pos;
          result0 = parse_field();
          if (result0 !== null) {
            result1 = [];
            pos2 = pos;
            pos3 = pos;
            if (input.length > pos) {
              result2 = input.charAt(pos);
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("any character");
              }
            }
            if (result2 !== null) {
              result3 = (function(offset, char) { return char == separator; })(pos, result2) ? "" : null;
              if (result3 !== null) {
                result4 = parse_field();
                if (result4 !== null) {
                  result2 = [result2, result3, result4];
                } else {
                  result2 = null;
                  pos = pos3;
                }
              } else {
                result2 = null;
                pos = pos3;
              }
            } else {
              result2 = null;
              pos = pos3;
            }
            if (result2 !== null) {
              result2 = (function(offset, char, text) { return text; })(pos2, result2[0], result2[2]);
            }
            if (result2 === null) {
              pos = pos2;
            }
            while (result2 !== null) {
              result1.push(result2);
              pos2 = pos;
              pos3 = pos;
              if (input.length > pos) {
                result2 = input.charAt(pos);
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("any character");
                }
              }
              if (result2 !== null) {
                result3 = (function(offset, char) { return char == separator; })(pos, result2) ? "" : null;
                if (result3 !== null) {
                  result4 = parse_field();
                  if (result4 !== null) {
                    result2 = [result2, result3, result4];
                  } else {
                    result2 = null;
                    pos = pos3;
                  }
                } else {
                  result2 = null;
                  pos = pos3;
                }
              } else {
                result2 = null;
                pos = pos3;
              }
              if (result2 !== null) {
                result2 = (function(offset, char, text) { return text; })(pos2, result2[0], result2[2]);
              }
              if (result2 === null) {
                pos = pos2;
              }
            }
            if (result1 !== null) {
              result2 = (function(offset, first, rest) { return !!first || rest.length; })(pos, result0, result1) ? "" : null;
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, first, rest) { rest.unshift(first); return rest; })(pos0, result0[0], result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          return result0;
        }
        
        function parse_field() {
          var result0, result1, result2;
          var pos0, pos1, pos2;
          
          pos0 = pos;
          pos1 = pos;
          if (input.charCodeAt(pos) === 34) {
            result0 = "\"";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\\"\"");
            }
          }
          if (result0 !== null) {
            result1 = [];
            result2 = parse_char();
            while (result2 !== null) {
              result1.push(result2);
              result2 = parse_char();
            }
            if (result1 !== null) {
              if (input.charCodeAt(pos) === 34) {
                result2 = "\"";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\"\\\"\"");
                }
              }
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, text) { return text.join(''); })(pos0, result0[1]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            result0 = [];
            pos1 = pos;
            pos2 = pos;
            if (/^[^\n\r]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[^\\n\\r]");
              }
            }
            if (result1 !== null) {
              result2 = (function(offset, char) { return char != separator; })(pos, result1) ? "" : null;
              if (result2 !== null) {
                result1 = [result1, result2];
              } else {
                result1 = null;
                pos = pos2;
              }
            } else {
              result1 = null;
              pos = pos2;
            }
            if (result1 !== null) {
              result1 = (function(offset, char) { return char; })(pos1, result1[0]);
            }
            if (result1 === null) {
              pos = pos1;
            }
            while (result1 !== null) {
              result0.push(result1);
              pos1 = pos;
              pos2 = pos;
              if (/^[^\n\r]/.test(input.charAt(pos))) {
                result1 = input.charAt(pos);
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("[^\\n\\r]");
                }
              }
              if (result1 !== null) {
                result2 = (function(offset, char) { return char != separator; })(pos, result1) ? "" : null;
                if (result2 !== null) {
                  result1 = [result1, result2];
                } else {
                  result1 = null;
                  pos = pos2;
                }
              } else {
                result1 = null;
                pos = pos2;
              }
              if (result1 !== null) {
                result1 = (function(offset, char) { return char; })(pos1, result1[0]);
              }
              if (result1 === null) {
                pos = pos1;
              }
            }
            if (result0 !== null) {
              result0 = (function(offset, text) { return text.join(''); })(pos0, result0);
            }
            if (result0 === null) {
              pos = pos0;
            }
          }
          return result0;
        }
        
        function parse_char() {
          var result0, result1;
          var pos0, pos1;
          
          pos0 = pos;
          pos1 = pos;
          if (input.charCodeAt(pos) === 34) {
            result0 = "\"";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\\"\"");
            }
          }
          if (result0 !== null) {
            if (input.charCodeAt(pos) === 34) {
              result1 = "\"";
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\"\\\"\"");
              }
            }
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset) { return '"'; })(pos0);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            if (/^[^"]/.test(input.charAt(pos))) {
              result0 = input.charAt(pos);
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("[^\"]");
              }
            }
          }
          return result0;
        }
        
        
        function cleanupExpected(expected) {
          expected.sort();
          
          var lastExpected = null;
          var cleanExpected = [];
          for (var i = 0; i < expected.length; i++) {
            if (expected[i] !== lastExpected) {
              cleanExpected.push(expected[i]);
              lastExpected = expected[i];
            }
          }
          return cleanExpected;
        }
        
        function computeErrorPosition() {
          /*
           * The first idea was to use |String.split| to break the input up to the
           * error position along newlines and derive the line and column from
           * there. However IE's |split| implementation is so broken that it was
           * enough to prevent it.
           */
          
          var line = 1;
          var column = 1;
          var seenCR = false;
          
          for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
            var ch = input.charAt(i);
            if (ch === "\n") {
              if (!seenCR) { line++; }
              column = 1;
              seenCR = false;
            } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
              line++;
              column = 1;
              seenCR = true;
            } else {
              column++;
              seenCR = false;
            }
          }
          
          return { line: line, column: column };
        }
        
        
          var separator = ',';
        
        
        var result = parseFunctions[startRule]();
        
        /*
         * The parser is now in one of the following three states:
         *
         * 1. The parser successfully parsed the whole input.
         *
         *    - |result !== null|
         *    - |pos === input.length|
         *    - |rightmostFailuresExpected| may or may not contain something
         *
         * 2. The parser successfully parsed only a part of the input.
         *
         *    - |result !== null|
         *    - |pos < input.length|
         *    - |rightmostFailuresExpected| may or may not contain something
         *
         * 3. The parser did not successfully parse any part of the input.
         *
         *   - |result === null|
         *   - |pos === 0|
         *   - |rightmostFailuresExpected| contains at least one failure
         *
         * All code following this comment (including called functions) must
         * handle these states.
         */
        if (result === null || pos !== input.length) {
          var offset = Math.max(pos, rightmostFailuresPos);
          var found = offset < input.length ? input.charAt(offset) : null;
          var errorPosition = computeErrorPosition();
          
          throw new this.SyntaxError(
            cleanupExpected(rightmostFailuresExpected),
            found,
            offset,
            errorPosition.line,
            errorPosition.column
          );
        }
        
        return result;
      },
      
      /* Returns the parser source code. */
      toSource: function() { return this._source; }
    };
    
    /* Thrown when a parser encounters a syntax error. */
    
    result.SyntaxError = function(expected, found, offset, line, column) {
      function buildMessage(expected, found) {
        var expectedHumanized, foundHumanized;
        
        switch (expected.length) {
          case 0:
            expectedHumanized = "end of input";
            break;
          case 1:
            expectedHumanized = expected[0];
            break;
          default:
            expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
              + " or "
              + expected[expected.length - 1];
        }
        
        foundHumanized = found ? quote(found) : "end of input";
        
        return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
      }
      
      this.name = "SyntaxError";
      this.expected = expected;
      this.found = found;
      this.message = buildMessage(expected, found);
      this.offset = offset;
      this.line = line;
      this.column = column;
    };
    
    result.SyntaxError.prototype = Error.prototype;
    
    return result;
  })();


  // CommonJS or Browser
  if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
          exports = module.exports = convert;
      }
      exports.csv2json = convert;
  } else {
    this.CSVJSON || (this.CSVJSON = {});
    this.CSVJSON.csv2json = convert;
  }

}).call(this);
},{}],3:[function(require,module,exports){
"use strict"

var twoProduct = require("two-product")
var robustSum = require("robust-sum")
var robustScale = require("robust-scale")
var robustSubtract = require("robust-subtract")

var NUM_EXPAND = 5

var EPSILON     = 1.1102230246251565e-16
var ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON
var ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON

function orientation_3(sum, prod, scale, sub) {
  return function orientation3Exact(m0, m1, m2) {
    var p = sum(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])))
    var n = sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0]))
    var d = sub(p, n)
    return d[d.length - 1]
  }
}

function orientation_4(sum, prod, scale, sub) {
  return function orientation4Exact(m0, m1, m2, m3) {
    var p = sum(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m3[2]))), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m3[2]))))
    var n = sum(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m3[2]))), sum(scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m2[2]))))
    var d = sub(p, n)
    return d[d.length - 1]
  }
}

function orientation_5(sum, prod, scale, sub) {
  return function orientation5Exact(m0, m1, m2, m3, m4) {
    var p = sum(sum(sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m2[2]), sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), -m3[2]), scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m4[2]))), m1[3]), sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m3[2]), scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m4[2]))), -m2[3]), scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m4[2]))), m3[3]))), sum(scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m3[2]))), -m4[3]), sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m3[2]), scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m4[2]))), m0[3]), scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m3[2]), scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), m4[2]))), -m1[3])))), sum(sum(scale(sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m4[2]))), m3[3]), sum(scale(sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m3[2]))), -m4[3]), scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m3[2]))), m0[3]))), sum(scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m3[2]))), -m1[3]), sum(scale(sum(scale(sum(prod(m1[1], m3[0]), prod(-m3[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m3[2]))), m2[3]), scale(sum(scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m2[2]))), -m3[3])))))
    var n = sum(sum(sum(scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m2[2]), sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), -m3[2]), scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m4[2]))), m0[3]), scale(sum(scale(sum(prod(m3[1], m4[0]), prod(-m4[1], m3[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m3[2]), scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), m4[2]))), -m2[3])), sum(scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m4[2]))), m3[3]), scale(sum(scale(sum(prod(m2[1], m3[0]), prod(-m3[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m3[0]), prod(-m3[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m3[2]))), -m4[3]))), sum(sum(scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m1[2]), sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), -m2[2]), scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m4[2]))), m0[3]), scale(sum(scale(sum(prod(m2[1], m4[0]), prod(-m4[1], m2[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m2[2]), scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), m4[2]))), -m1[3])), sum(scale(sum(scale(sum(prod(m1[1], m4[0]), prod(-m4[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m4[0]), prod(-m4[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m4[2]))), m2[3]), scale(sum(scale(sum(prod(m1[1], m2[0]), prod(-m2[1], m1[0])), m0[2]), sum(scale(sum(prod(m0[1], m2[0]), prod(-m2[1], m0[0])), -m1[2]), scale(sum(prod(m0[1], m1[0]), prod(-m1[1], m0[0])), m2[2]))), -m4[3]))))
    var d = sub(p, n)
    return d[d.length - 1]
  }
}

function orientation(n) {
  var fn =
    n === 3 ? orientation_3 :
    n === 4 ? orientation_4 : orientation_5

  return fn(robustSum, twoProduct, robustScale, robustSubtract)
}

var orientation3Exact = orientation(3)
var orientation4Exact = orientation(4)

var CACHED = [
  function orientation0() { return 0 },
  function orientation1() { return 0 },
  function orientation2(a, b) {
    return b[0] - a[0]
  },
  function orientation3(a, b, c) {
    var l = (a[1] - c[1]) * (b[0] - c[0])
    var r = (a[0] - c[0]) * (b[1] - c[1])
    var det = l - r
    var s
    if(l > 0) {
      if(r <= 0) {
        return det
      } else {
        s = l + r
      }
    } else if(l < 0) {
      if(r >= 0) {
        return det
      } else {
        s = -(l + r)
      }
    } else {
      return det
    }
    var tol = ERRBOUND3 * s
    if(det >= tol || det <= -tol) {
      return det
    }
    return orientation3Exact(a, b, c)
  },
  function orientation4(a,b,c,d) {
    var adx = a[0] - d[0]
    var bdx = b[0] - d[0]
    var cdx = c[0] - d[0]
    var ady = a[1] - d[1]
    var bdy = b[1] - d[1]
    var cdy = c[1] - d[1]
    var adz = a[2] - d[2]
    var bdz = b[2] - d[2]
    var cdz = c[2] - d[2]
    var bdxcdy = bdx * cdy
    var cdxbdy = cdx * bdy
    var cdxady = cdx * ady
    var adxcdy = adx * cdy
    var adxbdy = adx * bdy
    var bdxady = bdx * ady
    var det = adz * (bdxcdy - cdxbdy)
            + bdz * (cdxady - adxcdy)
            + cdz * (adxbdy - bdxady)
    var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
                  + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
                  + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz)
    var tol = ERRBOUND4 * permanent
    if ((det > tol) || (-det > tol)) {
      return det
    }
    return orientation4Exact(a,b,c,d)
  }
]

function slowOrient(args) {
  var proc = CACHED[args.length]
  if(!proc) {
    proc = CACHED[args.length] = orientation(args.length)
  }
  return proc.apply(undefined, args)
}

function proc (slow, o0, o1, o2, o3, o4, o5) {
  return function getOrientation(a0, a1, a2, a3, a4) {
    switch (arguments.length) {
      case 0:
      case 1:
        return 0;
      case 2:
        return o2(a0, a1)
      case 3:
        return o3(a0, a1, a2)
      case 4:
        return o4(a0, a1, a2, a3)
      case 5:
        return o5(a0, a1, a2, a3, a4)
    }

    var s = new Array(arguments.length)
    for (var i = 0; i < arguments.length; ++i) {
      s[i] = arguments[i]
    }
    return slow(s)
  }
}

function generateOrientationProc() {
  while(CACHED.length <= NUM_EXPAND) {
    CACHED.push(orientation(CACHED.length))
  }
  module.exports = proc.apply(undefined, [slowOrient].concat(CACHED))
  for(var i=0; i<=NUM_EXPAND; ++i) {
    module.exports[i] = CACHED[i]
  }
}

generateOrientationProc()
},{"robust-scale":5,"robust-subtract":6,"robust-sum":7,"two-product":8}],4:[function(require,module,exports){
module.exports = robustPointInPolygon

var orient = require('robust-orientation')

function robustPointInPolygon(vs, point) {
  var x = point[0]
  var y = point[1]
  var n = vs.length
  var inside = 1
  var lim = n
  for(var i = 0, j = n-1; i<lim; j=i++) {
    var a = vs[i]
    var b = vs[j]
    var yi = a[1]
    var yj = b[1]
    if(yj < yi) {
      if(yj < y && y < yi) {
        var s = orient(a, b, point)
        if(s === 0) {
          return 0
        } else {
          inside ^= (0 < s)|0
        }
      } else if(y === yi) {
        var c = vs[(i+1)%n]
        var yk = c[1]
        if(yi < yk) {
          var s = orient(a, b, point)
          if(s === 0) {
            return 0
          } else {
            inside ^= (0 < s)|0
          }
        }
      }
    } else if(yi < yj) {
      if(yi < y && y < yj) {
        var s = orient(a, b, point)
        if(s === 0) {
          return 0
        } else {
          inside ^= (s < 0)|0
        }
      } else if(y === yi) {
        var c = vs[(i+1)%n]
        var yk = c[1]
        if(yk < yi) {
          var s = orient(a, b, point)
          if(s === 0) {
            return 0
          } else {
            inside ^= (s < 0)|0
          }
        }
      }
    } else if(y === yi) {
      var x0 = Math.min(a[0], b[0])
      var x1 = Math.max(a[0], b[0])
      if(i === 0) {
        while(j>0) {
          var k = (j+n-1)%n
          var p = vs[k]
          if(p[1] !== y) {
            break
          }
          var px = p[0]
          x0 = Math.min(x0, px)
          x1 = Math.max(x1, px)
          j = k
        }
        if(j === 0) {
          if(x0 <= x && x <= x1) {
            return 0
          }
          return 1 
        }
        lim = j+1
      }
      var y0 = vs[(j+n-1)%n][1]
      while(i+1<lim) {
        var p = vs[i+1]
        if(p[1] !== y) {
          break
        }
        var px = p[0]
        x0 = Math.min(x0, px)
        x1 = Math.max(x1, px)
        i += 1
      }
      if(x0 <= x && x <= x1) {
        return 0
      }
      var y1 = vs[(i+1)%n][1]
      if(x < x0 && (y0 < y !== y1 < y)) {
        inside ^= 1
      }
    }
  }
  return 2 * inside - 1
}
},{"robust-orientation":3}],5:[function(require,module,exports){
"use strict"

var twoProduct = require("two-product")
var twoSum = require("two-sum")

module.exports = scaleLinearExpansion

function scaleLinearExpansion(e, scale) {
  var n = e.length
  if(n === 1) {
    var ts = twoProduct(e[0], scale)
    if(ts[0]) {
      return ts
    }
    return [ ts[1] ]
  }
  var g = new Array(2 * n)
  var q = [0.1, 0.1]
  var t = [0.1, 0.1]
  var count = 0
  twoProduct(e[0], scale, q)
  if(q[0]) {
    g[count++] = q[0]
  }
  for(var i=1; i<n; ++i) {
    twoProduct(e[i], scale, t)
    var pq = q[1]
    twoSum(pq, t[0], q)
    if(q[0]) {
      g[count++] = q[0]
    }
    var a = t[1]
    var b = q[1]
    var x = a + b
    var bv = x - a
    var y = b - bv
    q[1] = x
    if(y) {
      g[count++] = y
    }
  }
  if(q[1]) {
    g[count++] = q[1]
  }
  if(count === 0) {
    g[count++] = 0.0
  }
  g.length = count
  return g
}
},{"two-product":8,"two-sum":9}],6:[function(require,module,exports){
"use strict"

module.exports = robustSubtract

//Easy case: Add two scalars
function scalarScalar(a, b) {
  var x = a + b
  var bv = x - a
  var av = x - bv
  var br = b - bv
  var ar = a - av
  var y = ar + br
  if(y) {
    return [y, x]
  }
  return [x]
}

function robustSubtract(e, f) {
  var ne = e.length|0
  var nf = f.length|0
  if(ne === 1 && nf === 1) {
    return scalarScalar(e[0], -f[0])
  }
  var n = ne + nf
  var g = new Array(n)
  var count = 0
  var eptr = 0
  var fptr = 0
  var abs = Math.abs
  var ei = e[eptr]
  var ea = abs(ei)
  var fi = -f[fptr]
  var fa = abs(fi)
  var a, b
  if(ea < fa) {
    b = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    b = fi
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
      fa = abs(fi)
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    a = fi
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
      fa = abs(fi)
    }
  }
  var x = a + b
  var bv = x - a
  var y = b - bv
  var q0 = y
  var q1 = x
  var _x, _bv, _av, _br, _ar
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei
      eptr += 1
      if(eptr < ne) {
        ei = e[eptr]
        ea = abs(ei)
      }
    } else {
      a = fi
      fptr += 1
      if(fptr < nf) {
        fi = -f[fptr]
        fa = abs(fi)
      }
    }
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
  }
  while(eptr < ne) {
    a = ei
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
    }
  }
  while(fptr < nf) {
    a = fi
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    } 
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
    }
  }
  if(q0) {
    g[count++] = q0
  }
  if(q1) {
    g[count++] = q1
  }
  if(!count) {
    g[count++] = 0.0  
  }
  g.length = count
  return g
}
},{}],7:[function(require,module,exports){
"use strict"

module.exports = linearExpansionSum

//Easy case: Add two scalars
function scalarScalar(a, b) {
  var x = a + b
  var bv = x - a
  var av = x - bv
  var br = b - bv
  var ar = a - av
  var y = ar + br
  if(y) {
    return [y, x]
  }
  return [x]
}

function linearExpansionSum(e, f) {
  var ne = e.length|0
  var nf = f.length|0
  if(ne === 1 && nf === 1) {
    return scalarScalar(e[0], f[0])
  }
  var n = ne + nf
  var g = new Array(n)
  var count = 0
  var eptr = 0
  var fptr = 0
  var abs = Math.abs
  var ei = e[eptr]
  var ea = abs(ei)
  var fi = f[fptr]
  var fa = abs(fi)
  var a, b
  if(ea < fa) {
    b = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    b = fi
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
      fa = abs(fi)
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    a = fi
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
      fa = abs(fi)
    }
  }
  var x = a + b
  var bv = x - a
  var y = b - bv
  var q0 = y
  var q1 = x
  var _x, _bv, _av, _br, _ar
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei
      eptr += 1
      if(eptr < ne) {
        ei = e[eptr]
        ea = abs(ei)
      }
    } else {
      a = fi
      fptr += 1
      if(fptr < nf) {
        fi = f[fptr]
        fa = abs(fi)
      }
    }
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
  }
  while(eptr < ne) {
    a = ei
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
    }
  }
  while(fptr < nf) {
    a = fi
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    } 
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
    }
  }
  if(q0) {
    g[count++] = q0
  }
  if(q1) {
    g[count++] = q1
  }
  if(!count) {
    g[count++] = 0.0  
  }
  g.length = count
  return g
}
},{}],8:[function(require,module,exports){
"use strict"

module.exports = twoProduct

var SPLITTER = +(Math.pow(2, 27) + 1.0)

function twoProduct(a, b, result) {
  var x = a * b

  var c = SPLITTER * a
  var abig = c - a
  var ahi = c - abig
  var alo = a - ahi

  var d = SPLITTER * b
  var bbig = d - b
  var bhi = d - bbig
  var blo = b - bhi

  var err1 = x - (ahi * bhi)
  var err2 = err1 - (alo * bhi)
  var err3 = err2 - (ahi * blo)

  var y = alo * blo - err3

  if(result) {
    result[0] = y
    result[1] = x
    return result
  }

  return [ y, x ]
}
},{}],9:[function(require,module,exports){
"use strict"

module.exports = fastTwoSum

function fastTwoSum(a, b, result) {
	var x = a + b
	var bv = x - a
	var av = x - bv
	var br = b - bv
	var ar = a - av
	if(result) {
		result[0] = ar + br
		result[1] = x
		return result
	}
	return [ar+br, x]
}
},{}]},{},[1]);
