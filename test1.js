var csv2json = require('csvjson-csv2json');
var data = csv2json(s2Data);
var Plotly = require('plotly.js-dist')
/*

var data1 = [{x:1,y:0}, {x:.707,y:.707}, {x:0,y:1}, {x:-.707,y:.707}, {x:-1,y:0},{x:-.707,y:-.707}, {x:0,y:-1}, {x:.707,y:-.707}];
var data2 = [{x:0,y:0}, {x:1,y:1}, {x:2,y:2}, {x:-3,y:3}, {x:4,y:4},{x:5,y:5}, {x:6,y:6}, {x:7,y:7}]
console.log(shoelace(data1));
console.log(shoelace(data2));

*/

var data = coordinate([
    [
        340693,
        569371
    ],
    [
        349296,
        557688
    ],
    [
        339967,
        562602
    ],
    [
        342064,
        570045
    ],
    [
        330455,
        568758
    ],
    [
        339981,
        565418
    ],
    [
        338342,
        566864
    ],
    [
        338474,
        563350
    ],
    [
        334354,
        578047
    ],
    [
        334016,
        562797
    ],
    [
        343247,
        564376
    ],
    [
        330881,
        579058
    ],
    [
        339115,
        566863
    ],
    [
        345840,
        561591
    ],
    [
        334549,
        579199
    ],
    [
        337811,
        558454
    ],
    [
        340545,
        568654
    ],
    [
        331667,
        570387
    ],
    [
        332960,
        569308
    ],
    [
        345042,
        566973
    ],
    [
        334182,
        558498
    ],
    [
        335328,
        562880
    ],
    [
        337298,
        565486
    ],
    [
        335918,
        566525
    ],
    [
        330127,
        570072
    ],
    [
        334785,
        565575
    ],
    [
        326152,
        563230
    ],
    [
        345903,
        561314
    ],
    [
        352520,
        566829
    ],
    [
        341675,
        560197
    ],
    [
        344770,
        570309
    ],
    [
        336829,
        562228
    ],
    [
        342963,
        582232
    ],
    [
        338860,
        561151
    ],
    [
        343376,
        575709
    ],
    [
        338863,
        563107
    ],
    [
        338935,
        567577
    ],
    [
        344237,
        573700
    ],
    [
        328657,
        564864
    ],
    [
        340712,
        563178
    ],
    [
        344791,
        578536
    ],
    [
        341721,
        576427
    ],
    [
        341578,
        558672
    ],
    [
        331987,
        568997
    ],
    [
        341329,
        565571
    ],
    [
        334350,
        556417
    ],
    [
        330482,
        571217
    ],
    [
        338950,
        572545
    ],
    [
        325958,
        573367
    ],
    [
        348171,
        569251
    ],
    [
        342099,
        561508
    ],
    [
        327998,
        571265
    ],
    [
        337889,
        558031
    ],
    [
        340032,
        561740
    ],
    [
        338634,
        564414
    ],
    [
        351459,
        565704
    ],
    [
        336928,
        557412
    ],
    [
        343450,
        570659
    ],
    [
        331616,
        565089
    ],
    [
        354529,
        573677
    ],
    [
        331366,
        567311
    ],
    [
        340191,
        567638
    ],
    [
        338583,
        563529
    ],
    [
        338474,
        564151
    ],
    [
        338205,
        566246
    ],
    [
        342901,
        582886
    ],
    [
        347966,
        563506
    ],
    [
        346144,
        560472
    ],
    [
        329905,
        579935
    ],
    [
        330335,
        568221
    ],
    [
        341559,
        562163
    ],
    [
        341925,
        569393
    ],
    [
        332586,
        566187
    ],
    [
        330750,
        561657
    ],
    [
        337910,
        562252
    ],
    [
        336549,
        565597
    ],
    [
        343717,
        559909
    ],
    [
        345164,
        579614
    ],
    [
        340970,
        564831
    ],
    [
        347575,
        565576
    ],
    [
        338753,
        563384
    ],
    [
        345495,
        579864
    ],
    [
        350056,
        566657
    ],
    [
        350283,
        559840
    ],
    [
        335525,
        567445
    ],
    [
        351815,
        574947
    ],
    [
        341966,
        561987
    ],
    [
        334983,
        572690
    ],
    [
        336336,
        563145
    ],
    [
        335027,
        565050
    ],
    [
        332270,
        556288
    ],
    [
        339640,
        561426
    ],
    [
        338633,
        563504
    ],
    [
        336974,
        563207
    ],
    [
        337173,
        557853
    ],
    [
        333378,
        557892
    ],
    [
        344552,
        554676
    ],
    [
        351564,
        573155
    ],
    [
        338084,
        560295
    ],
    [
        345674,
        579033
    ],
    [
        345123,
        577788
    ],
    [
        329859,
        564384
    ],
    [
        353939,
        570931
    ],
    [
        344096,
        575522
    ],
    [
        359831,
        554975
    ],
    [
        340064,
        550509
    ],
    [
        358793,
        547046
    ],
    [
        358483,
        554925
    ],
    [
        357275,
        551101
    ],
    [
        354746,
        552404
    ],
    [
        356246,
        549756
    ],
    [
        361370,
        552483
    ],
    [
        359772,
        568428
    ],
    [
        363304,
        553764
    ],
    [
        360165,
        553303
    ],
    [
        358312,
        559466
    ],
    [
        352209,
        548608
    ],
    [
        357679,
        548036
    ],
    [
        335999,
        549795
    ],
    [
        358384,
        556361
    ],
    [
        356865,
        545785
    ],
    [
        352424,
        557574
    ],
    [
        335029,
        553213
    ],
    [
        361138,
        551307
    ],
    [
        341016,
        545280
    ],
    [
        353583,
        554147
    ],
    [
        327738,
        559624
    ],
    [
        331175,
        551842
    ],
    [
        331440,
        551885
    ],
    [
        330767,
        552963
    ],
    [
        325125,
        564342
    ],
    [
        324952,
        565867
    ],
    [
        325871,
        558965
    ],
    [
        325883,
        560492
    ],
    [
        353979,
        578923
    ],
    [
        353145,
        580916
    ],
    [
        343997,
        585193
    ],
    [
        348773,
        583528
    ],
    [
        355924,
        577596
    ],
    [
        321312,
        574721
    ],
    [
        325057,
        581121
    ],
    [
        326043,
        553772
    ],
    [
        321519,
        561045
    ],
    [
        325118,
        556212
    ],
    [
        324442,
        567881
    ],
    [
        320628,
        564596
    ],
    [
        317136,
        563479
    ],
    [
        324093,
        580491
    ],
    [
        321905,
        573147
    ],
    [
        321517,
        569562
    ],
    [
        321309,
        569996
    ],
    [
        321910,
        573825
    ],
    [
        315850,
        573154
    ],
    [
        324032,
        577807
    ],
    [
        316313,
        570785
    ],
    [
        318823,
        565345
    ],
    [
        321216,
        569834
    ],
    [
        324440,
        567074
    ],
    [
        328586,
        551385
    ],
    [
        337002,
        589527
    ],
    [
        339288,
        588052
    ],
    [
        341966,
        586266
    ],
    [
        335201,
        585318
    ],
    [
        327403,
        548875
    ],
    [
        326251,
        549298
    ],
    [
        318065,
        581616
    ],
    [
        324055,
        590810
    ],
    [
        347522,
        587567
    ],
    [
        339993,
        544064
    ],
    [
        338588,
        543875
    ],
    [
        330145,
        546705
    ],
    [
        357813,
        572855
    ],
    [
        317331,
        556086
    ],
    [
        316642,
        553340
    ],
    [
        310944,
        559497
    ],
    [
        365927,
        571713
    ],
    [
        366688,
        562413
    ],
    [
        364844,
        571623
    ],
    [
        347197,
        591316
    ],
    [
        353335,
        592567
    ],
    [
        352381,
        592377
    ],
    [
        344314,
        595915
    ],
    [
        335792,
        541310
    ],
    [
        322209,
        547247
    ],
    [
        333669,
        542228
    ],
    [
        327695,
        543105
    ],
    [
        366794,
        582584
    ],
    [
        366934,
        581294
    ],
    [
        367751,
        578289
    ],
    [
        315965,
        587160
    ],
    [
        332116,
        594868
    ],
    [
        328331,
        541094
    ],
    [
        367048,
        553451
    ],
    [
        371563,
        547746
    ],
    [
        373894,
        555347
    ],
    [
        371000,
        555062
    ],
    [
        368617,
        554066
    ],
    [
        373907,
        558472
    ],
    [
        365567,
        547606
    ],
    [
        369366,
        561201
    ],
    [
        367641,
        556309
    ],
    [
        365058,
        545456
    ],
    [
        339632,
        536577
    ],
    [
        333934,
        537464
    ],
    [
        339212,
        538693
    ],
    [
        336787,
        538925
    ],
    [
        341446,
        538787
    ],
    [
        350117,
        535859
    ],
    [
        349955,
        535578
    ],
    [
        374117,
        546122
    ],
    [
        350798,
        535657
    ],
    [
        375619,
        553791
    ],
    [
        371616,
        570648
    ],
    [
        374695,
        563163
    ],
    [
        333901,
        532836
    ],
    [
        344239,
        530765
    ],
    [
        332884,
        533990
    ],
    [
        312386,
        555195
    ],
    [
        340383,
        600071
    ],
    [
        321657,
        538660
    ],
    [
        303637,
        570253
    ],
    [
        304157,
        566007
    ],
    [
        304556,
        568584
    ],
    [
        304086,
        576100
    ],
    [
        302583,
        571881
    ],
    [
        333299,
        597586
    ],
    [
        326627,
        534442
    ],
    [
        327973,
        534972
    ],
    [
        316395,
        537403
    ],
    [
        357737,
        597104
    ],
    [
        344437,
        529492
    ],
    [
        328438,
        532686
    ],
    [
        331795,
        529654
    ],
    [
        306298,
        551902
    ],
    [
        304399,
        545221
    ],
    [
        297110,
        556485
    ],
    [
        298665,
        568245
    ],
    [
        300366,
        565761
    ],
    [
        370259,
        585265
    ],
    [
        378648,
        579579
    ],
    [
        379388,
        567285
    ],
    [
        352220,
        602793
    ],
    [
        366478,
        594677
    ],
    [
        322365,
        530808
    ],
    [
        378697,
        591764
    ],
    [
        318681,
        528806
    ],
    [
        321924,
        527106
    ],
    [
        385183,
        556284
    ],
    [
        331340,
        524203
    ],
    [
        386377,
        574187
    ],
    [
        388806,
        569524
    ],
    [
        324516,
        522674
    ],
    [
        302353,
        545544
    ],
    [
        319927,
        524637
    ],
    [
        310041,
        533285
    ],
    [
        296775,
        572432
    ],
    [
        299578,
        572052
    ],
    [
        294310,
        563522
    ],
    [
        297022,
        574097
    ],
    [
        289087,
        565427
    ],
    [
        290107,
        571927
    ],
    [
        289176,
        571435
    ],
    [
        292932,
        558293
    ],
    [
        303269,
        531608
    ],
    [
        313649,
        523765
    ],
    [
        302359,
        534317
    ],
    [
        363956,
        609339
    ],
    [
        368724,
        598412
    ],
    [
        320827,
        519618
    ],
    [
        293746,
        544468
    ],
    [
        297212,
        546223
    ],
    [
        289423,
        559134
    ],
    [
        286568,
        547471
    ],
    [
        283570,
        563726
    ],
    [
        288068,
        561932
    ],
    [
        282066,
        560178
    ],
    [
        282430,
        560217
    ],
    [
        284031,
        566654
    ],
    [
        384922,
        582877
    ],
    [
        393570,
        579641
    ],
    [
        312558,
        520650
    ],
    [
        308966,
        523409
    ],
    [
        392534,
        593343
    ],
    [
        385091,
        599401
    ],
    [
        306346,
        523584
    ],
    [
        296763,
        528676
    ],
    [
        276703,
        559740
    ],
    [
        275524,
        559548
    ],
    [
        293591,
        522132
    ],
    [
        292636,
        520371
    ],
    [
        283474,
        532727
    ],
    [
        277027,
        536847
    ],
    [
        396903,
        591235
    ],
    [
        407040,
        577739
    ],
    [
        404420,
        577532
    ],
    [
        400380,
        588221
    ],
    [
        386373,
        606623
    ],
    [
        405542,
        600089
    ],
    [
        286990,
        529505
    ],
    [
        289002,
        520678
    ],
    [
        285152,
        520229
    ],
    [
        262846,
        559590
    ],
    [
        280110,
        522025
    ],
    [
        281979,
        518199
    ],
    [
        279008,
        521035
    ],
    [
        265815,
        540385
    ],
    [
        408689,
        562521
    ],
    [
        413894,
        564459
    ],
    [
        411796,
        581307
    ],
    [
        419151,
        577335
    ],
    [
        415881,
        584352
    ],
    [
        409616,
        575024
    ],
    [
        412500,
        594675
    ],
    [
        412767,
        593558
    ],
    [
        410917,
        614521
    ],
    [
        411008,
        607342
    ],
    [
        403004,
        613466
    ],
    [
        257984,
        555707
    ],
    [
        259173,
        548593
    ],
    [
        269126,
        508814
    ],
    [
        261538,
        525920
    ],
    [
        260096,
        530550
    ],
    [
        404782,
        557913
    ],
    [
        405652,
        622938
    ]
]);
function euclidDistance(p, q) {
  //Returns euclidean distance between vectors p and q.
  var sum = 0;
  var i = Math.min(p.length, q.length);

  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }

  return Math.sqrt(sum);
};
function coordinate(array){
  var dataArray = [];
  for (let i = 0; i < array.length; i++) {
    dataArray.push({x : array[i][0], y : array[i][1]})
  }
  return dataArray;
}
function deCoordinate(array){
    //Removes x-y coordinates from arrays
    var dataArray = [];
    for (let i = 0; i < array.length; i++) {
      dataArray.push([array[i]["x"], array[i]["y"]])
    }
    return dataArray;
  }
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
/*
function flatness(data){
  return 2*Math.sqrt(shoelace(data)*Math.PI)/perimeter(data);
}
  */
function getAngle(x, y){
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
    return angle;
}

function simplifyShell(inputShell){
    let shell = deCoordinate(inputShell);
    let n = shell.length;
    let precision = 15;
    let angle1 = 0;
    let angle2 = 0;
    let difference = 0;
    //Trims vertices from the shell which change the angle of the incoming line by less than precision degrees
    for (let i = 0; i < n - 2; i++){
        angle1 = getAngle(shell[i], shell[i + 1]);
        angle2 = getAngle(shell[i + 1], shell[i + 2]);
        difference = angle2 - angle1;
        if ((-1*precision < difference && difference < precision) || (-1* precision < difference + 360 && difference + 360 < precision) || (-1 * precision < difference - 360 && difference - 360 < precision)){
            shell.splice(i + 1, 1);
            i--;
            n--;
        }
    }   
  
    angle1 = getAngle(shell[n - 2], shell[n - 1]);
    angle2 = getAngle(shell[n - 1], shell[0]);
    difference = angle2 - angle1;
    if ((-1 * precision < difference && difference < precision) || (-1 * precision < difference + 360 && difference + 360 < precision) || (-1 * precision < difference - 360 && difference - 360 < precision)) {
      shell.splice(n-1, 1);
      n--;
    }
  
    angle1 = getAngle(shell[n - 1], shell[0]);
    angle2 = getAngle(shell[0], shell[1]);
    difference = angle2 - angle1;
    if ((-1 * precision < difference && difference < precision) || (-1 * precision < difference + 360 && difference + 360 < precision) || (-1 * precision < difference - 360 && difference - 360 < precision)) {
      shell.splice(0, 1);
      n--;
    }
  
      let peri = perimeter(coordinate(shell));
      console.log(JSON.parse(JSON.stringify(shell)));
      for (let i = 0; i < n - 3; i++){
        if (euclidDistance(shell[i+1], shell[i+2]) < peri / 16){
          angle1 = getAngle(shell[i], shell[i + 1]);
          angle2 = getAngle(shell[i + 2], shell[i + 3]);
          console.log(angle1);
          console.log(angle2);
          difference = angle2 - angle1;
          if (!((160 < difference && difference < 200) || (160 < difference + 360 && difference + 360 < 200) || (160 < difference - 360 && difference - 360 < 200))){
            let newPoint = completeAngle(shell[i], shell[i + 1], shell[i + 2], shell[i + 3])
            shell[i + 1] = newPoint;
            console.log("before slice");
            console.log(JSON.parse(JSON.stringify(shell)));
            shell.splice(i + 2, 1);
            console.log("after slice");
            console.log(JSON.parse(JSON.stringify(shell)));
            i--;
            n--;
          }
        }
      }
      /*
    if (n < 5){
      return coordinate(shell);
    }
  
    if (euclidDistance(shell[n - 2], shell[n - 1]) < peri / 16) {
      angle1 = getAngle(shell[n - 3], shell[n - 2]);
      angle2 = getAngle(shell[n - 1], shell[0]);
      difference = angle2 - angle1;
      if (!((160 < difference && difference < 200) || (160 < difference + 360 && difference + 360 < 200) || (160 < difference - 360 && difference - 360 < 200))) {
        let newPoint = completeAngle(shell[n - 3], shell[n - 2], shell[n - 1], shell[0])
        shell[n - 2] = newPoint;
        shell.slice(n - 1, 1);
        n--;
      }
    }
    if (n < 5){
      return coordinate(shell);
    }
    if (euclidDistance(shell[n - 1], shell[0]) < peri / 16) {
      angle1 = getAngle(shell[n - 2], shell[n - 1]);
      angle2 = getAngle(shell[0], shell[1]);
      difference = angle2 - angle1;
      if (!((160 < difference && difference < 200) || (160 < difference + 360 && difference + 360 < 200) || (160 < difference - 360 && difference - 360 < 200))) {
        let newPoint = completeAngle(shell[n - 2], shell[n - 1], shell[0], shell[1])
        shell[n - 1] = newPoint;
        shell.slice(0, 1);
        n--;
      }
    }
    if (n < 5){
      return coordinate(shell);
    }
    if (euclidDistance(shell[0], shell[1]) < peri / 16) {
      angle1 = getAngle(shell[n - 1], shell[0]);
      angle2 = getAngle(shell[1], shell[2]);
      difference = angle2 - angle1;
      if (!((160 < difference && difference < 200) || (160 < difference + 360 && difference + 360 < 200) || (160 < difference - 360 && difference - 360 < 200))) {
        let newPoint = completeAngle(shell[n - 1], shell[0], shell[1], shell[2])
        shell[0] = newPoint;
        shell.slice(1, 1);
        n--;
      }
    } 
      */
    return coordinate(shell);    
  }
  
  function completeAngle(p1, p2, p3, p4){
    //Calculates and returns the intersection point of the lines bridging p1-p2 and p3-p4.
    //See derivation here: https://www.desmos.com/calculator/vmgoniltui If whoever's reading this has an easier way to do this let me know
  
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




let y = [];
let x = [];

for (let point of data){
    x.push(point.x);
    y.push(point.y);
}

shell = convexhull.makeHull(data);
shell = simplifyShell(shell);
let y2 = [];
let x2 = [];

for (let point of shell){
    x2.push(point.x);
    y2.push(point.y);
}
x2.push(shell[0].x);
y2.push(shell[0].y);


TESTER2 = document.getElementById('heatmap1');
var trace1 = {
    x: x,
    y: y,
    mode: 'markers',
    type: 'scatter'
};

var trace2 = {
    x: x2,
    y: y2,
    mode: 'lines+markers',
    type: 'scatter'
};
let temp = [trace1, trace2];
Plotly.newPlot(TESTER2, temp);

console.log(perimeter(data));
console.log(data);
//console.log(flatness(convexhull.makeHull(data)));


