//const silhouette = require('@robzzson/silhouette');
var csv2json = require('csvjson-csv2json');
var Plotly = require('plotly.js-dist');
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
var clusters = fizzscan.run(dataArray, 2*distAvg[minPts], minPts, true);


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



//Forms objects out of clusters, assigns properties, then adds them to a master list
for (let cluster of clusters){
  let clusterObject = {};
  let clusterData = [];
  for (let point of cluster){
    clusterData.push(dataArray[point]);
  }
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
  clusterObject.centroid = fizzscan.clusterCentroids[i];



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

  clusterObject.holes = findHoles(clusterObject);
  let largestHole = clusterObject.holes[0];
  let centroidDistance = euclidDistance(largestHole[0], clusterObject.centroid)
  let deCoHull = deCoordinate(clusterObject.hull)
  let maxDistance = euclidDistance(deCoHull[0], clusterObject.centroid);
  for (let hullPoint of deCoHull){
    if (maxDistance < euclidDistance(hullPoint, clusterObject.centroid)){
      maxDistance = euclidDistance(hullPoint, clusterObject.centroid);
    }
  }
  let largestHoleImportanceScore = largestHole[1] / maxDistance * (1- centroidDistance / maxDistance)
  let holeParameter = .2;
  if (largestHoleImportanceScore > holeParameter){
    clusterObject.hasSignificantHole = true;
  }
  else{
    clusterObject.hasSignificantHole = false;
  }

  masterArray.push(clusterObject);
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
    
    //Draws clustered points and outliers
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

    //Draws centroids of each cluster
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

    //Draws convex hulls around each cluster
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

    //Draws largest holes of each cluster
    for (let cluster of masterArray){
      for (let i = 0; i < 10; i++){
        ctx.fillStyle = palette[i];
        ctx.beginPath();
        ctx.ellipse(cluster.holes[i][0][0] / 1000, cluster.holes[i][0][1] / 1000, cluster.holes[i][1] / 1000, cluster.holes[i][1] / 1000, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        //ctx.ellipse(cluster.holes[i][0][0] / 1000, cluster.holes[i][0][1] / 1000, 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
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
  var bbox = { xl: cluster.xMin - .1, xr: cluster.xMax + .1, yt: cluster.yMax + .1, yb: cluster.yMin - .1}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
  var sites = clusterData;


  var diagram = voronoi.compute(sites, bbox);
  let shell = convexhull.makeHull(coordinate(clusterData))

  let edgePoints = [];
  let verticesInside = [];

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
  console.log(JSON.parse(JSON.stringify(sorted)));

  //Culls similar holes by removing hole centers that lie within the border of a larger hole.
  for (let pointID in sorted){
    let point = sorted[pointID];
    let i = Number(pointID) + 1;
    while (i < sorted.length){
      if (euclidDistance(verticesInside[point[0]], verticesInside[sorted[i][0]]) < point[1]){
        sorted.splice(i, 1);
        i--;
      }
      i++;
    }
  }

  console.log(JSON.parse(JSON.stringify(sorted)));

  let closest = []
  for (let i = 0; i < sorted.length; i++){
    closest.push([verticesInside[sorted[i][0]], sorted[i][1]])
  }

  return(closest);
}