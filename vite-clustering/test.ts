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
    {
        "x": 645233,
        "y": 927201
    },
    {
        "x": 648590,
        "y": 917839
    },
    {
        "x": 644301,
        "y": 925034
    },
    {
        "x": 636871,
        "y": 929410
    },
    {
        "x": 659046,
        "y": 930099
    },
    {
        "x": 642843,
        "y": 909185
    },
    {
        "x": 662249,
        "y": 918050
    },
    {
        "x": 664639,
        "y": 925795
    },
    {
        "x": 665697,
        "y": 929571
    },
    {
        "x": 640210,
        "y": 902029
    },
    {
        "x": 646422,
        "y": 900526
    },
    {
        "x": 674134,
        "y": 908464
    },
    {
        "x": 669430,
        "y": 905798
    },
    {
        "x": 641840,
        "y": 886745
    },
    {
        "x": 634004,
        "y": 895206
    },
    {
        "x": 652233,
        "y": 886054
    },
    {
        "x": 658034,
        "y": 897179
    },
    {
        "x": 653181,
        "y": 886417
    },
    {
        "x": 678869,
        "y": 902492
    },
    {
        "x": 688118,
        "y": 911574
    },
    {
        "x": 682510,
        "y": 905902
    },
    {
        "x": 679054,
        "y": 898217
    },
    {
        "x": 683610,
        "y": 910782
    },
    {
        "x": 676962,
        "y": 897430
    },
    {
        "x": 683585,
        "y": 905984
    },
    {
        "x": 684131,
        "y": 898331
    },
    {
        "x": 688098,
        "y": 908495
    },
    {
        "x": 677459,
        "y": 896720
    },
    {
        "x": 683941,
        "y": 915579
    },
    {
        "x": 647968,
        "y": 877873
    },
    {
        "x": 656834,
        "y": 885944
    },
    {
        "x": 629998,
        "y": 877765
    },
    {
        "x": 621278,
        "y": 888326
    },
    {
        "x": 657811,
        "y": 885904
    },
    {
        "x": 656957,
        "y": 871011
    },
    {
        "x": 658734,
        "y": 883214
    },
    {
        "x": 655237,
        "y": 871554
    },
    {
        "x": 662898,
        "y": 884734
    },
    {
        "x": 664325,
        "y": 877878
    },
    {
        "x": 658590,
        "y": 886551
    },
    {
        "x": 668234,
        "y": 886696
    },
    {
        "x": 677983,
        "y": 890077
    },
    {
        "x": 679788,
        "y": 889464
    },
    {
        "x": 694308,
        "y": 904062
    },
    {
        "x": 681053,
        "y": 892766
    },
    {
        "x": 673267,
        "y": 883727
    },
    {
        "x": 677404,
        "y": 883871
    },
    {
        "x": 679211,
        "y": 886670
    },
    {
        "x": 684739,
        "y": 884934
    },
    {
        "x": 673242,
        "y": 886958
    },
    {
        "x": 672628,
        "y": 882986
    },
    {
        "x": 696257,
        "y": 894819
    },
    {
        "x": 687325,
        "y": 883004
    },
    {
        "x": 672818,
        "y": 881943
    },
    {
        "x": 644693,
        "y": 867371
    },
    {
        "x": 639997,
        "y": 865965
    },
    {
        "x": 662293,
        "y": 872590
    },
    {
        "x": 656156,
        "y": 868643
    },
    {
        "x": 657981,
        "y": 866945
    },
    {
        "x": 651576,
        "y": 865180
    },
    {
        "x": 649345,
        "y": 864613
    },
    {
        "x": 668839,
        "y": 882598
    },
    {
        "x": 620685,
        "y": 880813
    },
    {
        "x": 618009,
        "y": 867493
    },
    {
        "x": 625416,
        "y": 868848
    },
    {
        "x": 657094,
        "y": 857640
    },
    {
        "x": 657184,
        "y": 855509
    },
    {
        "x": 659081,
        "y": 860560
    },
    {
        "x": 659166,
        "y": 861665
    },
    {
        "x": 665308,
        "y": 868551
    },
    {
        "x": 660459,
        "y": 860658
    },
    {
        "x": 672068,
        "y": 874862
    },
    {
        "x": 664260,
        "y": 859029
    },
    {
        "x": 669748,
        "y": 863109
    },
    {
        "x": 653258,
        "y": 860766
    },
    {
        "x": 666516,
        "y": 859837
    },
    {
        "x": 666315,
        "y": 872311
    },
    {
        "x": 669178,
        "y": 866011
    },
    {
        "x": 669366,
        "y": 869654
    },
    {
        "x": 657879,
        "y": 857942
    },
    {
        "x": 665828,
        "y": 868934
    },
    {
        "x": 666636,
        "y": 858686
    },
    {
        "x": 672474,
        "y": 868765
    },
    {
        "x": 663168,
        "y": 859429
    },
    {
        "x": 670519,
        "y": 870010
    },
    {
        "x": 650661,
        "y": 861267
    },
    {
        "x": 673826,
        "y": 880137
    },
    {
        "x": 649412,
        "y": 856993
    },
    {
        "x": 648230,
        "y": 857418
    },
    {
        "x": 675013,
        "y": 876331
    },
    {
        "x": 674236,
        "y": 877152
    },
    {
        "x": 672800,
        "y": 874378
    },
    {
        "x": 674905,
        "y": 876286
    },
    {
        "x": 678606,
        "y": 878004
    },
    {
        "x": 675866,
        "y": 868784
    },
    {
        "x": 674496,
        "y": 870664
    },
    {
        "x": 671976,
        "y": 864630
    },
    {
        "x": 675357,
        "y": 870850
    },
    {
        "x": 674931,
        "y": 870112
    },
    {
        "x": 673140,
        "y": 864863
    },
    {
        "x": 684558,
        "y": 878573
    },
    {
        "x": 683156,
        "y": 877209
    },
    {
        "x": 683027,
        "y": 876064
    },
    {
        "x": 682481,
        "y": 879399
    },
    {
        "x": 682304,
        "y": 876841
    },
    {
        "x": 700098,
        "y": 894685
    },
    {
        "x": 707894,
        "y": 904500
    },
    {
        "x": 683580,
        "y": 872374
    },
    {
        "x": 685124,
        "y": 873363
    },
    {
        "x": 683321,
        "y": 873932
    },
    {
        "x": 680677,
        "y": 868629
    },
    {
        "x": 691716,
        "y": 873426
    },
    {
        "x": 709303,
        "y": 897538
    },
    {
        "x": 706906,
        "y": 885612
    },
    {
        "x": 689628,
        "y": 868984
    },
    {
        "x": 677896,
        "y": 867053
    },
    {
        "x": 651506,
        "y": 856097
    },
    {
        "x": 633601,
        "y": 861482
    },
    {
        "x": 637665,
        "y": 858741
    },
    {
        "x": 636769,
        "y": 854047
    },
    {
        "x": 640000,
        "y": 863831
    },
    {
        "x": 646671,
        "y": 857872
    },
    {
        "x": 672212,
        "y": 860894
    },
    {
        "x": 671772,
        "y": 860357
    },
    {
        "x": 672059,
        "y": 860501
    },
    {
        "x": 674961,
        "y": 865594
    },
    {
        "x": 668228,
        "y": 858122
    },
    {
        "x": 676360,
        "y": 866112
    },
    {
        "x": 670119,
        "y": 859029
    },
    {
        "x": 668519,
        "y": 860048
    },
    {
        "x": 672668,
        "y": 861428
    },
    {
        "x": 668772,
        "y": 858570
    },
    {
        "x": 672266,
        "y": 862875
    },
    {
        "x": 673410,
        "y": 863889
    },
    {
        "x": 671444,
        "y": 860206
    },
    {
        "x": 669697,
        "y": 859388
    },
    {
        "x": 669288,
        "y": 860515
    },
    {
        "x": 656658,
        "y": 854609
    },
    {
        "x": 668567,
        "y": 856554
    },
    {
        "x": 668367,
        "y": 855686
    },
    {
        "x": 665048,
        "y": 854911
    },
    {
        "x": 667620,
        "y": 855461
    },
    {
        "x": 665426,
        "y": 853940
    },
    {
        "x": 622212,
        "y": 860015
    },
    {
        "x": 615826,
        "y": 863168
    },
    {
        "x": 629377,
        "y": 853726
    },
    {
        "x": 664156,
        "y": 846474
    },
    {
        "x": 671235,
        "y": 856653
    },
    {
        "x": 671325,
        "y": 856592
    },
    {
        "x": 665775,
        "y": 845662
    },
    {
        "x": 672544,
        "y": 859978
    },
    {
        "x": 659734,
        "y": 844127
    },
    {
        "x": 659280,
        "y": 845579
    },
    {
        "x": 648443,
        "y": 845340
    },
    {
        "x": 672598,
        "y": 856928
    },
    {
        "x": 671404,
        "y": 857240
    },
    {
        "x": 667131,
        "y": 849230
    },
    {
        "x": 663049,
        "y": 843538
    },
    {
        "x": 667713,
        "y": 847241
    },
    {
        "x": 669713,
        "y": 851017
    },
    {
        "x": 669427,
        "y": 846395
    },
    {
        "x": 659542,
        "y": 840985
    },
    {
        "x": 674463,
        "y": 862486
    },
    {
        "x": 673646,
        "y": 857346
    },
    {
        "x": 673292,
        "y": 857105
    },
    {
        "x": 674492,
        "y": 861230
    },
    {
        "x": 674265,
        "y": 861435
    },
    {
        "x": 673332,
        "y": 857517
    },
    {
        "x": 673071,
        "y": 856021
    },
    {
        "x": 674121,
        "y": 858589
    },
    {
        "x": 674659,
        "y": 860894
    },
    {
        "x": 674433,
        "y": 860605
    },
    {
        "x": 674472,
        "y": 860330
    },
    {
        "x": 673028,
        "y": 860593
    },
    {
        "x": 674365,
        "y": 860819
    },
    {
        "x": 674311,
        "y": 859933
    },
    {
        "x": 674521,
        "y": 861127
    },
    {
        "x": 673449,
        "y": 860643
    },
    {
        "x": 676220,
        "y": 858214
    },
    {
        "x": 675633,
        "y": 863416
    },
    {
        "x": 677551,
        "y": 860007
    },
    {
        "x": 678195,
        "y": 860537
    },
    {
        "x": 679237,
        "y": 862389
    },
    {
        "x": 676480,
        "y": 860779
    },
    {
        "x": 674151,
        "y": 853540
    },
    {
        "x": 680261,
        "y": 863401
    },
    {
        "x": 676694,
        "y": 851597
    },
    {
        "x": 679799,
        "y": 858680
    },
    {
        "x": 675902,
        "y": 853961
    },
    {
        "x": 679818,
        "y": 860064
    },
    {
        "x": 679747,
        "y": 860939
    },
    {
        "x": 677362,
        "y": 853471
    },
    {
        "x": 682100,
        "y": 853708
    },
    {
        "x": 680592,
        "y": 858526
    },
    {
        "x": 682053,
        "y": 853410
    },
    {
        "x": 678856,
        "y": 850293
    },
    {
        "x": 683413,
        "y": 861559
    },
    {
        "x": 679242,
        "y": 853941
    },
    {
        "x": 683252,
        "y": 858182
    },
    {
        "x": 639463,
        "y": 847461
    },
    {
        "x": 687360,
        "y": 862438
    },
    {
        "x": 692386,
        "y": 863386
    },
    {
        "x": 691827,
        "y": 863963
    },
    {
        "x": 715956,
        "y": 900724
    },
    {
        "x": 694451,
        "y": 863981
    },
    {
        "x": 696808,
        "y": 866039
    },
    {
        "x": 700341,
        "y": 869730
    },
    {
        "x": 693783,
        "y": 860206
    },
    {
        "x": 704574,
        "y": 866263
    },
    {
        "x": 699668,
        "y": 863774
    },
    {
        "x": 703773,
        "y": 870419
    },
    {
        "x": 718544,
        "y": 888401
    },
    {
        "x": 716590,
        "y": 874975
    },
    {
        "x": 708244,
        "y": 871834
    },
    {
        "x": 713088,
        "y": 880834
    },
    {
        "x": 710082,
        "y": 881600
    },
    {
        "x": 717187,
        "y": 883275
    },
    {
        "x": 713579,
        "y": 879202
    },
    {
        "x": 697011,
        "y": 856357
    },
    {
        "x": 626334,
        "y": 852383
    },
    {
        "x": 682241,
        "y": 850176
    },
    {
        "x": 682699,
        "y": 851115
    },
    {
        "x": 672876,
        "y": 844123
    },
    {
        "x": 672797,
        "y": 843231
    },
    {
        "x": 669690,
        "y": 842110
    },
    {
        "x": 681049,
        "y": 846975
    },
    {
        "x": 669638,
        "y": 842011
    },
    {
        "x": 664903,
        "y": 839150
    },
    {
        "x": 610505,
        "y": 851476
    },
    {
        "x": 616281,
        "y": 845406
    },
    {
        "x": 618405,
        "y": 842859
    },
    {
        "x": 627580,
        "y": 840406
    },
    {
        "x": 664355,
        "y": 831472
    },
    {
        "x": 675382,
        "y": 836312
    },
    {
        "x": 673953,
        "y": 835926
    },
    {
        "x": 677769,
        "y": 841641
    },
    {
        "x": 675988,
        "y": 841317
    },
    {
        "x": 683098,
        "y": 847245
    },
    {
        "x": 682420,
        "y": 846881
    },
    {
        "x": 680506,
        "y": 840053
    },
    {
        "x": 680228,
        "y": 843225
    },
    {
        "x": 646816,
        "y": 829778
    },
    {
        "x": 640432,
        "y": 837036
    },
    {
        "x": 638004,
        "y": 837697
    },
    {
        "x": 644843,
        "y": 838626
    },
    {
        "x": 665660,
        "y": 828338
    },
    {
        "x": 663945,
        "y": 828490
    },
    {
        "x": 680969,
        "y": 838864
    },
    {
        "x": 680828,
        "y": 839011
    },
    {
        "x": 682315,
        "y": 843851
    },
    {
        "x": 683656,
        "y": 842406
    },
    {
        "x": 680579,
        "y": 836946
    },
    {
        "x": 676767,
        "y": 832479
    },
    {
        "x": 684537,
        "y": 843821
    },
    {
        "x": 684091,
        "y": 842566
    },
    {
        "x": 689948,
        "y": 850548
    },
    {
        "x": 631316,
        "y": 837043
    },
    {
        "x": 730287,
        "y": 897070
    },
    {
        "x": 705929,
        "y": 851313
    },
    {
        "x": 712262,
        "y": 856869
    },
    {
        "x": 726847,
        "y": 875488
    },
    {
        "x": 730383,
        "y": 879136
    },
    {
        "x": 722463,
        "y": 882675
    },
    {
        "x": 723173,
        "y": 872525
    },
    {
        "x": 731712,
        "y": 878998
    },
    {
        "x": 709254,
        "y": 847444
    },
    {
        "x": 704570,
        "y": 845515
    },
    {
        "x": 688076,
        "y": 833905
    },
    {
        "x": 693362,
        "y": 837786
    },
    {
        "x": 599612,
        "y": 859210
    },
    {
        "x": 604546,
        "y": 847329
    },
    {
        "x": 598671,
        "y": 854219
    },
    {
        "x": 599647,
        "y": 858702
    },
    {
        "x": 627452,
        "y": 835854
    },
    {
        "x": 614497,
        "y": 830844
    },
    {
        "x": 680381,
        "y": 823757
    },
    {
        "x": 680757,
        "y": 826912
    },
    {
        "x": 684602,
        "y": 823981
    },
    {
        "x": 697161,
        "y": 840318
    },
    {
        "x": 694897,
        "y": 834591
    },
    {
        "x": 645563,
        "y": 819480
    },
    {
        "x": 653177,
        "y": 819935
    },
    {
        "x": 650720,
        "y": 817440
    },
    {
        "x": 651216,
        "y": 815098
    },
    {
        "x": 634800,
        "y": 823669
    },
    {
        "x": 645677,
        "y": 814395
    },
    {
        "x": 671609,
        "y": 815681
    },
    {
        "x": 662684,
        "y": 813662
    },
    {
        "x": 702654,
        "y": 841548
    },
    {
        "x": 736557,
        "y": 897961
    },
    {
        "x": 718088,
        "y": 852181
    },
    {
        "x": 718257,
        "y": 857481
    },
    {
        "x": 723397,
        "y": 859761
    },
    {
        "x": 704065,
        "y": 832648
    },
    {
        "x": 693699,
        "y": 822637
    },
    {
        "x": 690018,
        "y": 819280
    },
    {
        "x": 695092,
        "y": 820091
    },
    {
        "x": 699124,
        "y": 824089
    },
    {
        "x": 695260,
        "y": 824882
    },
    {
        "x": 594720,
        "y": 848457
    },
    {
        "x": 601619,
        "y": 825604
    },
    {
        "x": 673196,
        "y": 812941
    },
    {
        "x": 685821,
        "y": 816579
    },
    {
        "x": 689363,
        "y": 817577
    },
    {
        "x": 700747,
        "y": 821557
    },
    {
        "x": 653745,
        "y": 809028
    },
    {
        "x": 670957,
        "y": 810768
    },
    {
        "x": 672387,
        "y": 800443
    },
    {
        "x": 661357,
        "y": 801817
    },
    {
        "x": 664025,
        "y": 801796
    },
    {
        "x": 729194,
        "y": 856897
    },
    {
        "x": 728743,
        "y": 850843
    },
    {
        "x": 687043,
        "y": 806921
    },
    {
        "x": 685551,
        "y": 798742
    },
    {
        "x": 687078,
        "y": 791051
    },
    {
        "x": 751215,
        "y": 828365
    },
    {
        "x": 573324,
        "y": 878802
    },
    {
        "x": 667280,
        "y": 765619
    },
    {
        "x": 600996,
        "y": 890782
    },
    {
        "x": 721401,
        "y": 951880
    },
    {
        "x": 612648,
        "y": 772280
    },
    {
        "x": 722404,
        "y": 952207
    },
    {
        "x": 578509,
        "y": 923881
    },
    {
        "x": 789095,
        "y": 895634
    },
    {
        "x": 567861,
        "y": 856582
    },
    {
        "x": 641902,
        "y": 755287
    },
    {
        "x": 658748,
        "y": 777680
    },
    {
        "x": 654937,
        "y": 781879
    },
    {
        "x": 663095,
        "y": 949045
    },
    {
        "x": 700962,
        "y": 927047
    },
    {
        "x": 653592,
        "y": 959882
    },
    {
        "x": 705518,
        "y": 925936
    },
    {
        "x": 595580,
        "y": 798572
    },
    {
        "x": 753254,
        "y": 840123
    },
    {
        "x": 674114,
        "y": 970756
    },
    {
        "x": 675551,
        "y": 956849
    },
    {
        "x": 693997,
        "y": 774817
    },
    {
        "x": 612392,
        "y": 916853
    },
    {
        "x": 606506,
        "y": 766728
    },
    {
        "x": 708262,
        "y": 945359
    },
    {
        "x": 749941,
        "y": 916922
    },
    {
        "x": 602365,
        "y": 916673
    },
    {
        "x": 603472,
        "y": 894573
    },
    {
        "x": 605535,
        "y": 925341
    },
    {
        "x": 683048,
        "y": 937776
    },
    {
        "x": 571669,
        "y": 873544
    },
    {
        "x": 564416,
        "y": 878492
    },
    {
        "x": 701017,
        "y": 931252
    },
    {
        "x": 735295,
        "y": 814058
    },
    {
        "x": 730887,
        "y": 825972
    },
    {
        "x": 720629,
        "y": 816515
    },
    {
        "x": 739318,
        "y": 810528
    }
]


let xl = 594720
let xr = 736557
let yt = 930099
let yb = 791051

function findHoles(cluster: Array<coord>) {
    //Returns a list of non-overlapping holes, sorted from largest to smallest.
    let clusterData: Array<coord> =  cluster;
    let voronoi = new Voronoi();
    //let bbox = { xl: xl, xr: xr, yt: yt, yb: yb}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
    //let bbox = { xl: 0, xr: 100000, yt: 100000, yb: 0}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
    let bbox = {
        "xl": 564416,
        "xr": 789095,
        "yt": 755287,
        "yb": 970756
    }
    console.log(JSON.parse(JSON.stringify(clusterData)));
    console.log(bbox);
    
    let diagram = voronoi.compute(clusterData, bbox);
    let shell: Array<coord> = makeHull(clusterData)
    console.log(JSON.parse(JSON.stringify(diagram)));
    let edgePoints: Array<Array<number>> = [];
    let verticesInside: Array<Array<number>> = [];
    console.log("cluster data");
    console.log(clusterData);
    for (let edge of diagram.edges) {
        let va: Array<number> = [edge.va.x, edge.va.y];
        let vb: Array<number> = [edge.vb.x, edge.vb.y];
        let n: number = shell.length;
        for (let i = 0; i < n; i++) {
            //console.log("points")
            //console.log(va, vb, shell[i % n], shell[(i + 1) % n]);
            if (!checkParallel(va, vb, shell[i % n], shell[(i + 1) % n])){
                let intersection: Array<number> = completeAngle(va, vb, shell[i % n], shell[(i + 1) % n])
                //console.log("intersection");
                //console.log(intersection);
                if (((intersection[0] > va[0] && intersection[0] < vb[0]) || (intersection[0] < va[0] && intersection[0] > vb[0])) && ((intersection[1] > va[1] && intersection[1] < vb[1]) || (intersection[1] < va[1] && intersection[1] > vb[1]))) {
                //if (((intersection[0] >= va[0] && intersection[0] <= vb[0]) || (intersection[0] <= va[0] && intersection[0] >= vb[0])) && ((intersection[1] >= va[1] && intersection[1] <= vb[1]) || (intersection[1] <= va[1] && intersection[1] >= vb[1]))) {
                    edgePoints.push(intersection);
                }
            }
            
        }
    }

    console.log("vertices");
    console.log(deCoordinate(diagram.vertices));
    console.log("edge points");
    console.log(edgePoints);

    //console.log("shell");
    //console.log(shell);

    for (let point of deCoordinate(diagram.vertices)) {
        if (classifyPoint(deCoordinate(shell), point) < 1) {
            verticesInside.push(point);
        }
    }
    console.log("verticesInside part 1");
    console.log(JSON.parse(JSON.stringify(verticesInside)));
    for (let point of edgePoints) {
        console.log(point);
        console.log(classifyPoint(deCoordinate(shell), point))
        verticesInside.push(point);
    }

    console.log("verticesInside part 2");
    console.log(JSON.parse(JSON.stringify(verticesInside)));

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


    let closest: Array<any> = []
    for (let i = 0; i < sorted.length; i++) {
        closest.push([verticesInside[sorted[i][0]], sorted[i][1]])
    }
    console.log("Closest");
    console.log(closest);
}
findHoles(test);
type coord = {
    x: number,
    y: number
}

