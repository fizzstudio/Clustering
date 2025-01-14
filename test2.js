function completeAngle(p1, p2, p3, p4){
//Calculates and returns the intersection point of the lines bridging p1-p2 and p3-p4.

//Handles edge case when two points are aligned vertically
if ((p2[0]-p1[0]) == 0){
    if ((p4[0]-p3[0]) == 0){
        //This should never happen if used on a convex polygon
        return -1;
    }
    return (p4[1]-p3[1])/(p4[0]-p3[0]) * p1[0] + p3[1] - (p4[1]-p3[1])/(p4[0]-p3[0]) * p3[0];
}

if ((p4[0]-p3[0]) == 0){
    return (p2[1]-p1[1])/(p2[0]-p1[0]) * p3[0] + p1[1] - (p2[1]-p1[1])/(p2[0]-p1[0]) * p1[0];
}

let slope12 = (p2[1]-p1[1])/(p2[0]-p1[0]);
let slope34 = (p4[1]-p3[1])/(p4[0]-p3[0]);
if ((slope12 - slope34) == 0){
    //This should also never happen if used on a convex polygon
    return -1;
}
let x = (p1[1] - p3[1] - slope12 * p1[0] + slope34 * p3[0]) / (slope34 - slope12);
let newPoint = [x, slope12 * x + p1[1] - slope12 * p1[0]];
return newPoint;
}

let test = [0, 1, 2, 3, 4]
let cloneTest = [...test.slice(0, 2), ...test.slice(2)];
cloneTest.splice(1, 1);
console.log(cloneTest);
console.log(test);