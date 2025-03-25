/*
import Voronoi from "./rhill-voronoi-core.js";
import makeHull from "./convexhull.ts";
import classifyPoint from "robust-point-in-polygon";
import { getActiveResourcesInfo } from "process";
function deCoordinate(array: Array<coord>): Array<Array<number>> {
    //Removes x-y coordinates from arrays
    var dataArray: Array<Array<number>> = [];
    for (let i = 0; i < array.length; i++) {
        dataArray.push([array[i]["x"], array[i]["y"]])
    }
    return dataArray;
}
function euclidDistance(p: Array<number>, q: Array<number>): number {
    //Returns euclidean distance between vectors p and q.
    var sum: number = 0;
    var i: number = Math.min(p.length, q.length);
    while (i--) {
        sum += (p[i] - q[i]) * (p[i] - q[i]);
    }

    return Math.sqrt(sum);
}
function coordinate(array: Array<Array<number>>): Array<coord> {
    //Adds x-y coordinates to arrays
    var dataArray: Array<coord> = [];
    for (let i = 0; i < array.length; i++) {
        dataArray.push({ x: array[i][0], y: array[i][1] })
    }
    return dataArray;
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
function checkParallel(p1: coord | Array<number>, p2: coord | Array<number>, p3: coord | Array<number>, p4: coord | Array<number>): boolean {
    if (!Array.isArray(p1)){p1 = [p1.x, p1.y]}
    if (!Array.isArray(p2)){p2 = [p2.x, p2.y]}
    if (!Array.isArray(p3)){p3 = [p3.x, p3.y]}
    if (!Array.isArray(p4)){p4 = [p4.x, p4.y]}

    if ((p2[0] - p1[0]) == 0) {
        if ((p4[0] - p3[0]) == 0) {
            //This should never happen if used on a convex polygon
            return true;
        }
        return false;
    }

    let slope12: number = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    let slope34: number = (p4[1] - p3[1]) / (p4[0] - p3[0]);
    if ((slope12 - slope34) == 0) {
        return true;
    }
    else{
        return false;
    }
}
let test = [
    [
        5.550000000000001,
        4.65
    ],
    [
        6.2,
        4.8
    ],
    [
        6.675000000000001,
        5.003571428571428
    ],
    [
        6,
        5.1
    ],
    [
        5.550000000000001,
        4.65
    ]
]
type coord = {x: number, y : number}
function shoelace(data: Array<coord>): number {
    //Calculates area from set of points, intended to be used on convex hull with points ordered either c-wise or cc-wise
    if (data.length == 0) {
        return 0;
    }
    let sum: number = 0;
    const n: number = data.length;
    for (let i = 0; i < n - 1; i++) {
        sum += data[i].x * data[i + 1].y - data[i].y * data[i + 1].x
    }
    sum += data[n - 1].x * data[0].y - data[n - 1].y * data[0].x
    return Math.abs(sum / 2);
}
console.log(coordinate(test));
console.log(shoelace(coordinate(test)));

test = test.splice(0, test.length - 1);
console.log(test);
console.log(coordinate(test));
console.log(shoelace(coordinate(test)));
*/