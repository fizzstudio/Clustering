//const silhouette = require('@robzzson/silhouette');
//import { newPlot } from 'plotly.js-dist';
import csv2json from 'csvjson-csv2json';
import classifyPoint from "robust-point-in-polygon";
//import s1Data from "./s1.js";
import d10c from "./2d-10c.js";
import makeHull from "./convexhull.ts";
import { FIZZSCAN } from "./FIZZSCAN.ts";
import Voronoi from "./rhill-voronoi-core.js";
const data = csv2json(d10c);


let dataArray: Array<Array<number>> = [];
for (let i = 0; i < data.length; i++) {
    dataArray.push([Number(data[i]["x"]), Number(data[i]["y"])])
}

let minPts: number = 4;

//distAvg averges out the nearest neighbor distances over each point in the set
let distAvg: Array<number> = [];
let distanceStorage: Array<Array<number>> = [];

for (let i = 0; i < dataArray.length; i++) {
    distanceStorage.push(nNDistancesSpecial(dataArray, i, minPts))
}



for (let i = 0; i < dataArray.length; i++) {
    let sum: number = 0;
    for (let j = 0; j < dataArray.length; j++) {
        sum += distanceStorage[j][i];
    }
    distAvg.push(sum)
}
distAvg = distAvg.map((x) => x / dataArray.length)




var fizzscan = new FIZZSCAN();
var clusters = fizzscan.run(dataArray, 2 * distAvg[minPts], minPts, true);

console.log(`Clusters:`)
console.log(clusters);
console.log(`Noise:`)
console.log(fizzscan.noise);
console.log(`NoiseAssigned:`)
console.log(fizzscan.noiseAssigned);

console.log(`Number of clusters: ${clusters.length}`)
console.log(`Total elements: ${clusters.flat().length + fizzscan.noise.length}`)
console.log(`Total clustered elements: ${clusters.flat().length}`)
console.log(`Total noise elements: ${fizzscan.noise.length}`)

//var datasetCentroid = getCentroid(dataArray);

let clusterRegions: Array<number> = getRegion(fizzscan.clusterCentroids);
let clusterRegionsJudged: Array<string> = judgeRegion(clusterRegions);


console.log("-------------------------")
console.log("Individual Cluster Analysis")
console.log("-------------------------")



let masterArray: Array<clusterObject> = [];
let densitySorted: Array<clusterObject> = [];
let i: number = 0;
const palette: Array<string> = ["red", "orange", "yellow", "green", "blue", "cyan", "darkblue", "pink", "darkmagenta", "chocolate", "dodgerblue", "gold", "firebrick", "lawngreen", "red", "orange", "yellow", "green", "blue", "cyan", "darkblue", "pink", "darkmagenta", "chocolate", "dodgerblue", "gold", "firebrick", "lawngreen"];



//Forms objects out of clusters, assigns properties, then adds them to a master list
for (let cluster of clusters) {
    let clusterObject: clusterObject = {
        centroid: [0],
        dataPoints: [[0]],
        density: 0,
        densityRank: 0,
        hasSignificantHole: false,
        holes: [],
        hull: [],
        hullSimplified: [],
        id: 0,
        region: 0,
        regionDesc: "",
        relations: [{
            angle: 0,
            cardDirection: "",
            distance: 0,
            id: 0,
            isNeighbor: false
        }],
        shape: {description: ""},
        xMin: 0,
        xMax: 0,
        yMin: 0,
        yMax: 0
    };
    let clusterData: Array<Array<number>> = [];
    for (let point of cluster) {
        clusterData.push(dataArray[point]);
    }
    clusterObject.dataPoints = clusterData;
    let xMin: number = clusterData[0][0];
    let xMax: number = clusterData[0][0];
    let yMin: number = clusterData[0][1];
    let yMax: number = clusterData[0][1];
    for (let point of clusterData) {
        if (point[0] < xMin) {
            xMin = point[0];
        }
        if (point[0] > xMax) {
            xMax = point[0];
        }
        if (point[1] < yMin) {
            yMin = point[1];
        }
        if (point[1] > yMax) {
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
    let area: number = shoelace(coordinate(clusterData));
    let hull: Array<coord> = makeHull(coordinate(clusterData));
    clusterObject.hull = hull;
    let hullSimplified: Array<coord> = simplifyHull(hull);
    clusterObject.hullSimplified = hullSimplified;
    let shape: {description: string} = judgeShape(clusterData);
    console.log(`The shape of the data is ${shape.description}`)
    clusterObject.shape = shape;
    let density: number = cluster.length / area;
    clusterObject.density = density;
    clusterObject.relations = [];
    let closest: Array<number> = nNIndices(fizzscan.clusterCentroids, i);
    //clusterObject.nearestIndices = closest;
    let distances: Array<number> = nNDistances(fizzscan.clusterCentroids, i)
    //clusterObject.nearestDistances = distances;

    let angles: Array<number> = [];
    for (let j = 0; j < clusters.length; j++) {
        let angle: number = getAngle(fizzscan.clusterCentroids[i], fizzscan.clusterCentroids[closest[j]]);
        let card: string = judgeAngle(fizzscan.clusterCentroids[i], fizzscan.clusterCentroids[closest[j]]);
        angles.push(angle);
        clusterObject.relations.push({
            "id": closest[j],
            "distance": distances[j],
            "angle": angle,
            "cardDirection": card
        })
    }
    clusterObject.holes = findHoles(clusterObject);
    let largestHole: hole = clusterObject.holes[0];
    let centroidDistance = euclidDistance(largestHole[0], clusterObject.centroid)
    let deCoHull = deCoordinate(clusterObject.hull)
    let maxDistance = euclidDistance(deCoHull[0], clusterObject.centroid);
    for (let hullPoint of deCoHull) {
        if (maxDistance < euclidDistance(hullPoint, clusterObject.centroid)) {
            maxDistance = euclidDistance(hullPoint, clusterObject.centroid);
        }
    }
    let largestHoleImportanceScore = largestHole[1] / maxDistance * (1 - centroidDistance / maxDistance)
    console.log(`holeSignificanceScore: ${largestHoleImportanceScore}`)
    let holeParameter = .2;
    if (largestHoleImportanceScore > holeParameter) {
        clusterObject.hasSignificantHole = true;
    }
    else {
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

//Adds density rankings for each cluster to masterArray
let masterArrayClone: Array<clusterObject> = JSON.parse(JSON.stringify(masterArray));
densitySorted = masterArrayClone.sort((a, b) => {
    return a.density - b.density;
})

let densityIDs: Array<number> = [];
for (let cluster of densitySorted){
    densityIDs.push(cluster.id);
}
for (let cluster of masterArray) {
    cluster.densityRank = densityIDs.indexOf(cluster.id);
}



//Designates "neighbors" of each cluster and adds to masterArray
i = 0;
let neighborParameter: number = 1.2
for (let cluster of fizzscan.clusterCentroids) {
    let j: number = 0;
    for (let target of fizzscan.clusterCentroids) {
        let cloneCentroids: Array<Array<number>> = [];
        if (i == j) {
            masterArray[i].relations[0].isNeighbor = true;
            j++;
        }
        else {
            if (i < j) {
                cloneCentroids = [...fizzscan.clusterCentroids.slice(0, i), ...fizzscan.clusterCentroids.slice(i + 1)];
                cloneCentroids.splice(j - 1, 1);
            }
            if (i > j) {
                cloneCentroids = [...fizzscan.clusterCentroids.slice(0, j), ...fizzscan.clusterCentroids.slice(j + 1)];
                cloneCentroids.splice(i - 1, 1);
            }

            let directDistance: number = euclidDistance(cluster, target);
            let branchDistances: Array<number> = [];
            for (let branch of cloneCentroids) {
                if (euclidDistance(cluster, branch) < euclidDistance(cluster, target)) {
                    branchDistances.push(euclidDistance(cluster, branch) + euclidDistance(branch, target));
                }
            }
            let targetRelation: relation = {
                angle: 0,
                cardDirection: "",
                distance: 0,
                id: 0,
                isNeighbor: false
            };
            for (let relation of masterArray[i].relations) {
                if (relation.id == j) {
                    targetRelation = relation;
                }
            }
            if (Math.min(...branchDistances) < neighborParameter * directDistance) {
                masterArray[i].relations[masterArray[i].relations.indexOf(targetRelation)].isNeighbor = false;
            }
            else {
                masterArray[i].relations[masterArray[i].relations.indexOf(targetRelation)].isNeighbor = true;
            }
            j++;
        }
    }
    i++;
}


console.log(JSON.parse(JSON.stringify(masterArray)));
console.log("stop");


//Draws the main graph
let graphSize: number = 1000;

let canvas: HTMLCanvasElement | null = document.getElementById("myCanvas") as HTMLCanvasElement | null ;
if (canvas == null){
    throw new Error("Error: heatmap canvas element missing.")
}
else{
    canvas = canvas as HTMLCanvasElement}
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.height = 1000;
canvas.width = 1000;
ctx.transform(1, 0, 0, -1, 0, canvas.height)

let xArray: Array<number> = [];
let yArray: Array<number> = [];


for (let i = 0; i < dataArray.length; i++) {
    xArray.push(dataArray[i][0]);
    yArray.push(dataArray[i][1]);
}
let yMax: number = Math.max(...yArray);
let xMax: number = Math.max(...xArray);
let yMin: number = Math.min(...yArray);
let xMin: number = Math.min(...xArray);

//Draws clustered points and outliers
for (let i = 0; i < xArray.length - 1; i++) {
    let x: number = ((xArray[i] - xMin) / (xMax-xMin)) * graphSize;
    let y: number = ((yArray[i] - yMin) / (yMax-yMin)) * graphSize;

    ctx.beginPath();
    for (let j = 0; j < clusters.length; j++) {
        if (clusters[j].includes(i)) {
            ctx.fillStyle = palette[j];
            ctx.ellipse(x, y, 2, 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    if (fizzscan.noise.includes(i)) {
        ctx.fillStyle = "gray";
        ctx.ellipse(x, y, 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

//Draws centroids of each cluster


for (let i = 0; i < fizzscan.clusterCentroids.length; i++) {
    let x: number = ((fizzscan.clusterCentroids[i][0] - xMin) / (xMax-xMin)) * graphSize;
    let y: number = ((fizzscan.clusterCentroids[i][1] - yMin) / (yMax-yMin)) * graphSize;
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
for (let cluster of clusters) {
    let clusterData: Array<Array<number>> = [];
    for (let point of cluster) {
        clusterData.push(dataArray[point]);
    }
    let shell = makeHull(coordinate(clusterData));
    //shell = simplifyHull(shell);
    ctx.beginPath();
    ctx.moveTo(((shell[0].x - xMin) / (xMax-xMin)) * graphSize, ((shell[0].y - yMin) / (yMax-yMin)) * graphSize)
    for (let i = 0; i < shell.length; i++){
        let x: number = ((shell[i].x - xMin) / (xMax-xMin)) * graphSize;
        let y: number = ((shell[i].y - yMin) / (yMax-yMin)) * graphSize;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    ctx.lineTo(((shell[0].x - xMin) / (xMax-xMin)) * graphSize, ((shell[0].y - yMin) / (yMax-yMin)) * graphSize)
    ctx.stroke();
    ctx.closePath();

}

//Draws largest holes of each cluster
/*
for (let cluster of masterArray){
    for (let i = 0; i < 1; i++){
      ctx.beginPath();
      ctx.ellipse(((cluster.holes[i][0][0] - xMin) / (xMax-xMin)) * graphSize, ((cluster.holes[i][0][1] - yMin) / (yMax-yMin)) * graphSize, ((cluster.holes[i][1]) / (xMax-xMin)) * graphSize, ((cluster.holes[i][1]) / (xMax-xMin)) * graphSize, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.ellipse(((cluster.holes[i][0][0] - xMin) / (xMax-xMin)) * graphSize, ((cluster.holes[i][0][1] - yMin) / (yMax-yMin)) * graphSize, 4, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
*/

const precision: number = 50;
//generateHeatmap(dataArray, precision);





//Helper functions


function euclidDistance(p: Array<number>, q: Array<number>): number {
    //Returns euclidean distance between vectors p and q.
    var sum: number = 0;
    var i: number = Math.min(p.length, q.length);
    while (i--) {
        sum += (p[i] - q[i]) * (p[i] - q[i]);
    }

    return Math.sqrt(sum);
};

function nNDistances(dataset: Array<Array<number>>, pointId: number): Array<number> {
    //Returns list of distances from nearest neighbors for a point, sorted low to high.
    var distances: Array<number> = [];
    for (var id = 0; id < dataset.length; id++) {
        var dist: number = euclidDistance(dataset[pointId], dataset[id]);
        distances.push(dist);
    }
    let typedArray: Float32Array<ArrayBuffer> = Float32Array.from(distances)
    typedArray.sort((a, b) => { return a - b; });
    return Array.from(typedArray);

};

function nNDistancesSpecial(dataset: Array<Array<number>>, pointId: number, minPts: number): Array<number> {
    //Returns list of distances from nearest neighbors for a point, sorted low to high.
    var distances: Array<number> = [];
    for (var id = 0; id < dataset.length; id++) {
        var dist = euclidDistance(dataset[pointId], dataset[id]);
        distances.push(dist);
    }
    let typedArray = Float32Array.from(distances)
    if (minPts < 100) return partialSort(Array.from(typedArray), 2 * minPts);
    else return Array.from(typedArray.sort((a, b) => { return a - b; }));
};


function bisect(items: Array<number>, x: number, lo?: number, hi?: number): number {
    var mid: number;
    if (typeof (lo) == 'undefined') lo = 0;
    if (typeof (hi) == 'undefined') hi = items.length;
    while (lo < hi) {
        mid = Math.floor((lo + hi) / 2);
        if (x < items[mid]) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

function insort(items: Array<number>, x: number): void {
    items.splice(bisect(items, x), 0, x);
}

function partialSort(items: Array<number>, k: number): Array<number> {
    var smallest: Array<number> = [];
    for (var i = 0, len = items.length; i < len; ++i) {
        var item: number = items[i];
        if (smallest.length < k || item < smallest[smallest.length - 1]) {
            insort(smallest, item);
            if (smallest.length > k)
                smallest.splice(k, 1);
        }
    }
    return smallest;
}

function nNIndices(dataset: Array<Array<number>>, pointId: number): Array<number> {
    //Returns list of nearest indices to a point, sorted low to high, including the point itself.
    var distances: Array<Array<number>> = [];
    for (var id = 0; id < dataset.length; id++) {
        var dist: Array<number> = [id, euclidDistance(dataset[pointId], dataset[id])];
        distances.push(dist);
    }

    distances = distances.sort((a, b) => {return a[1] - b[1];});
    let indices: Array<number> = [];
    for (let i = 0; i < dataset.length; i++) {
        indices.push(distances[i][0]);
    }
    return indices;
};


//Various functions relating to calculating measure-of-fit for a particularing clustering
/*
function getCentroid(dataset: Array<Array<number>>): Array<number> {
    //Calculates centroid point of a data set
    var centroid = [];
    var i = 0;
    var j = 0;
    var l = dataset.length;

    for (i = 0; i < l; i++) {
        for (j = 0; j < c[i].length; j++) {
            if (centroid[j] !== undefined) {
                centroid[j] += dataset[i][j] / l;
            }
            else {
                centroid.push(0);
                centroid[j] += dataset[i][j] / l;
            }
        }
    }
    return centroid;
}
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

function shoelace(data: Array<coord>): number {
    //Calculates area from set of points, intended to be used on convex hull with points ordered either c-wise or cc-wise
    let sum: number = 0;
    let n: number = data.length;
    for (let i = 0; i < n - 1; i++) {
        sum += data[i].x * data[i + 1].y - data[i].y * data[i + 1].x
    }
    sum += data[n - 1].x * data[0].y - data[n - 1].y * data[0].x
    return Math.abs(sum / 2);
}

function perimeter(data: Array<coord>): number {
    //Calculates perimeter from set of points, intended to be used on convex hull with points ordered either c-wise or cc-wise
    let sum: number = 0;
    let n: number = data.length;
    if (n < 2) {
        return 0;
    }
    if (n == 2) {
        return euclidDistance([data[0].x, data[0].y], [data[1].x, data[1].y])
    }
    for (let i = 0; i < n - 1; i++) {
        let pointer: Array<number> = [data[i].x, data[i].y];
        let next: Array<number> = [data[i + 1].x, data[i + 1].y];
        sum += euclidDistance(pointer, next);
    }
    sum += euclidDistance([data[n - 1].x, data[n - 1].y], [data[0].x, data[0].y])
    return sum;
}

function flatness(data: Array<coord>): number {
    //Gets flatness coefficient from perimeter and area
    return 2 * Math.sqrt(shoelace(data) * Math.PI) / perimeter(data);
}

function judgeShape(data: Array<Array<number>>): {description: string, radius?: number, averageSideLength?: number, slope?: number} {
    //Judges the 'shape' of the convex hull of a cluster of data.
    let h: Array<coord> = makeHull(coordinate(data));
    let flat: number = flatness(h);
    if (flat > .92) {
        //High flatness is categorized as roughly circular
        return {
            description: "roughly circular",
            radius: Math.sqrt(shoelace(h) / Math.PI)
        };
    }
    else if (flat > .7) {
        let simple: Array<Array<number>> = deCoordinate(simplifyHull(h));
        let sides: number = simple.length;
        switch (true) {
            case sides == 3:
                return {
                    description: "triangular",
                    averageSideLength: (euclidDistance(simple[0], simple[1]) + euclidDistance(simple[1], simple[2]) + euclidDistance(simple[2], simple[0])) / 3
                };
            case sides == 4:
                let angle1: number = getAngle(simple[0], simple[1]);
                let angle2: number = getAngle(simple[1], simple[2]);
                let angle3: number = getAngle(simple[2], simple[3]);
                let angle4: number = getAngle(simple[3], simple[0]);
                let difference1: number = angle2 - angle1;
                let difference2: number = angle3 - angle2;
                let difference3: number = angle4 - angle3;
                let difference4: number = angle1 - angle4;
                if ((Math.abs(((difference1 + 720) % 360) - 270) < 15) && (Math.abs(((difference2 + 720) % 360) - 270) < 15) && (Math.abs(((difference3 + 720) % 360) - 270) < 15) && (Math.abs(((difference4 + 720) % 360) - 270) < 15)) {
                    let distance1: number = euclidDistance(simple[0], simple[1]);
                    let distance2: number = euclidDistance(simple[1], simple[2]);
                    let distance3: number = euclidDistance(simple[2], simple[3]);
                    let distance4: number = euclidDistance(simple[3], simple[0]);
                    let average = (distance1 + distance2 + distance3 + distance4) / 4;
                    if ((average * .91 < distance1 && distance1 < average * 1.1) && (average * .91 < distance2 && distance2 < average * 1.1) && (average * .91 < distance3 && distance3 < average * 1.1) && (average * .91 < distance4 && distance4 < average * 1.1)) {
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
                let xData: Array<number> = [];
                let yData: Array<number> = [];
                for (let i = 0; i < data.length; i++) {
                    xData.push(data[i][0]);
                    yData.push(data[i][1]);
                }
                let slope: number = lin_reg(xData, yData)[1];
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
        //Flatness <.7 are classified as linear
        let xData: Array<number> = [];
        let yData: Array<number> = [];
        for (let i = 0; i < data.length; i++) {
            xData.push(data[i][0]);
            yData.push(data[i][1]);
        }
        let slope: number = lin_reg(xData, yData)[1];
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
    throw new Error("Something has gone wrong in judgeShape()");
}

function deCoordinate(array: Array<coord>): Array<Array<number>> {
    //Removes x-y coordinates from arrays
    var dataArray: Array<Array<number>> = [];
    for (let i = 0; i < array.length; i++) {
        dataArray.push([array[i]["x"], array[i]["y"]])
    }
    return dataArray;
}

function coordinate(array: Array<Array<number>>): Array<coord> {
    //Adds x-y coordinates to arrays
    var dataArray: Array<coord> = [];
    for (let i = 0; i < array.length; i++) {
        dataArray.push({ x: array[i][0], y: array[i][1] })
    }
    return dataArray;
}

/*
function generateHeatmap(dataArray: Array<Array<number>>, precision: number): void {

    let y: Array<number> = [];
    let x: Array<number> = [];

    for (let point of dataArray) {
        x.push(point[0]);
        y.push(point[1]);
    }


    let yMax: number = Math.max(...y) * 1.1;
    let xMax: number = Math.max(...x) * 1.1;
    let yMin: number = Math.min(...y) * .91;
    let xMin: number = Math.min(...x) * .91;



    var grid: Array<Array<number>> = [];

    for (let i = 0; i < precision; i++) {
        grid.push([]);
        for (let j = 0; j < precision; j++) {
            grid[i].push(0);
        }
    }

    for (let point of dataArray) {
        let xIndex: number = Math.floor((point[0] - xMin) * precision / (xMax - xMin));
        let yIndex: number = Math.floor((point[1] - yMin) * precision / (yMax - yMin));
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


    let HEATMAP1 = document.getElementById('heatmap1');

    newPlot(HEATMAP1, heatmapData);

    let HEATMAP2 = document.getElementById('heatmap2');

    newPlot(HEATMAP2, heatmapData2);

    let TESTER2 = document.getElementById('tester2');
    var trace1 = [{
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter'
    }];

    newPlot(TESTER2, trace1)
}
*/

function getRegion(data: Array<Array<number>>): Array<number> {
    //Classifies datapoints into one of 9 regions (3x3) and returns an array of numbers describing those regions.

    let regions: Array<number> = [];
    let n: number = data.length;
    let xMax: number = data[0][0];
    let yMax: number = data[0][1];
    let xMin: number = data[0][0];
    let yMin: number = data[0][1];
    for (let i = 0; i < n; i++) {
        if (xMax < data[i][0]) {
            xMax = data[i][0];
        }
        if (xMin > data[i][0]) {
            xMin = data[i][0];
        }
        if (yMax < data[i][1]) {
            yMax = data[i][1];
        }
        if (yMin > data[i][1]) {
            yMin = data[i][1];
        }
    }
    let left: number = ((xMax - xMin) / 3) + xMin;
    let right: number = ((xMax - xMin) * 2 / 3) + xMin;
    let down: number = ((yMax - yMin) / 3) + yMin;
    let up: number = ((yMax - yMin) * 2 / 3) + yMin;

    for (let point of data) {
        let test: Array<boolean> = [point[0] < left, point[0] < right, point[1] < down, point[1] < up];
        switch (true) {
            case JSON.stringify(test) == JSON.stringify([true, true, true, true]):
                regions.push(0);
                break;
            case JSON.stringify(test) == JSON.stringify([false, true, true, true]):
                regions.push(1);
                break;
            case JSON.stringify(test) == JSON.stringify([false, false, true, true]):
                regions.push(2);
                break;
            case JSON.stringify(test) == JSON.stringify([true, true, false, true]):
                regions.push(3);
                break;
            case JSON.stringify(test) == JSON.stringify([false, true, false, true]):
                regions.push(4);
                break;
            case JSON.stringify(test) == JSON.stringify([false, false, false, true]):
                regions.push(5);
                break;
            case JSON.stringify(test) == JSON.stringify([true, true, false, false]):
                regions.push(6);
                break;
            case JSON.stringify(test) == JSON.stringify([false, true, false, false]):
                regions.push(7);
                break;
            case JSON.stringify(test) == JSON.stringify([false, false, false, false]):
                regions.push(8);
        }
    }
    return regions;
}

function judgeRegion(regionIDS: Array<number>): Array<string> {
    //Judges numerical regions into strings describing their location on a 3x3 grid.
    let regions: Array<string> = [];
    let n: number = data.length;
    for (let i = 0; i < n; i++) {
        let regionID: number = regionIDS[i];
        switch (true) {
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


function getAngle(x: Array<number>, y: Array<number>): number {
    //Returns the numerical angle in degrees between a starting point x and a target point y
    const subtraction: Array<number> = y.map((num, index) => num - x[index]);
    let angle: number = 0;
    if (subtraction[0] == 0 && subtraction[1] > 0) {
        return 90;
    }
    else if (subtraction[0] == 0 && subtraction[1] < 0) {
        return 270;
    }
    else if (subtraction[1] == 0 && subtraction[0] >= 0) {
        return 0
    }
    else if (subtraction[1] == 0 && subtraction[0] < 0) {
        return 180
    }
    else {

        switch (true) {
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
            case subtraction[0] > 0 && subtraction[1] < 0:
                angle = Math.atan(subtraction[0] / subtraction[1])
                angle = Math.abs(angle) + 3 * Math.PI / 2;
                break;
        }
    }

    angle = angle * 180 / Math.PI;
    return angle;
}


function judgeAngle(x: Array<number>, y: Array<number>): string {
    //Categorizes a numerical angle between two points into a cardinal direction
    let angle: number = getAngle(x, y);
    switch (true) {
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
    throw new Error("Error: undefined angle in judgeAngle()");
}



function simplifyHull(inputShell: Array<coord>): Array<coord> {
    let shell: Array<Array<number>> = deCoordinate(inputShell);
    let n: number = shell.length;
    let precision: number = 15;
    let angle1: number = 0;
    let angle2: number = 0;
    let difference: number = 0;
    //Trims vertices from the shell which change the angle of the incoming line by less than precision degrees
    for (let i = 0; i < n; i++) {
        angle1 = getAngle(shell[i % n], shell[(i + 1) % n]);
        angle2 = getAngle(shell[(i + 1) % n], shell[(i + 2) % n]);
        difference = angle2 - angle1;
        if ((Math.abs(difference) < precision) || (Math.abs(difference + 360) < precision) || (Math.abs(difference - 360) < precision)) {
            shell.splice((i + 1) % n, 1);
            i--;
            n--;
        }
    }

    //'Fills in' small edges near corners
    let peri: number = perimeter(inputShell);
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


function completeAngle(p1: coord | Array<number>, p2: coord | Array<number>, p3: coord | Array<number>, p4: coord | Array<number>): Array<number> {
    //Calculates and returns the intersection point of the lines spanning p1-p2 and p3-p4.
    //See derivation here: https://www.desmos.com/calculator/vmgoniltui
    if (!Array.isArray(p1)){p1 = [p1.x, p1.y]}
    if (!Array.isArray(p2)){p2 = [p2.x, p2.y]}
    if (!Array.isArray(p3)){p3 = [p3.x, p3.y]}
    if (!Array.isArray(p4)){p4 = [p4.x, p4.y]}


    //Handles edge case when two points are aligned vertically
    if ((p2[0] - p1[0]) == 0) {
        if ((p4[0] - p3[0]) == 0) {
            //This should never happen if used on a convex polygon
            throw new Error("Error: attempting to compare parallel lines in completeAngle");
        }
        return [p1[0], (p4[1] - p3[1]) / (p4[0] - p3[0]) * p1[0] + p3[1] - (p4[1] - p3[1]) / (p4[0] - p3[0]) * p3[0]];
    }

    if ((p4[0] - p3[0]) == 0) {
        return [p3[0], (p2[1] - p1[1]) / (p2[0] - p1[0]) * p3[0] + p1[1] - (p2[1] - p1[1]) / (p2[0] - p1[0]) * p1[0]];
    }

    let slope12: number = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    let slope34: number = (p4[1] - p3[1]) / (p4[0] - p3[0]);
    if ((slope12 - slope34) == 0) {
        //This should also never happen if used on a convex polygon
        throw new Error("Error: attempting to compare parallel lines in completeAngle");
    }
    let x: number = (p1[1] - p3[1] - slope12 * p1[0] + slope34 * p3[0]) / (slope34 - slope12);
    let newPoint: Array<number> = [x, slope12 * x + p1[1] - slope12 * p1[0]];
    return newPoint;
}

function lin_reg(x: Array<number>, y: Array<number>): Array<number> {
    //Get slope and intercept from x and y arrays.  
    let x_sum: number = 0;
    let y_sum: number = 0;
    let xy_sum: number = 0;
    let x2_sum: number = 0;
    const n: number = x.length;
    let i: number = 0;
    for (i = 0; i < n; i++) {
        let x_val = x[i];
        let y_val = y[i];
        x_sum += x_val;
        y_sum += y_val;
        xy_sum += x_val * y_val;
        x2_sum += x_val * x_val;
    }
    let slope: number = (n * xy_sum - x_sum * y_sum) / (n * x2_sum - x_sum * x_sum);
    let intercept: number = (y_sum / n) - slope * (x_sum / n);
    return [intercept, slope];
}

function residuals(x: Array<number>, y: Array<number>): Array<number> {
    //Get residuals from x and y arrays from a simple linear regression.
    let lin: Array<number> = lin_reg(x, y);
    let slope: number = lin[1];
    let intercept: number = lin[0];
    let residuals: Array<number> = [];
    let i: number = 0;
    const n: number = x.length;
    for (i = 0; i < n; i++) {
        residuals.push(y[i] - (x[i] * slope + intercept))
    }
    return residuals;
}

function mean(x: Array<number>): number {
    //Get mean of array
    let i: number = 0;
    let sum: number = 0;
    const n: number = x.length;
    for (i = 0; i < n; i++) {
        sum += x[i]
    }
    return (sum / n);
}

function rSquared(x: Array<number>, y: Array<number>): number {
    //Calculates R^2 of x and y arrays from a simple linear regression.
    if (x.length != y.length) {
        throw new Error("Error: Array lengths do not match in rSquared()");
    }
    let resid: Array<number> = residuals(x, y)
    let squared_resid_sum: number = 0;
    let sum_of_squares_total: number = 0;
    let y_mean: number = mean(y);
    let i: number = 0;
    const n: number = x.length;
    for (i = 0; i < n; i++) {
        squared_resid_sum += resid[i] ** 2;
        sum_of_squares_total += (y[i] - y_mean) ** 2
    }
    return (squared_resid_sum / sum_of_squares_total);
}



function findHoles(cluster: clusterObject): Array<hole> {
    //Returns a list of non-overlapping holes, sorted from largest to smallest.
    let clusterData: Array<coord> = coordinate(cluster.dataPoints);

    let voronoi = new Voronoi();
    let bbox = { xl: cluster.xMin - .1, xr: cluster.xMax + .1, yt: cluster.yMax + .1, yb: cluster.yMin - .1 }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
    let diagram = voronoi.compute(clusterData, bbox);
    let shell: Array<coord> = makeHull(clusterData)

    let edgePoints: Array<Array<number>> = [];
    let verticesInside: Array<Array<number>> = [];

    for (let edge of diagram.edges) {
        let va: Array<number> = [edge.va.x, edge.va.y];
        let vb: Array<number> = [edge.vb.x, edge.vb.y];
        let n: number = shell.length;
        for (let i = 0; i < n; i++) {
            let intersection: Array<number> = completeAngle(va, vb, shell[i % n], shell[(i + 1) % n])
            if (((intersection[0] > va[0] && intersection[0] < vb[0]) || (intersection[0] < va[0] && intersection[0] > vb[0])) && ((intersection[1] > va[1] && intersection[1] < vb[1]) || (intersection[1] < va[1] && intersection[1] > vb[1]))) {
                edgePoints.push(intersection);
            }
        }
    }

    for (let point of deCoordinate(diagram.vertices)) {
        if (classifyPoint(deCoordinate(shell), point) < 1) {
            verticesInside.push(point);
        }
    }

    for (let point of edgePoints) {
        if (classifyPoint(deCoordinate(shell), point) < 1) {
            verticesInside.push(point);
        }
    }

    let minsArray: Array<Array<number>> = [];
   
    for (let vertexID in verticesInside) {
        let vertex: Array<number> = verticesInside[vertexID];
        let min: Array<number> = [0, 0];
        for (let point of deCoordinate(clusterData)) {
            if (min[1] == 0) {
                min = [Number(vertexID), euclidDistance(vertex, point)]
            }
            else if (min[1] > euclidDistance(vertex, point)) {
                min = [Number(vertexID), euclidDistance(vertex, point)]
            }
        }
        minsArray.push(min);
    }

    let sorted: Array<Array<number>> = minsArray.sort((a, b) => { return b[1] - a[1] })

    //Culls similar holes by removing hole centers that lie within the border of a larger hole.
    for (let pointID in sorted) {
        let point: Array<number> = sorted[pointID];
        let i: number = Number(pointID) + 1;
        while (i < sorted.length) {
            if (euclidDistance(verticesInside[point[0]], verticesInside[sorted[i][0]]) < point[1]) {
                sorted.splice(i, 1);
                i--;
            }
            i++;
        }
    }


    let closest: Array<hole> = []
    for (let i = 0; i < sorted.length; i++) {
        closest.push([verticesInside[sorted[i][0]], sorted[i][1]])
    }

    return (closest);
}


//Types
type clusterObject = {
    centroid: Array<number>,
    dataPoints: Array<Array<number>>,
    density: number,
    densityRank: number,
    hasSignificantHole: boolean,
    holes: Array<hole>,
    hull: Array<coord>,
    hullSimplified: Array<coord>,
    id: number,
    region: number,
    regionDesc: string,
    relations: Array<relation>,
    shape: {description: string},
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number
}
type coord = {
    x: number,
    y: number
}
type relation = {
    angle: number,
    cardDirection: string,
    distance: number,
    id: number,
    isNeighbor?: boolean
}
type hole = [Array<number>, number]