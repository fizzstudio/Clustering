var csv2json = require('csvjson-csv2json');
var data = csv2json(s2Data);
var Plotly = require('plotly.js-dist')
var clustering = require('./node_modules/density-clustering');
var classifyPoint = require("robust-point-in-polygon");
/*

var data1 = [{x:1,y:0}, {x:.707,y:.707}, {x:0,y:1}, {x:-.707,y:.707}, {x:-1,y:0},{x:-.707,y:-.707}, {x:0,y:-1}, {x:.707,y:-.707}];
var data2 = [{x:0,y:0}, {x:1,y:1}, {x:2,y:2}, {x:-3,y:3}, {x:4,y:4},{x:5,y:5}, {x:6,y:6}, {x:7,y:7}]



var data = var data = coordinate([
    [
        664159,
        550946
    ],
    [
        665845,
        557965
    ],
    [
        597173,
        575538
    ],
    [
        618600,
        551446
    ],
    [
        635690,
        608046
    ],
    [
        588100,
        557588
    ],
    [
        582015,
        546191
    ],
    [
        604678,
        574577
    ],
    [
        572029,
        518313
    ],
    [
        604737,
        574591
    ],
    [
        577728,
        587566
    ],
    [
        602013,
        574722
    ],
    [
        627968,
        574625
    ],
    [
        607269,
        536961
    ],
    [
        603145,
        574795
    ],
    [
        671919,
        571761
    ],
    [
        612184,
        570393
    ],
    [
        600032,
        575310
    ],
    [
        627912,
        593892
    ],
    [
        601967,
        604428
    ],
    [
        591851,
        569051
    ],
    [
        601444,
        572693
    ],
    [
        629718,
        558104
    ],
    [
        661430,
        603567
    ],
    [
        597551,
        556737
    ],
    [
        601182,
        582584
    ],
    [
        562704,
        570596
    ],
    [
        605107,
        563429
    ],
    [
        607214,
        575069
    ],
    [
        568824,
        570203
    ],
    [
        612485,
        518009
    ],
    [
        589244,
        573777
    ],
    [
        625579,
        551084
    ],
    [
        560237,
        500154
    ],
    [
        626224,
        569687
    ],
    [
        610666,
        551701
    ],
    [
        597428,
        569940
    ],
    [
        600582,
        599535
    ],
    [
        604168,
        555003
    ],
    [
        613871,
        550423
    ],
    [
        617310,
        551945
    ],
    [
        625728,
        579460
    ],
    [
        606300,
        566708
    ],
    [
        638559,
        558807
    ],
    [
        582176,
        630383
    ],
    [
        544056,
        577786
    ],
    [
        631297,
        578351
    ],
    [
        561574,
        621747
    ],
    [
        604973,
        574773
    ],
    [
        605284,
        556134
    ],
    [
        617910,
        592293
    ],
    [
        555904,
        640401
    ],
    [
        526559,
        509417
    ],
    [
        603849,
        572396
    ],
    [
        598634,
        619900
    ],
    [
        603359,
        589262
    ],
    [
        657455,
        567754
    ],
    [
        614279,
        599251
    ],
    [
        578496,
        631434
    ],
    [
        645171,
        595209
    ],
    [
        688015,
        533535
    ],
    [
        656477,
        573007
    ],
    [
        540029,
        563888
    ],
    [
        597418,
        538362
    ],
    [
        613545,
        574733
    ],
    [
        628696,
        542447
    ],
    [
        604157,
        574191
    ],
    [
        603126,
        497987
    ],
    [
        605850,
        533310
    ],
    [
        596179,
        529556
    ],
    [
        610330,
        552628
    ],
    [
        598184,
        531473
    ],
    [
        620438,
        511694
    ],
    [
        600202,
        622079
    ],
    [
        603021,
        577991
    ],
    [
        515612,
        540643
    ],
    [
        606548,
        574376
    ],
    [
        593490,
        623110
    ],
    [
        607084,
        595500
    ],
    [
        583728,
        563146
    ],
    [
        616044,
        533807
    ],
    [
        624452,
        584622
    ],
    [
        604438,
        574666
    ],
    [
        625709,
        660145
    ],
    [
        601376,
        579831
    ],
    [
        565148,
        557305
    ],
    [
        639418,
        537903
    ],
    [
        612799,
        537497
    ],
    [
        583653,
        652182
    ],
    [
        599808,
        596484
    ],
    [
        605250,
        573272
    ],
    [
        606738,
        601356
    ],
    [
        611044,
        571814
    ],
    [
        575440,
        568511
    ],
    [
        616329,
        529516
    ],
    [
        605927,
        572533
    ],
    [
        609286,
        586782
    ],
    [
        647354,
        579190
    ],
    [
        606929,
        571420
    ],
    [
        562920,
        559223
    ],
    [
        680357,
        620811
    ],
    [
        707100,
        601463
    ],
    [
        604294,
        574368
    ],
    [
        614917,
        600946
    ],
    [
        611508,
        503220
    ],
    [
        603789,
        574474
    ],
    [
        551740,
        588768
    ],
    [
        546031,
        570429
    ],
    [
        569197,
        559307
    ],
    [
        688712,
        568754
    ],
    [
        604067,
        574091
    ],
    [
        606809,
        572101
    ],
    [
        588597,
        622592
    ],
    [
        613840,
        534167
    ],
    [
        576263,
        547239
    ],
    [
        597077,
        568196
    ],
    [
        601339,
        571609
    ],
    [
        606011,
        569426
    ],
    [
        593398,
        559764
    ],
    [
        593166,
        622725
    ],
    [
        609796,
        532982
    ],
    [
        712648,
        607541
    ],
    [
        585048,
        505097
    ],
    [
        525967,
        565687
    ],
    [
        660327,
        585901
    ],
    [
        607604,
        573951
    ],
    [
        604001,
        573587
    ],
    [
        591484,
        571087
    ],
    [
        613868,
        585089
    ],
    [
        645464,
        660478
    ],
    [
        538571,
        654649
    ],
    [
        555429,
        604551
    ],
    [
        597620,
        586226
    ],
    [
        586097,
        567445
    ],
    [
        545235,
        539822
    ],
    [
        649088,
        575733
    ],
    [
        599123,
        616977
    ],
    [
        563763,
        559454
    ],
    [
        617717,
        613939
    ],
    [
        618869,
        577243
    ],
    [
        567188,
        560044
    ],
    [
        636628,
        533309
    ],
    [
        560362,
        567914
    ],
    [
        595014,
        632844
    ],
    [
        605876,
        550640
    ],
    [
        604352,
        573425
    ],
    [
        600679,
        599545
    ],
    [
        596891,
        579476
    ],
    [
        614943,
        540976
    ],
    [
        604415,
        571400
    ],
    [
        603698,
        573585
    ],
    [
        658199,
        568743
    ],
    [
        598759,
        582942
    ],
    [
        671269,
        590258
    ],
    [
        593317,
        534085
    ],
    [
        657985,
        453405
    ],
    [
        608557,
        590278
    ],
    [
        623004,
        508050
    ],
    [
        601900,
        569391
    ],
    [
        641031,
        593074
    ],
    [
        589658,
        640498
    ],
    [
        567565,
        573952
    ],
    [
        559078,
        570088
    ],
    [
        639431,
        588155
    ],
    [
        566609,
        537592
    ],
    [
        568570,
        579335
    ],
    [
        660650,
        615038
    ],
    [
        667639,
        571164
    ],
    [
        596796,
        529933
    ],
    [
        606111,
        617846
    ],
    [
        616060,
        590779
    ],
    [
        602873,
        527864
    ],
    [
        571334,
        594145
    ],
    [
        602167,
        543919
    ],
    [
        605100,
        573307
    ],
    [
        546640,
        560043
    ],
    [
        585195,
        555011
    ],
    [
        651740,
        589474
    ],
    [
        589112,
        536573
    ],
    [
        582057,
        543124
    ],
    [
        690968,
        555952
    ],
    [
        609030,
        552436
    ],
    [
        632125,
        541413
    ],
    [
        603445,
        630598
    ],
    [
        628264,
        616214
    ],
    [
        577242,
        574073
    ],
    [
        604090,
        574392
    ],
    [
        607911,
        576556
    ],
    [
        600665,
        638890
    ],
    [
        600117,
        539079
    ],
    [
        631182,
        565466
    ],
    [
        695646,
        652231
    ],
    [
        619445,
        567491
    ],
    [
        613191,
        571942
    ],
    [
        567428,
        580005
    ],
    [
        590583,
        623314
    ],
    [
        606289,
        670243
    ],
    [
        585175,
        574133
    ],
    [
        634967,
        579020
    ],
    [
        614615,
        574437
    ],
    [
        593061,
        579188
    ],
    [
        606933,
        576409
    ],
    [
        606587,
        573873
    ],
    [
        594084,
        629464
    ],
    [
        683697,
        581516
    ],
    [
        601530,
        577183
    ],
    [
        603055,
        589818
    ],
    [
        616561,
        619007
    ],
    [
        607463,
        477085
    ],
    [
        611581,
        572630
    ],
    [
        579712,
        568354
    ],
    [
        602887,
        595245
    ],
    [
        600039,
        557139
    ],
    [
        605913,
        579526
    ],
    [
        579773,
        568698
    ],
    [
        606324,
        544357
    ],
    [
        605958,
        573728
    ],
    [
        606144,
        575076
    ],
    [
        667472,
        570571
    ],
    [
        580048,
        565009
    ],
    [
        597802,
        576113
    ],
    [
        610263,
        574422
    ],
    [
        603855,
        575180
    ],
    [
        624369,
        532153
    ],
    [
        599870,
        591110
    ],
    [
        577167,
        617095
    ],
    [
        658403,
        611332
    ],
    [
        563460,
        480559
    ],
    [
        610980,
        522819
    ],
    [
        569422,
        567790
    ],
    [
        627727,
        578737
    ],
    [
        592804,
        584539
    ],
    [
        540783,
        626497
    ],
    [
        591823,
        639096
    ],
    [
        637323,
        549567
    ],
    [
        638078,
        629421
    ],
    [
        611315,
        560757
    ],
    [
        647103,
        573853
    ],
    [
        522993,
        595581
    ],
    [
        601187,
        531825
    ],
    [
        533799,
        564377
    ],
    [
        649034,
        528813
    ],
    [
        620975,
        564344
    ],
    [
        622407,
        583192
    ],
    [
        597026,
        642918
    ],
    [
        551291,
        576721
    ],
    [
        608768,
        610525
    ],
    [
        697959,
        614701
    ],
    [
        658281,
        582264
    ],
    [
        546632,
        599204
    ],
    [
        672565,
        564468
    ],
    [
        636500,
        587401
    ],
    [
        696144,
        548705
    ],
    [
        533551,
        582247
    ],
    [
        526802,
        551524
    ],
    [
        553038,
        606418
    ],
    [
        696601,
        603624
    ],
    [
        588964,
        597435
    ],
    [
        716139,
        621721
    ],
    [
        608529,
        586311
    ],
    [
        557378,
        567033
    ],
    [
        589994,
        610890
    ],
    [
        589344,
        563119
    ],
    [
        624415,
        515911
    ],
    [
        565483,
        551512
    ],
    [
        584895,
        574666
    ],
    [
        582777,
        542670
    ],
    [
        639394,
        576728
    ],
    [
        608298,
        573748
    ],
    [
        663578,
        586265
    ],
    [
        628080,
        562986
    ],
    [
        597421,
        554767
    ],
    [
        595193,
        576508
    ],
    [
        658103,
        572250
    ],
    [
        659529,
        498474
    ],
    [
        606415,
        581386
    ],
    [
        641976,
        577433
    ],
    [
        587466,
        564953
    ],
    [
        589180,
        595099
    ],
    [
        601885,
        573083
    ],
    [
        580561,
        528916
    ],
    [
        621726,
        578003
    ],
    [
        558817,
        576255
    ],
    [
        620213,
        574468
    ],
    [
        594010,
        570095
    ],
    [
        541976,
        512639
    ],
    [
        593840,
        578685
    ],
    [
        602667,
        575857
    ],
    [
        631446,
        561156
    ],
    [
        596481,
        567449
    ],
    [
        611318,
        581584
    ],
    [
        568546,
        564911
    ],
    [
        593865,
        572987
    ],
    [
        597017,
        575588
    ],
    [
        578804,
        573582
    ],
    [
        673750,
        594081
    ],
    [
        592714,
        553958
    ],
    [
        594029,
        586701
    ],
    [
        668502,
        563937
    ],
    [
        629533,
        537542
    ]
])
*/
//var data = coordinate([[-1 ,0], [0, 1], [1, 0], [0, -1]]);
//var data = coordinate([[0 ,0], [1, 1], [3, 1], [2,0]]);
var data = coordinate([
    [
        664159,
        550946
    ],
    [
        665845,
        557965
    ],
    [
        597173,
        575538
    ],
    [
        618600,
        551446
    ],
    [
        635690,
        608046
    ],
    [
        588100,
        557588
    ],
    [
        582015,
        546191
    ],
    [
        604678,
        574577
    ],
    [
        572029,
        518313
    ],
    [
        604737,
        574591
    ],
    [
        577728,
        587566
    ],
    [
        602013,
        574722
    ],
    [
        627968,
        574625
    ],
    [
        607269,
        536961
    ],
    [
        603145,
        574795
    ],
    [
        671919,
        571761
    ],
    [
        612184,
        570393
    ],
    [
        600032,
        575310
    ],
    [
        627912,
        593892
    ],
    [
        601967,
        604428
    ],
    [
        591851,
        569051
    ],
    [
        601444,
        572693
    ],
    [
        629718,
        558104
    ],
    [
        661430,
        603567
    ],
    [
        597551,
        556737
    ],
    [
        601182,
        582584
    ],
    [
        562704,
        570596
    ],
    [
        605107,
        563429
    ],
    [
        607214,
        575069
    ],
    [
        568824,
        570203
    ],
    [
        612485,
        518009
    ],
    [
        589244,
        573777
    ],
    [
        625579,
        551084
    ],
    [
        560237,
        500154
    ],
    [
        626224,
        569687
    ],
    [
        610666,
        551701
    ],
    [
        597428,
        569940
    ],
    [
        600582,
        599535
    ],
    [
        604168,
        555003
    ],
    [
        613871,
        550423
    ],
    [
        617310,
        551945
    ],
    [
        625728,
        579460
    ],
    [
        606300,
        566708
    ],
    [
        638559,
        558807
    ],
    [
        582176,
        630383
    ],
    [
        544056,
        577786
    ],
    [
        631297,
        578351
    ],
    [
        561574,
        621747
    ],
    [
        604973,
        574773
    ],
    [
        605284,
        556134
    ],
    [
        617910,
        592293
    ],
    [
        555904,
        640401
    ],
    [
        526559,
        509417
    ],
    [
        603849,
        572396
    ],
    [
        598634,
        619900
    ],
    [
        603359,
        589262
    ],
    [
        657455,
        567754
    ],
    [
        614279,
        599251
    ],
    [
        578496,
        631434
    ],
    [
        645171,
        595209
    ],
    [
        688015,
        533535
    ],
    [
        656477,
        573007
    ],
    [
        540029,
        563888
    ],
    [
        597418,
        538362
    ],
    [
        613545,
        574733
    ],
    [
        628696,
        542447
    ],
    [
        604157,
        574191
    ],
    [
        603126,
        497987
    ],
    [
        605850,
        533310
    ],
    [
        596179,
        529556
    ],
    [
        610330,
        552628
    ],
    [
        598184,
        531473
    ],
    [
        620438,
        511694
    ],
    [
        600202,
        622079
    ],
    [
        603021,
        577991
    ],
    [
        515612,
        540643
    ],
    [
        606548,
        574376
    ],
    [
        593490,
        623110
    ],
    [
        607084,
        595500
    ],
    [
        583728,
        563146
    ],
    [
        616044,
        533807
    ],
    [
        624452,
        584622
    ],
    [
        604438,
        574666
    ],
    [
        625709,
        660145
    ],
    [
        601376,
        579831
    ],
    [
        565148,
        557305
    ],
    [
        639418,
        537903
    ],
    [
        612799,
        537497
    ],
    [
        583653,
        652182
    ],
    [
        599808,
        596484
    ],
    [
        605250,
        573272
    ],
    [
        606738,
        601356
    ],
    [
        611044,
        571814
    ],
    [
        575440,
        568511
    ],
    [
        616329,
        529516
    ],
    [
        605927,
        572533
    ],
    [
        609286,
        586782
    ],
    [
        647354,
        579190
    ],
    [
        606929,
        571420
    ],
    [
        562920,
        559223
    ],
    [
        680357,
        620811
    ],
    [
        707100,
        601463
    ],
    [
        604294,
        574368
    ],
    [
        614917,
        600946
    ],
    [
        611508,
        503220
    ],
    [
        603789,
        574474
    ],
    [
        551740,
        588768
    ],
    [
        546031,
        570429
    ],
    [
        569197,
        559307
    ],
    [
        688712,
        568754
    ],
    [
        604067,
        574091
    ],
    [
        606809,
        572101
    ],
    [
        588597,
        622592
    ],
    [
        613840,
        534167
    ],
    [
        576263,
        547239
    ],
    [
        597077,
        568196
    ],
    [
        601339,
        571609
    ],
    [
        606011,
        569426
    ],
    [
        593398,
        559764
    ],
    [
        593166,
        622725
    ],
    [
        609796,
        532982
    ],
    [
        712648,
        607541
    ],
    [
        585048,
        505097
    ],
    [
        525967,
        565687
    ],
    [
        660327,
        585901
    ],
    [
        607604,
        573951
    ],
    [
        604001,
        573587
    ],
    [
        591484,
        571087
    ],
    [
        613868,
        585089
    ],
    [
        645464,
        660478
    ],
    [
        538571,
        654649
    ],
    [
        555429,
        604551
    ],
    [
        597620,
        586226
    ],
    [
        586097,
        567445
    ],
    [
        545235,
        539822
    ],
    [
        649088,
        575733
    ],
    [
        599123,
        616977
    ],
    [
        563763,
        559454
    ],
    [
        617717,
        613939
    ],
    [
        618869,
        577243
    ],
    [
        567188,
        560044
    ],
    [
        636628,
        533309
    ],
    [
        560362,
        567914
    ],
    [
        595014,
        632844
    ],
    [
        605876,
        550640
    ],
    [
        604352,
        573425
    ],
    [
        600679,
        599545
    ],
    [
        596891,
        579476
    ],
    [
        614943,
        540976
    ],
    [
        604415,
        571400
    ],
    [
        603698,
        573585
    ],
    [
        658199,
        568743
    ],
    [
        598759,
        582942
    ],
    [
        671269,
        590258
    ],
    [
        593317,
        534085
    ],
    [
        657985,
        453405
    ],
    [
        608557,
        590278
    ],
    [
        623004,
        508050
    ],
    [
        601900,
        569391
    ],
    [
        641031,
        593074
    ],
    [
        589658,
        640498
    ],
    [
        567565,
        573952
    ],
    [
        559078,
        570088
    ],
    [
        639431,
        588155
    ],
    [
        566609,
        537592
    ],
    [
        568570,
        579335
    ],
    [
        660650,
        615038
    ],
    [
        667639,
        571164
    ],
    [
        596796,
        529933
    ],
    [
        606111,
        617846
    ],
    [
        616060,
        590779
    ],
    [
        602873,
        527864
    ],
    [
        571334,
        594145
    ],
    [
        602167,
        543919
    ],
    [
        605100,
        573307
    ],
    [
        546640,
        560043
    ],
    [
        585195,
        555011
    ],
    [
        651740,
        589474
    ],
    [
        589112,
        536573
    ],
    [
        582057,
        543124
    ],
    [
        690968,
        555952
    ],
    [
        609030,
        552436
    ],
    [
        632125,
        541413
    ],
    [
        603445,
        630598
    ],
    [
        628264,
        616214
    ],
    [
        577242,
        574073
    ],
    [
        604090,
        574392
    ],
    [
        607911,
        576556
    ],
    [
        600665,
        638890
    ],
    [
        600117,
        539079
    ],
    [
        631182,
        565466
    ],
    [
        695646,
        652231
    ],
    [
        619445,
        567491
    ],
    [
        613191,
        571942
    ],
    [
        567428,
        580005
    ],
    [
        590583,
        623314
    ],
    [
        606289,
        670243
    ],
    [
        585175,
        574133
    ],
    [
        634967,
        579020
    ],
    [
        614615,
        574437
    ],
    [
        593061,
        579188
    ],
    [
        606933,
        576409
    ],
    [
        606587,
        573873
    ],
    [
        594084,
        629464
    ],
    [
        683697,
        581516
    ],
    [
        601530,
        577183
    ],
    [
        603055,
        589818
    ],
    [
        616561,
        619007
    ],
    [
        607463,
        477085
    ],
    [
        611581,
        572630
    ],
    [
        579712,
        568354
    ],
    [
        602887,
        595245
    ],
    [
        600039,
        557139
    ],
    [
        605913,
        579526
    ],
    [
        579773,
        568698
    ],
    [
        606324,
        544357
    ],
    [
        605958,
        573728
    ],
    [
        606144,
        575076
    ],
    [
        667472,
        570571
    ],
    [
        580048,
        565009
    ],
    [
        597802,
        576113
    ],
    [
        610263,
        574422
    ],
    [
        603855,
        575180
    ],
    [
        624369,
        532153
    ],
    [
        599870,
        591110
    ],
    [
        577167,
        617095
    ],
    [
        658403,
        611332
    ],
    [
        563460,
        480559
    ],
    [
        610980,
        522819
    ],
    [
        569422,
        567790
    ],
    [
        627727,
        578737
    ],
    [
        592804,
        584539
    ],
    [
        540783,
        626497
    ],
    [
        591823,
        639096
    ],
    [
        637323,
        549567
    ],
    [
        638078,
        629421
    ],
    [
        611315,
        560757
    ],
    [
        647103,
        573853
    ],
    [
        522993,
        595581
    ],
    [
        601187,
        531825
    ],
    [
        533799,
        564377
    ],
    [
        649034,
        528813
    ],
    [
        620975,
        564344
    ],
    [
        622407,
        583192
    ],
    [
        597026,
        642918
    ],
    [
        551291,
        576721
    ],
    [
        608768,
        610525
    ],
    [
        697959,
        614701
    ],
    [
        658281,
        582264
    ],
    [
        546632,
        599204
    ],
    [
        672565,
        564468
    ],
    [
        636500,
        587401
    ],
    [
        696144,
        548705
    ],
    [
        533551,
        582247
    ],
    [
        526802,
        551524
    ],
    [
        553038,
        606418
    ],
    [
        696601,
        603624
    ],
    [
        588964,
        597435
    ],
    [
        716139,
        621721
    ],
    [
        608529,
        586311
    ],
    [
        557378,
        567033
    ],
    [
        589994,
        610890
    ],
    [
        589344,
        563119
    ],
    [
        624415,
        515911
    ],
    [
        565483,
        551512
    ],
    [
        584895,
        574666
    ],
    [
        582777,
        542670
    ],
    [
        639394,
        576728
    ],
    [
        608298,
        573748
    ],
    [
        663578,
        586265
    ],
    [
        628080,
        562986
    ],
    [
        597421,
        554767
    ],
    [
        595193,
        576508
    ],
    [
        658103,
        572250
    ],
    [
        659529,
        498474
    ],
    [
        606415,
        581386
    ],
    [
        641976,
        577433
    ],
    [
        587466,
        564953
    ],
    [
        589180,
        595099
    ],
    [
        601885,
        573083
    ],
    [
        580561,
        528916
    ],
    [
        621726,
        578003
    ],
    [
        558817,
        576255
    ],
    [
        620213,
        574468
    ],
    [
        594010,
        570095
    ],
    [
        541976,
        512639
    ],
    [
        593840,
        578685
    ],
    [
        602667,
        575857
    ],
    [
        631446,
        561156
    ],
    [
        596481,
        567449
    ],
    [
        611318,
        581584
    ],
    [
        568546,
        564911
    ],
    [
        593865,
        572987
    ],
    [
        597017,
        575588
    ],
    [
        578804,
        573582
    ],
    [
        673750,
        594081
    ],
    [
        592714,
        553958
    ],
    [
        594029,
        586701
    ],
    [
        668502,
        563937
    ],
    [
        629533,
        537542
    ]
])
var dataArray = deCoordinate(data);
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
/*
var fizzscan = new clustering.FIZZSCAN();
var clusters = fizzscan.run(dataArray, 2*distAvg[minPts], minPts, true);
console.log(clusters, fizzscan.noise);
console.log(`Number of clusters: ${clusters.length}`)
console.log(`Total elements: ${clusters.flat().length + fizzscan.noise.length}`)
console.log(`Total clustered elements: ${clusters.flat().length}`)
console.log(`Total noise elements: ${fizzscan.noise.length}`)

var fizzscan = new clustering.DBSCAN();
var clusters = fizzscan.run(dataArray, 2*distAvg[minPts], minPts);
console.log(clusters, fizzscan.noise);
const hasCommonItem = clusters.flat().some(item => fizzscan.noise.includes(item));
console.log(hasCommonItem);
console.log(`Number of clusters: ${clusters.length}`)
console.log(`Total elements: ${clusters.flat().length + fizzscan.noise.length}`)
console.log(`Total clustered elements: ${clusters.flat().length}`)
console.log(`Total noise elements: ${fizzscan.noise.length}`)
*/



function nNDistances(dataset, pointId) {
    //Returns list of distances from nearest neighbors for a point, sorted low to high.
    var distances = [];
    for (var id = 0; id < dataset.length; id++) {
      var dist = euclidDistance(dataset[pointId], dataset[id]);
      distances.push(dist);
    }
    
    return distances.sort((a, b) => { return a - b; });
  };
function euclidDistance(p, q) {
  //Returns euclidean distance between vectors p and q.
  var sum = 0;
  var i = Math.min(p.length, q.length);

  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }

  return Math.sqrt(sum);
};
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
function shoelace(data){
  let sum = 0;
  let n = data.length;
  for (let i = 0; i < n - 1; i++){
      sum += data[i].x * data[i + 1].y - data[i].y * data[i + 1].x
  }
  sum += data[n - 1].x * data[0].y - data[n - 1].y * data[0].x
  return Math.abs(sum/2);
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

function flatness(data){
  return 2*Math.sqrt(shoelace(data)*Math.PI)/perimeter(data);
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

    function judgeShape(data) {
        //console.log(data);
        let h = convexhull.makeHull(coordinate(data));
        //console.log(h);
        let flat = flatness(h);
        //console.log(flat);
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


let y = [];
let x = [];

for (let point of data){
    x.push(point.x);
    y.push(point.y);
}

shell = convexhull.makeHull(data);
//shell = simplifyHull(shell);
let y2 = [];
let x2 = [];

for (let point of shell){
    x2.push(point.x);
    y2.push(point.y);
}
x2.push(shell[0].x);
y2.push(shell[0].y);



//console.log(judgeShape(data).description);
//console.log(flatness(convexhull.makeHull(data)));
shell = deCoordinate(shell);


var voronoi = new Voronoi();
var bbox = {xl: 500000, xr: 750000, yt: 450000, yb: 700000}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
var sites = data;


var diagram = voronoi.compute(sites, bbox);
console.log(diagram);

var polygon = deCoordinate(shell);


console.log(
  classifyPoint(polygon, [1.5, 1.5]),
  classifyPoint(polygon, [640000, 550000]),
  classifyPoint(polygon, [100000, 10000]))

let edgePoints = [];
let verticesInside = [];

console.log(JSON.parse(JSON.stringify(edgePoints)));
for (let edge of diagram.edges){
    let va = [edge.va.x, edge.va.y];
    let vb = [edge.vb.x, edge.vb.y];
    let n = shell.length;
    for (let i = 0; i < n; i++){
        let intersection = completeAngle(va, vb, shell[i % n], shell[(i + 1) % n])
        if(((intersection[0] > va[0] && intersection[0] < vb[0]) || (intersection[0] < va[0] && intersection[0] > vb[0])) && ((intersection[1] > va[1] && intersection[1] < vb[1]) || (intersection[1] < va[1] && intersection[1] > vb[1]))){
            console.log(intersection[0], va[0], vb[0]);
            //console.log(((intersection[0] > va[0] && intersection[1] < vb[0]) || (intersection[0] < va[0] && intersection[1] > vb[0])));
            //console.log(((intersection[1] > va[1] && intersection[1] < vb[1]) || (intersection[1] < va[1] && intersection[1] > vb[0])));
            edgePoints.push(intersection);
        }
    }
}


for (point of deCoordinate(diagram.vertices)){
    if (classifyPoint(deCoordinate(shell), point) < 1){
        verticesInside.push(point);
    }
}

for (point of edgePoints){
    if (classifyPoint(deCoordinate(shell), point) < 1){
        verticesInside.push(point);
    }
}


console.log(JSON.parse(JSON.stringify(verticesInside)));

let minsArray = [];
for (let vertexID in verticesInside){
    let vertex = verticesInside[vertexID];
    let min = [0,0];
    for (let point of deCoordinate(data)){
        if (min[1] == 0){
            min = [vertexID, euclidDistance(vertex, point)]
        }
        else if (min[1] > euclidDistance(vertex, point)){
            min = [vertexID, euclidDistance(vertex, point)]
        }
    }
    minsArray.push(min);
}





console.log(minsArray.sort((a, b) => {return b[1] - a[1]}));
console.log(verticesInside[3]);
console.log(verticesInside[6]);
console.log(verticesInside[571]);  
verticesInside = coordinate(verticesInside);
let x3 = [verticesInside[3].x, verticesInside[6].x, verticesInside[571].x]
let y3 = [verticesInside[3].y, verticesInside[6].y, verticesInside[571].y]

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

var trace3 = {
    x: x3,
    y: y3,
    mode: 'markers',
    type: 'scatter'
};
let temp = [trace1, trace2, trace3];
Plotly.newPlot(TESTER2, temp);


