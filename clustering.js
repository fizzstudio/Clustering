//var s1 = require('./s1.js')
//console.log(s1.data);
var clustering = require('./node_modules/density-clustering');
var csv2json = require('csvjson-csv2json');
const silhouette = require('@robzzson/silhouette');


//const data = csv2json(get());
const data = csv2json(d3Data);


let dataArray = [];
for (let i = 0; i < data.length; i++) {
  dataArray.push([data[i]["x"], data[i]["y"]])
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

/*
const NNcanvas = document.getElementById("NNCanvas");
    const NNctx = NNcanvas.getContext("2d");
    let dist = distAvg;
    NNcanvas.height = 300;
    NNcanvas.width=300;
    NNctx.transform(1, 0, 0, -1, 0, NNcanvas.height)
    NNctx.ellipse(0, 0, 3, 3, 0, 0, Math.PI * 2);
    NNctx.fill();
    for (i = 0; i<dist.length; i++){
      NNctx.beginPath(); 
      NNctx.fillStyle = "black";
      NNctx.ellipse(i*2, dist[i]*2, 1, 1, 0, 0, Math.PI * 2);
      NNctx.fill();
      //console.log(i, dist[i]);
    }
*/    

let minPts = 4;
/*
var dbscan = new clustering.DBSCAN();
var clusters = dbscan.run(dataArray, 2*distAvg[minPts], minPts);
console.log(clusters, dbscan.noise);
console.log(clusters.length);

var optics = new clustering.OPTICS();
var clusters = optics.run(dataArray, 4000, minPts);
var plot = optics.getReachabilityPlot();
console.log(clusters, plot);
*/
var fizzscan = new clustering.FIZZSCAN();
var clusters = fizzscan.run(dataArray, distAvg[minPts], minPts, true);
console.log(clusters, fizzscan.noise);
console.log(`Number of clusters: ${clusters.length}`)
console.log(`Total elements: ${clusters.flat().length + fizzscan.noise.length}`)
console.log(`Total clustered elements: ${clusters.flat().length}`)
console.log(`Total noise elements: ${fizzscan.noise.length}`)

var datasetCentroid = getCentroid(dataArray);

//console.log(Date.now());



var BCSS = 0;
var WCSS = 0;
for (var i = 0; i < clusters.length; i++){
  var clusteredData = [];
  for (var j = 0; j < clusters[i].length; j++){
    clusteredData.push(dataArray[clusters[i][j]])
  }
  BCSS += clusteredData.length * euclidDistance(getCentroid(clusteredData), datasetCentroid);
}
for (var i = 0; i < clusters.length; i++){
  var clusteredData = [];
  for (var j = 0; j < clusters[i].length; j++){
    clusteredData.push(dataArray[clusters[i][j]])
  }
  for (var j = 0; j < clusteredData.length; j++){
    WCSS += euclidDistance(clusteredData[j], getCentroid(clusteredData));
  }
  
}
CHI = BCSS*(dataArray.length-clusters.length)/(WCSS*(clusters.length-1))
console.log(`Calinski–Harabasz index: ${CHI}`)

//console.log(Date.now());

var silhouetteLabels = [];
for (var i = 0; i < dataArray.length; i++){
  silhouetteLabels.push(0);
}
for (var i = 0; i < clusters.length; i++){
  //console.log(i);
  for (var j = 0; j < clusters[i].length; j++){
    //console.log(j);
    silhouetteLabels[clusters[i][j]] = i;
  }
}
let silhouetteScore = silhouette(dataArray, silhouetteLabels);
console.log(`Sillhouette score: ${silhouetteScore}`);

//console.log(Date.now());




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
    const palette = ["red", "orange", "yellow", "green", "blue", "cyan", "darkblue", "pink", "darkmagenta", "chocolate", "dodgerblue", "gold", "firebrick", "lawngreen", "red", "orange", "yellow", "green", "blue", "cyan", "darkblue", "pink", "darkmagenta", "chocolate", "dodgerblue", "gold", "firebrick", "lawngreen"];

    for (let i = 0; i < xArray.length-1; i++) {
      let x = xArray[i]*30;
      let y = yArray[i]*30;
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
      let x = fizzscan.clusterCentroids[i][0]*30;
      let y = fizzscan.clusterCentroids[i][1]*30;
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
  //return distances.sort().slice(0, minPts);
};

function getCentroid(c) {
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




