//import { newPlot } from 'plotly.js-dist';
//import csv2json from 'csvjson-csv2json';
import classifyPoint from "../lib/robust-pnp";
import makeHull from "../lib/convexhull";
import { FIZZSCAN } from "../lib/FIZZSCAN";
import Voronoi from "../lib/rhill-voronoi-core";
import polygonClipping from 'polygon-clipping'
import Papa from 'papaparse';
import { generateClusterAnalysis } from '../lib/clustering.ts'
import dataS1 from "../data/s1";
import dataS2 from "../data/s2";
import dataD3 from "../data/d3.ts";
import geyserData from "../data/geyser";
import iris from "../data/iris";
import { irisLabels } from "../data/iris";
import data2d3c from "../data/2d-3c.ts";
import {dots} from "../data/datasaurus.ts";


const dataS1Parsed = Papa.parse(dataS1, { header: true }).data as coord[];

const dataS2Parsed = Papa.parse(dataS2, { header: true }).data as coord[];

const dataD3Parsed = Papa.parse(dataD3, { header: true }).data as coord[];

const dataGeyserParsed = Papa.parse(geyserData, { header: true }).data as coord[];

const irisParsed = Papa.parse(iris, { header: true }).data
const irisData = coordinate(getColumns(irisParsed, ["sepalLength", "petalLength"]));

const data2d3cParsed = Papa.parse(data2d3c, { header: true }).data as coord[];

let dotsParsed = Papa.parse(dots, { header: true }).data as coord[];
dotsParsed = dotsParsed.map(a => {return {x: Number(a.x), y: Number(a.y)}});

//import data2d20c from "./data/2d-20c.ts";
//const data = csv2json(data2d20c);




const output = generateClusterAnalysis(dataS1Parsed , true)

console.log(output)
const clusters: number[][] = []
const noise: number[] = []
const noiseAssigned: number[][] = []
for (let cluster of output) {
    clusters.push(cluster.dataPointIDs)
    for (let outlier of cluster.outlierIDs) {
        noise.push(outlier)
        noiseAssigned.push([outlier, cluster.id])
    }

}
console.log(`Clusters:`)
console.log(clusters);
console.log(`Noise:`)
console.log(noise);
console.log(`NoiseAssigned:`)

console.log(noiseAssigned);

console.log(`Number of clusters: ${clusters.length}`)
console.log(`Total elements: ${clusters.flat().length + noise.length}`)
console.log(`Total clustered elements: ${clusters.flat().length}`)
console.log(`Total noise elements: ${noise.length}`)

console.log("-------------------------")
console.log("Individual Cluster Analysis")
console.log("-------------------------")

let i = 0;
const palette: Array<string> = ["red", "orange", "yellow", "green", "blue", "cyan", "darkblue", "pink", "darkmagenta", "chocolate", "dodgerblue", "gold", "firebrick",
    "lawngreen", "red", "orange", "yellow", "green", "blue", "cyan", "darkblue", "pink", "darkmagenta", "chocolate", "dodgerblue", "gold", "firebrick", "lawngreen"];
for (let cluster of output) {
    console.log(cluster)
    console.log(`This is cluster Number ${i}`)
    console.log(`This cluster is in the ${cluster.regionDesc} of the overall data.`);
    console.log(`This cluster is colored ${palette[i]}`);
    console.log(`The shape of the data is ${cluster.shape.description}`)
    console.log("-------------------------");
    i++
}

console.log(JSON.parse(JSON.stringify(output)));
console.log("stop");

const dataArray: Pair[] = [];

for (let cluster of output) {
    for (let point of cluster.dataPoints) {
        dataArray.push(point)
    }
}
const dataLength = dataArray.length
const xArray: Array<number> = [];
const yArray: Array<number> = [];
for (let i = 0; i < dataLength; i++) {
    xArray.push(dataArray[i][0]);
    yArray.push(dataArray[i][1]);
}
const yMaxGlobal: number = Math.max(...yArray);
const xMaxGlobal: number = Math.max(...xArray);
const yMinGlobal: number = Math.min(...yArray);
const xMinGlobal: number = Math.min(...xArray);

//Draws the main graph
const graphSize: number = 700;

let canvas: HTMLCanvasElement | null = document.getElementById("myCanvas") as HTMLCanvasElement | null;
if (canvas == null) {
    throw new Error("Error: heatmap canvas element missing.")
}
else {
    canvas = canvas as HTMLCanvasElement
}
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.height = graphSize;
canvas.width = graphSize;
ctx.transform(1, 0, 0, -1, 0, canvas.height)



//Draws clustered points and outliers
for (let cluster of output) {
    for (let point of cluster.outliers) {
        const x: number = ((point[0] - xMinGlobal) / (xMaxGlobal - xMinGlobal)) * graphSize;
        const y: number = ((point[1] - yMinGlobal) / (yMaxGlobal - yMinGlobal)) * graphSize;
        ctx.beginPath();
        ctx.fillStyle = "gray"
        ctx.ellipse(x, y, 3, 3, 0, 0, Math.PI * 2);
        ctx.fill();

    }
    for (let point of cluster.dataPoints) {
        const x: number = ((point[0] - xMinGlobal) / (xMaxGlobal - xMinGlobal)) * graphSize;
        const y: number = ((point[1] - yMinGlobal) / (yMaxGlobal - yMinGlobal)) * graphSize;
        ctx.beginPath();
        ctx.fillStyle = palette[cluster.id];
        ctx.ellipse(x, y, 3, 3, 0, 0, Math.PI * 2);
        ctx.fill();

    }

}

//Draws centroids of each cluster
for (let i = 0; i < output.length; i++) {
    const x: number = ((output[i].centroid[0] - xMinGlobal) / (xMaxGlobal - xMinGlobal)) * graphSize;
    const y: number = ((output[i].centroid[1] - yMinGlobal) / (yMaxGlobal - yMinGlobal)) * graphSize;
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
for (let cluster of output) {
    let shell = makeHull(coordinate(cluster.dataPoints));
    //shell = simplifyHull(shell);
    ctx.beginPath();
    ctx.moveTo(((shell[0].x - xMinGlobal) / (xMaxGlobal - xMinGlobal)) * graphSize, ((shell[0].y - yMinGlobal) / (yMaxGlobal - yMinGlobal)) * graphSize)
    for (let i = 0; i < shell.length; i++) {
        const x: number = ((shell[i].x - xMinGlobal) / (xMaxGlobal - xMinGlobal)) * graphSize;
        const y: number = ((shell[i].y - yMinGlobal) / (yMaxGlobal - yMinGlobal)) * graphSize;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    ctx.lineTo(((shell[0].x - xMinGlobal) / (xMaxGlobal - xMinGlobal)) * graphSize, ((shell[0].y - yMinGlobal) / (yMaxGlobal - yMinGlobal)) * graphSize)
    ctx.stroke();
    ctx.closePath();
}

//Draws largest holes of each cluster

for (let cluster of output) {
    for (let i = 0; i < 1; i++) {
        ctx.beginPath();
        ctx.ellipse(((cluster.holes[i][0][0] - xMinGlobal) / (xMaxGlobal - xMinGlobal)) * graphSize,
            ((cluster.holes[i][0][1] - yMinGlobal) / (yMaxGlobal - yMinGlobal)) * graphSize,
            ((cluster.holes[i][1]) / (xMaxGlobal - xMinGlobal)) * graphSize,
            ((cluster.holes[i][1]) / (yMaxGlobal - yMinGlobal)) * graphSize, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.ellipse(((cluster.holes[i][0][0] - xMinGlobal) / (xMaxGlobal - xMinGlobal)) * graphSize,
            ((cluster.holes[i][0][1] - yMinGlobal) / (yMaxGlobal - yMinGlobal)) * graphSize, 4, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

//Helper functions

function simplifyHull(inputShell: Array<coord>): Array<coord> {
    const shell: Array<Pair> = deCoordinate(inputShell);
    const precision: number = 15;
    let n: number = shell.length;
    //Trims vertices from the shell which change the angle of the incoming line by less than precision degrees
    for (let i = 0; i < n; i++) {
        const angle1: number = getAngle(shell[i % n], shell[(i + 1) % n]);
        const angle2: number = getAngle(shell[(i + 1) % n], shell[(i + 2) % n]);
        const difference: number = angle2 - angle1;
        if ((Math.abs(difference) < precision) || (Math.abs(difference + 360) < precision) || (Math.abs(difference - 360) < precision)) {
            shell.splice((i + 1) % n, 1);
            i--;
            n--;
        }
    }

    //'Fills in' small edges near corners
    const smallnessParameter = 20
    const peri: number = perimeter(inputShell);
    for (let i = 0; i < n; i++) {
        if (euclidDistance(shell[(i + 1) % n], shell[(i + 2) % n]) < (peri / smallnessParameter)) {
            const angle1: number = getAngle(shell[i % n], shell[(i + 1) % n]);
            const angle2: number = getAngle(shell[(i + 2) % n], shell[(i + 3) % n]);
            const difference: number = angle2 - angle1;
            if (!(160 < ((difference + 720) % 360) && ((difference + 720) % 360) < 200)) {
                const newPoint = completeAngle(shell[i % n], shell[(i + 1) % n], shell[(i + 2) % n], shell[(i + 3) % n])
                shell[(i + 1) % n] = newPoint;
                shell.splice((i + 2) % n, 1);
                i--;
                n--;
            }
        }
    }
    return coordinate(shell);
}


function completeAngle(p1: coord | Array<number>, p2: coord | Array<number>, p3: coord | Array<number>, p4: coord | Array<number>): Pair {
    //Calculates and returns the intersection point of the lines spanning p1-p2 and p3-p4.
    //See derivation here: https://www.desmos.com/calculator/vmgoniltui
    if (!Array.isArray(p1)) { p1 = [p1.x, p1.y] }
    if (!Array.isArray(p2)) { p2 = [p2.x, p2.y] }
    if (!Array.isArray(p3)) { p3 = [p3.x, p3.y] }
    if (!Array.isArray(p4)) { p4 = [p4.x, p4.y] }


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

    const slope12: number = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    const slope34: number = (p4[1] - p3[1]) / (p4[0] - p3[0]);
    if ((slope12 - slope34) == 0) {
        //This should also never happen if used on a convex polygon
        throw new Error("Error: attempting to compare parallel lines in completeAngle");
    }
    const x: number = (p1[1] - p3[1] - slope12 * p1[0] + slope34 * p3[0]) / (slope34 - slope12);
    const newPoint: Pair = [x, slope12 * x + p1[1] - slope12 * p1[0]];
    return newPoint;
}

function euclidDistance(p: Array<number>, q: Array<number>): number {
    //Returns euclidean distance between vectors p and q.
    let sum: number = 0;
    let i: number = Math.min(p.length, q.length);
    while (i--) {
        sum += (p[i] - q[i]) * (p[i] - q[i]);
    }

    return Math.sqrt(sum);
}

function perimeter(data: Array<coord>): number {
    //Calculates perimeter from set of points, intended to be used on convex hull with points ordered either c-wise or cc-wise
    let sum: number = 0;
    const n: number = data.length;
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

function deCoordinate(array: Array<coord>): Array<Pair> {
    //Removes x-y coordinates from 2-d arrays
    if (array.length == 0) {
        return [];
    }
    const dataArray: Array<Pair> = [];
    for (let i = 0; i < array.length; i++) {
        dataArray.push([array[i]["x"], array[i]["y"]])
    }
    return dataArray;
}

function coordinate(array: Array<Pair>): Array<coord> {
    //Adds x-y coordinates to 2-d arrays
    if (array.length == 0) {
        return [];
    }
    const dataArray: Array<coord> = [];
    for (let i = 0; i < array.length; i++) {
        dataArray.push({ x: array[i][0], y: array[i][1] })
    }
    return dataArray;
}


function getColumns(data: Array<any>, columnIds: Array<string>): Array<any> {
    let columnData: Array<any> = []
    for (let i = 0; i < data.length; i++) {
        let entry: Array<any> = []
        for (let j = 0; j < columnIds.length; j++) {
            entry.push(data[i][columnIds[j]])
        }
        columnData.push(entry)
    }
    return columnData;
}

//Types
type coord = {
    x: number,
    y: number
}

type Pair = [number, number]
