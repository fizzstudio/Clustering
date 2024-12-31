(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//var s1 = require('./s1.js')
//console.log(s1.data);
var clustering = require('./node_modules/density-clustering');
var csv2json = require('csvjson-csv2json');
const silhouette = require('@robzzson/silhouette');


//const data = csv2json(get());
const data = csv2json(s2Data);


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
var clusters = fizzscan.run(dataArray, 1.625*distAvg[minPts], minPts, true);
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





},{"./node_modules/density-clustering":9,"@robzzson/silhouette":2,"csvjson-csv2json":3}],2:[function(require,module,exports){
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mlDistanceEuclidean = require('ml-distance-euclidean');
var distanceMatrix = _interopDefault(require('ml-distance-matrix'));

/**
 * Calculate Silhouette Coefficient
 * @param {Array<Array<number>>} data - list of input data samples
 * @param {Array<number>} labels - label values for each sample
 * @returns {number} score - Silhouette Score for input clustering
 */
function silhouetteScore(data, labels) {
  /*
	TODO: Check X and Y for consistent length - enforce X to be 2D and Y 1D.
		The length of Y should equal the number of rows in X, which in turn
		should be non-empty and should contain only finite values - no NaN-s
		and Inf-s allowed. The same goes for Y. Check that number of labels
		(number of distinct values in Y) is valid. Valid values are from 2 to
		data.length - 1 (inclusive)".
 	*/
  let dist = distanceMatrix(data, mlDistanceEuclidean.euclidean);
  let result = silhouetteSamples(dist, labels, silhouetteReduce);
  return result.reduce((p, c, i) => p + (c - p) / (i + 1), 0);
}

/**
 * Calculate Silhouette for each data sample
 * @param {Array<Array<number>>} data - list of input data samples
 * @param {Array<number>} labels - label values for each sample
 * @param {Function|Mock} reduceFunction - reduce function to apply on samples
 * @returns {Array<number>} arr - Silhouette Coefficient for each sample
 */
function silhouetteSamples(data, labels, reduceFunction) {
  /*
	TODO: Check X and Y for consistent length - enforce X to be 2D and Y 1D.
		The length of Y should equal the number of rows in X, which in turn
		should be non-empty and should contain only finite values - no NaN-s
		and Inf-s allowed. The same goes for Y. Check that number of labels
		(number of distinct values in Y) is valid. Valid values are from 2 to
		data.length - 1 (inclusive)".
	 */
  let labelsFreq = countBy(labels);
  let samples = reduceFunction(data, labels, labelsFreq);
  let denom = labels.map((val) => labelsFreq[val] - 1);
  let intra = samples.intraDist.map((val, ind) => val / denom[ind]);
  let inter = samples.interDist;
  return inter
    .map((val, ind) => val - intra[ind])
    .map((val, ind) => val / Math.max(intra[ind], inter[ind]));
}

/**
 * Count the number of occurrences of each value in array.
 * @param {Array<number>} arr - Array of positive Integer values
 * @return {Array<number>} out - number of occurrences of each value starting from
 * 0 to max(arr).
 */
function countBy(arr) {
  let valid = arr.every((val) => {
    if (typeof val !== 'number') return false;
    return val >= 0.0 && Math.floor(val) === val && val !== Infinity;
  });
  if (!valid) throw new Error('Array must contain only natural numbers');

  let out = Array.from({ length: Math.max(...arr) + 1 }, () => 0);
  arr.forEach((value) => {
    out[value]++;
  });
  return out;
}

function silhouetteReduce(dataChunk, labels, labelFrequencies) {
  let clusterDistances = dataChunk.map((row) =>
    labelFrequencies.map((_, mInd) =>
      labels.reduce(
        (acc, val, rInd) => (val === mInd ? acc + row[rInd] : acc + 0),
        0
      )
    )
  );
  let intraDist = clusterDistances.map((val, ind) => val[labels[ind]]);
  let interDist = clusterDistances
    .map((mVal, mInd) => {
      mVal[labels[mInd]] += Infinity;
      labelFrequencies.forEach((fVal, fInd) => (mVal[fInd] /= fVal));
      return mVal;
    })
    .map((val) => Math.min(...val));
  return {
    intraDist: intraDist,
    interDist: interDist,
  };
}

module.exports = silhouetteScore;

},{"ml-distance-euclidean":10,"ml-distance-matrix":11}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
/**
 * DBSCAN - Density based clustering
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

/**
 * DBSCAN class construcotr
 * @constructor
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distanceFunction
 * @returns {DBSCAN}
 */
function DBSCAN(dataset, epsilon, minPts, distanceFunction) {
  /** @type {Array} */
  this.dataset = [];
  /** @type {number} */
  this.epsilon = 1;
  /** @type {number} */
  this.minPts = 2;
  /** @type {function} */
  this.distance = this._euclideanDistance;
  /** @type {Array} */
  this.clusters = [];
  /** @type {Array} */
  this.noise = [];

  // temporary variables used during computation

  /** @type {Array} */
  this._visited = [];
  /** @type {Array} */
  this._assigned = [];
  /** @type {number} */
  this._datasetLength = 0;

  this._init(dataset, epsilon, minPts, distanceFunction);
};

/******************************************************************************/
// public functions

/**
 * Start clustering
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distanceFunction
 * @returns {undefined}
 * @access public
 */
DBSCAN.prototype.run = function(dataset, epsilon, minPts, distanceFunction) {
  this._init(dataset, epsilon, minPts, distanceFunction);

  for (var pointId = 0; pointId < this._datasetLength; pointId++) {
    // if point is not visited, check if it forms a cluster
    if (this._visited[pointId] !== 1) {
      this._visited[pointId] = 1;

      // if closest neighborhood is too small to form a cluster, mark as noise
      var neighbors = this._regionQuery(pointId);

      if (neighbors.length < this.minPts) {
        this.noise.push(pointId);
      } else {
        // create new cluster and add point
        var clusterId = this.clusters.length;
        this.clusters.push([]);
        this._addToCluster(pointId, clusterId);

        this._expandCluster(clusterId, neighbors);
      }
    }
  }

  return this.clusters;
};

/******************************************************************************/
// protected functions

/**
 * Set object properties
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distance
 * @returns {undefined}
 * @access protected
 */
DBSCAN.prototype._init = function(dataset, epsilon, minPts, distance) {

  if (dataset) {

    if (!(dataset instanceof Array)) {
      throw Error('Dataset must be of type array, ' +
        typeof dataset + ' given');
    }

    this.dataset = dataset;
    this.clusters = [];
    this.noise = [];

    this._datasetLength = dataset.length;
    this._visited = new Array(this._datasetLength);
    this._assigned = new Array(this._datasetLength);
  }

  if (epsilon) {
    this.epsilon = epsilon;
  }

  if (minPts) {
    this.minPts = minPts;
  }

  if (distance) {
    this.distance = distance;
  }
};

/**
 * Expand cluster to closest points of given neighborhood
 *
 * @param {number} clusterId
 * @param {Array} neighbors
 * @returns {undefined}
 * @access protected
 */
DBSCAN.prototype._expandCluster = function(clusterId, neighbors) {

  /**
   * It's very important to calculate length of neighbors array each time,
   * as the number of elements changes over time
   */
  for (var i = 0; i < neighbors.length; i++) {
    var pointId2 = neighbors[i];

    if (this._visited[pointId2] !== 1) {
      this._visited[pointId2] = 1;
      var neighbors2 = this._regionQuery(pointId2);

      if (neighbors2.length >= this.minPts) {
        neighbors = this._mergeArrays(neighbors, neighbors2);
      }
    }

    // add to cluster
    if (this._assigned[pointId2] !== 1) {
      this._addToCluster(pointId2, clusterId);
    }
  }
};

/**
 * Add new point to cluster
 *
 * @param {number} pointId
 * @param {number} clusterId
 */
DBSCAN.prototype._addToCluster = function(pointId, clusterId) {
  this.clusters[clusterId].push(pointId);
  this._assigned[pointId] = 1;
};

/**
 * Find all neighbors around given point
 *
 * @param {number} pointId,
 * @param {number} epsilon
 * @returns {Array}
 * @access protected
 */
DBSCAN.prototype._regionQuery = function(pointId) {
  var neighbors = [];

  for (var id = 0; id < this._datasetLength; id++) {
    var dist = this.distance(this.dataset[pointId], this.dataset[id]);
    if (dist < this.epsilon) {
      neighbors.push(id);
    }
  }

  return neighbors;
};

/******************************************************************************/
// helpers

/**
 * @param {Array} a
 * @param {Array} b
 * @returns {Array}
 * @access protected
 */
DBSCAN.prototype._mergeArrays = function(a, b) {
  var len = b.length;

  for (var i = 0; i < len; i++) {
    var P = b[i];
    if (a.indexOf(P) < 0) {
      a.push(P);
    }
  }

  return a;
};

/**
 * Calculate euclidean distance in multidimensional space
 *
 * @param {Array} p
 * @param {Array} q
 * @returns {number}
 * @access protected
 */
DBSCAN.prototype._euclideanDistance = function(p, q) {
  var sum = 0;
  var i = Math.min(p.length, q.length);

  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }

  return Math.sqrt(sum);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DBSCAN;
}

},{}],5:[function(require,module,exports){
/**
 * DBSCAN - Density based clustering
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

/**
 * FIZZSCAN class construcotr
 * @constructor
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distanceFunction
 * @returns {FIZZSCAN}
 */
function FIZZSCAN(dataset, epsilon, minPts, forceIn, distanceFunction) {
    /** @type {Array} */
    this.dataset = [];
    /** @type {number} */
    this.epsilon = 1;
    /** @type {number} */
    this.minPts = 2;
    /** @type {function} */
    this.distance = this._euclideanDistance;
    /** @type {boolean} */
    this.forceIn = false;
    /** @type {Array} */
    this.clusters = [];
    /** @type {Array} */
    this.clusterCentroids = [];
    /** @type {Array} */
    this.noise = [];
  
    // temporary variables used during computation
  
    /** @type {Array} */
    this._visited = [];
    /** @type {Array} */
    this._assigned = [];
    /** @type {number} */
    this._datasetLength = 0;
  
    this._init(dataset, epsilon, minPts, forceIn, distanceFunction);
  };
  
  /******************************************************************************/
  // public functions
  
  /**
   * Start clustering
   *
   * @param {Array} dataset
   * @param {number} epsilon
   * @param {number} minPts
   * @param {function} distanceFunction
   * @param {boolean} distanceFunction
   * @returns {undefined}
   * @access public
   */
  FIZZSCAN.prototype.run = function(dataset, epsilon, minPts, forceIn, distanceFunction) {
    this._init(dataset, epsilon, minPts, forceIn, distanceFunction);
  
    for (var pointId = 0; pointId < this._datasetLength; pointId++) {
      // if point is not visited, check if it forms a cluster
      if (this._visited[pointId] !== 1) {
        this._visited[pointId] = 1;
  
        // if closest neighborhood is too small to form a cluster, mark as noise
        var neighbors = this._regionQuery(pointId);
  
        if (neighbors.length < this.minPts) {
          this.noise.push(pointId);
        } else {
          // create new cluster and add point
          var clusterId = this.clusters.length;
          this.clusters.push([]);
          this._addToCluster(pointId, clusterId);
  
          this._expandCluster(clusterId, neighbors);
        }
      }
    }


    //Declusters extremely small clusters in large datasets into noise.   
    if (this.dataset.length > 1000){
      var t = this.minPts*2;
      for (var clusterId = 0; clusterId < this.clusters.length; clusterId++){
        var tempCluster = this.clusters[clusterId];
        if (tempCluster.length < t){
          for (var pointId = 0; pointId< tempCluster.length; pointId++){
            this.noise.push(tempCluster[pointId])
          }
          this.clusters[clusterId] = null;
        }
      }
      this.clusters = this.clusters.filter((e) => e !== null)
    }

    
    //Forms centroids of each generated cluster
    for (var i = 0; i< this.clusters.length; i++){
      this.clusterCentroids.push(this._centroid(this.clusters[i]));
    }


    //Optionally forces outliers into clusters by grouping them into the nearest centroid.
    if (this.forceIn){
      for (var noisePointID of this.noise) {
        let dist = 0;
        let nearestClusterId = 0;
        for (var clusterId = 0; clusterId < this.clusterCentroids.length; clusterId++) {
          let testDist = this.distance(dataset[noisePointID], this.clusterCentroids[clusterId])
          if (dist == 0){
            dist = testDist;
            nearestClusterId = clusterId;
          }
          else{
            if (dist > testDist){
              dist = testDist;
              nearestClusterId = clusterId;
            }
          }
        }
        //console.log(noisePointID);
        this._addToCluster(noisePointID, nearestClusterId);
      }
      this.noise = [];
    }

    return this.clusters;
  };
  
  /******************************************************************************/
  // protected functions
  
  /**
   * Set object properties
   *
   * @param {Array} dataset
   * @param {number} epsilon
   * @param {number} minPts
   * @param {function} distance
   * @param {boolean} forceIn
   * @returns {undefined}
   * @access protected
   */
  FIZZSCAN.prototype._init = function(dataset, epsilon, minPts, forceIn, distance) {
  
    if (dataset) {
  
      if (!(dataset instanceof Array)) {
        throw Error('Dataset must be of type array, ' +
          typeof dataset + ' given');
      }
  
      this.dataset = dataset;
      this.clusters = [];
      this.noise = [];
  
      this._datasetLength = dataset.length;
      this._visited = new Array(this._datasetLength);
      this._assigned = new Array(this._datasetLength);
    }
  
    if (epsilon) {
      this.epsilon = epsilon;
    }
  
    if (minPts) {
      this.minPts = minPts;
    }
  
    if (distance) {
      this.distance = distance;
    }

    if (forceIn) {
      this.forceIn = forceIn;
    }
  };
  
  /**
   * Expand cluster to closest points of given neighborhood
   *
   * @param {number} clusterId
   * @param {Array} neighbors
   * @returns {undefined}
   * @access protected
   */
  FIZZSCAN.prototype._expandCluster = function(clusterId, neighbors) {
  
    /**
     * It's very important to calculate length of neighbors array each time,
     * as the number of elements changes over time
     */
    for (var i = 0; i < neighbors.length; i++) {
      var pointId2 = neighbors[i];
  
      if (this._visited[pointId2] !== 1) {
        this._visited[pointId2] = 1;
        var neighbors2 = this._regionQuery(pointId2);
  
        if (neighbors2.length >= this.minPts) {
          neighbors = this._mergeArrays(neighbors, neighbors2);
        }
      }
  
      // add to cluster
      if (this._assigned[pointId2] !== 1) {
        this._addToCluster(pointId2, clusterId);
      }
    }
  };
  
  /**
   * Add new point to cluster
   *
   * @param {number} pointId
   * @param {number} clusterId
   */
  FIZZSCAN.prototype._addToCluster = function(pointId, clusterId) {
    this.clusters[clusterId].push(pointId);
    this._assigned[pointId] = 1;
  };
  
  /**
   * Find all neighbors around given point
   *
   * @param {number} pointId,
   * @param {number} epsilon
   * @returns {Array}
   * @access protected
   */
  FIZZSCAN.prototype._regionQuery = function(pointId) {
    var neighbors = [];
  
    for (var id = 0; id < this._datasetLength; id++) {
      var dist = this.distance(this.dataset[pointId], this.dataset[id]);
      if (dist < this.epsilon) {
        neighbors.push(id);
      }
    }
  
    return neighbors;
  };
  
  /******************************************************************************/
  // helpers
  
  /**
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   * @access protected
   */
  FIZZSCAN.prototype._mergeArrays = function(a, b) {
    var len = b.length;
  
    for (var i = 0; i < len; i++) {
      var P = b[i];
      if (a.indexOf(P) < 0) {
        a.push(P);
      }
    }
  
    return a;
  };
  
  /**
   * Calculate euclidean distance in multidimensional space
   *
   * @param {Array} p
   * @param {Array} q
   * @returns {number}
   * @access protected
   */
  FIZZSCAN.prototype._euclideanDistance = function(p, q) {
    var sum = 0;
    var i = Math.min(p.length, q.length);
  
    while (i--) {
      sum += (p[i] - q[i]) * (p[i] - q[i]);
    }
  
    return Math.sqrt(sum);
  };
  
  /**
   * Calculate centroid of a group of points
   *
   * @param {Array} c
   * @returns {Array}
   * @access protected
   */
  FIZZSCAN.prototype._centroid = function(c) {
    var centroid = [];
    var i = 0;
    var j = 0;
    var l = c.length;
    var points = [];
    for (i = 0; i< l; i++){
      points.push(this.dataset[c[i]])
    }
    for (i = 0; i< l; i++){
        for (j = 0; j< points[i].length; j++){
            if (centroid[j] !== undefined){
                centroid[j] += points[i][j]/l;
            }
            else{
                centroid.push(0);
                centroid[j] += points[i][j]/l;
            }
        }
    }
    return centroid;
  }


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = FIZZSCAN;
  }
},{}],6:[function(require,module,exports){
/**
 * KMEANS clustering
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

/**
 * KMEANS class constructor
 * @constructor
 *
 * @param {Array} dataset
 * @param {number} k - number of clusters
 * @param {function} distance - distance function
 * @returns {KMEANS}
 */
 function KMEANS(dataset, k, distance) {
  this.k = 3; // number of clusters
  this.dataset = []; // set of feature vectors
  this.assignments = []; // set of associated clusters for each feature vector
  this.centroids = []; // vectors for our clusters

  this.init(dataset, k, distance);
}

/**
 * @returns {undefined}
 */
KMEANS.prototype.init = function(dataset, k, distance) {
  this.assignments = [];
  this.centroids = [];

  if (typeof dataset !== 'undefined') {
    this.dataset = dataset;
  }

  if (typeof k !== 'undefined') {
    this.k = k;
  }

  if (typeof distance !== 'undefined') {
    this.distance = distance;
  }
};

/**
 * @returns {undefined}
 */
KMEANS.prototype.run = function(dataset, k) {
  this.init(dataset, k);

  var len = this.dataset.length;

  // initialize centroids
  for (var i = 0; i < this.k; i++) {
    this.centroids[i] = this.randomCentroid();
	}

  var change = true;
  while(change) {

    // assign feature vectors to clusters
    change = this.assign();

    // adjust location of centroids
    for (var centroidId = 0; centroidId < this.k; centroidId++) {
      var mean = new Array(maxDim);
      var count = 0;

      // init mean vector
      for (var dim = 0; dim < maxDim; dim++) {
        mean[dim] = 0;
      }

      for (var j = 0; j < len; j++) {
        var maxDim = this.dataset[j].length;

        // if current cluster id is assigned to point
        if (centroidId === this.assignments[j]) {
          for (var dim = 0; dim < maxDim; dim++) {
            mean[dim] += this.dataset[j][dim];
          }
          count++;
        }
      }

      if (count > 0) {
        // if cluster contain points, adjust centroid position
        for (var dim = 0; dim < maxDim; dim++) {
          mean[dim] /= count;
        }
        this.centroids[centroidId] = mean;
      } else {
        // if cluster is empty, generate new random centroid
        this.centroids[centroidId] = this.randomCentroid();
        change = true;
      }
    }
  }

  return this.getClusters();
};

/**
 * Generate random centroid
 *
 * @returns {Array}
 */
KMEANS.prototype.randomCentroid = function() {
  var maxId = this.dataset.length -1;
  var centroid;
  var id;

  do {
    id = Math.round(Math.random() * maxId);
    centroid = this.dataset[id];
  } while (this.centroids.indexOf(centroid) >= 0);

  return centroid;
}

/**
 * Assign points to clusters
 *
 * @returns {boolean}
 */
KMEANS.prototype.assign = function() {
  var change = false;
  var len = this.dataset.length;
  var closestCentroid;

  for (var i = 0; i < len; i++) {
    closestCentroid = this.argmin(this.dataset[i], this.centroids, this.distance);

    if (closestCentroid != this.assignments[i]) {
      this.assignments[i] = closestCentroid;
      change = true;
    }
  }

  return change;
}

/**
 * Extract information about clusters
 *
 * @returns {undefined}
 */
KMEANS.prototype.getClusters = function() {
  var clusters = new Array(this.k);
  var centroidId;

  for (var pointId = 0; pointId < this.assignments.length; pointId++) {
    centroidId = this.assignments[pointId];

    // init empty cluster
    if (typeof clusters[centroidId] === 'undefined') {
      clusters[centroidId] = [];
    }

    clusters[centroidId].push(pointId);
  }

  return clusters;
};

// utils

/**
 * @params {Array} point
 * @params {Array.<Array>} set
 * @params {Function} f
 * @returns {number}
 */
KMEANS.prototype.argmin = function(point, set, f) {
  var min = Number.MAX_VALUE;
  var arg = 0;
  var len = set.length;
  var d;

  for (var i = 0; i < len; i++) {
    d = f(point, set[i]);
    if (d < min) {
      min = d;
      arg = i;
    }
  }

  return arg;
};

/**
 * Euclidean distance
 *
 * @params {number} p
 * @params {number} q
 * @returns {number}
 */
KMEANS.prototype.distance = function(p, q) {
  var sum = 0;
  var i = Math.min(p.length, q.length);

  while (i--) {
    var diff = p[i] - q[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = KMEANS;
}

},{}],7:[function(require,module,exports){

/**
 * @requires ./PriorityQueue.js
 */

if (typeof module !== 'undefined' && module.exports) {
      var PriorityQueue = require('./PriorityQueue.js');
}

/**
 * OPTICS - Ordering points to identify the clustering structure
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

/**
 * OPTICS class constructor
 * @constructor
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distanceFunction
 * @returns {OPTICS}
 */
function OPTICS(dataset, epsilon, minPts, distanceFunction) {
  /** @type {number} */
  this.epsilon = 1;
  /** @type {number} */
  this.minPts = 1;
  /** @type {function} */
  this.distance = this._euclideanDistance;

  // temporary variables used during computation

  /** @type {Array} */
  this._reachability = [];
  /** @type {Array} */
  this._processed = [];
  /** @type {number} */
  this._coreDistance = 0;
  /** @type {Array} */
  this._orderedList = [];

  this._init(dataset, epsilon, minPts, distanceFunction);
}

/******************************************************************************/
// pulic functions

/**
 * Start clustering
 *
 * @param {Array} dataset
 * @returns {undefined}
 * @access public
 */
OPTICS.prototype.run = function(dataset, epsilon, minPts, distanceFunction) {
  this._init(dataset, epsilon, minPts, distanceFunction);

  for (var pointId = 0, l = this.dataset.length; pointId < l; pointId++) {
    if (this._processed[pointId] !== 1) {
      this._processed[pointId] = 1;
      this.clusters.push([pointId]);
      var clusterId = this.clusters.length - 1;

      this._orderedList.push(pointId);
      var priorityQueue = new PriorityQueue(null, null, 'asc');
      var neighbors = this._regionQuery(pointId);

      // using priority queue assign elements to new cluster
      if (this._distanceToCore(pointId) !== undefined) {
        this._updateQueue(pointId, neighbors, priorityQueue);
        this._expandCluster(clusterId, priorityQueue);
      }
    }
  }

  return this.clusters;
};

/**
 * Generate reachability plot for all points
 *
 * @returns {array}
 * @access public
 */
OPTICS.prototype.getReachabilityPlot = function() {
  var reachabilityPlot = [];

  for (var i = 0, l = this._orderedList.length; i < l; i++) {
    var pointId = this._orderedList[i];
    var distance = this._reachability[pointId];

    reachabilityPlot.push([pointId, distance]);
  }

  return reachabilityPlot;
};

/******************************************************************************/
// protected functions

/**
 * Set object properties
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distance
 * @returns {undefined}
 * @access protected
 */
OPTICS.prototype._init = function(dataset, epsilon, minPts, distance) {

  if (dataset) {

    if (!(dataset instanceof Array)) {
      throw Error('Dataset must be of type array, ' +
        typeof dataset + ' given');
    }

    this.dataset = dataset;
    this.clusters = [];
    this._reachability = new Array(this.dataset.length);
    this._processed = new Array(this.dataset.length);
    this._coreDistance = 0;
    this._orderedList = [];
  }

  if (epsilon) {
    this.epsilon = epsilon;
  }

  if (minPts) {
    this.minPts = minPts;
  }

  if (distance) {
    this.distance = distance;
  }
};

/**
 * Update information in queue
 *
 * @param {number} pointId
 * @param {Array} neighbors
 * @param {PriorityQueue} queue
 * @returns {undefined}
 * @access protected
 */
OPTICS.prototype._updateQueue = function(pointId, neighbors, queue) {
  var self = this;

  this._coreDistance = this._distanceToCore(pointId);
  neighbors.forEach(function(pointId2) {
    if (self._processed[pointId2] === undefined) {
      var dist = self.distance(self.dataset[pointId], self.dataset[pointId2]);
      var newReachableDistance = Math.max(self._coreDistance, dist);

      if (self._reachability[pointId2] === undefined) {
        self._reachability[pointId2] = newReachableDistance;
        queue.insert(pointId2, newReachableDistance);
      } else {
        if (newReachableDistance < self._reachability[pointId2]) {
          self._reachability[pointId2] = newReachableDistance;
          queue.remove(pointId2);
          queue.insert(pointId2, newReachableDistance);
        }
      }
    }
  });
};

/**
 * Expand cluster
 *
 * @param {number} clusterId
 * @param {PriorityQueue} queue
 * @returns {undefined}
 * @access protected
 */
OPTICS.prototype._expandCluster = function(clusterId, queue) {
  var queueElements = queue.getElements();

  for (var p = 0, l = queueElements.length; p < l; p++) {
    var pointId = queueElements[p];
    if (this._processed[pointId] === undefined) {
      var neighbors = this._regionQuery(pointId);
      this._processed[pointId] = 1;

      this.clusters[clusterId].push(pointId);
      this._orderedList.push(pointId);

      if (this._distanceToCore(pointId) !== undefined) {
        this._updateQueue(pointId, neighbors, queue);
        this._expandCluster(clusterId, queue);
      }
    }
  }
};

/**
 * Calculating distance to cluster core
 *
 * @param {number} pointId
 * @returns {number}
 * @access protected
 */
OPTICS.prototype._distanceToCore = function(pointId) {
  var l = this.epsilon;
  for (var coreDistCand = 0; coreDistCand < l; coreDistCand++) {
    var neighbors = this._regionQuery(pointId, coreDistCand);
    if (neighbors.length >= this.minPts) {
      return coreDistCand;
    }
  }

  return;
};

/**
 * Find all neighbors around given point
 *
 * @param {number} pointId
 * @param {number} epsilon
 * @returns {Array}
 * @access protected
 */
OPTICS.prototype._regionQuery = function(pointId, epsilon) {
  epsilon = epsilon || this.epsilon;
  var neighbors = [];

  for (var id = 0, l = this.dataset.length; id < l; id++) {
    if (this.distance(this.dataset[pointId], this.dataset[id]) < epsilon) {
      neighbors.push(id);
    }
  }

  return neighbors;
};

/******************************************************************************/
// helpers

/**
 * Calculate euclidean distance in multidimensional space
 *
 * @param {Array} p
 * @param {Array} q
 * @returns {number}
 * @access protected
 */
OPTICS.prototype._euclideanDistance = function(p, q) {
  var sum = 0;
  var i = Math.min(p.length, q.length);

  while (i--) {
    sum += (p[i] - q[i]) * (p[i] - q[i]);
  }

  return Math.sqrt(sum);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = OPTICS;
}

},{"./PriorityQueue.js":8}],8:[function(require,module,exports){
/**
 * PriorityQueue
 * Elements in this queue are sorted according to their value
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */

/**
 * PriorityQueue class construcotr
 * @constructor
 *
 * @example
 * queue: [1,2,3,4]
 * priorities: [4,1,2,3]
 * > result = [1,4,2,3]
 *
 * @param {Array} elements
 * @param {Array} priorities
 * @param {string} sorting - asc / desc
 * @returns {PriorityQueue}
 */
function PriorityQueue(elements, priorities, sorting) {
  /** @type {Array} */
  this._queue = [];
  /** @type {Array} */
  this._priorities = [];
  /** @type {string} */
  this._sorting = 'desc';

  this._init(elements, priorities, sorting);
};

/**
 * Insert element
 *
 * @param {Object} ele
 * @param {Object} priority
 * @returns {undefined}
 * @access public
 */
PriorityQueue.prototype.insert = function(ele, priority) {
  var indexToInsert = this._queue.length;
  var index = indexToInsert;

  while (index--) {
    var priority2 = this._priorities[index];
    if (this._sorting === 'desc') {
      if (priority > priority2) {
        indexToInsert = index;
      }
    } else {
      if (priority < priority2) {
        indexToInsert = index;
      }
    }
  }

  this._insertAt(ele, priority, indexToInsert);
};

/**
 * Remove element
 *
 * @param {Object} ele
 * @returns {undefined}
 * @access public
 */
PriorityQueue.prototype.remove = function(ele) {
  var index = this._queue.length;

  while (index--) {
    var ele2 = this._queue[index];
    if (ele === ele2) {
      this._queue.splice(index, 1);
      this._priorities.splice(index, 1);
      break;
    }
  }
};

/**
 * For each loop wrapper
 *
 * @param {function} func
 * @returs {undefined}
 * @access public
 */
PriorityQueue.prototype.forEach = function(func) {
  this._queue.forEach(func);
};

/**
 * @returns {Array}
 * @access public
 */
PriorityQueue.prototype.getElements = function() {
  return this._queue;
};

/**
 * @param {number} index
 * @returns {Object}
 * @access public
 */
PriorityQueue.prototype.getElementPriority = function(index) {
  return this._priorities[index];
};

/**
 * @returns {Array}
 * @access public
 */
PriorityQueue.prototype.getPriorities = function() {
  return this._priorities;
};

/**
 * @returns {Array}
 * @access public
 */
PriorityQueue.prototype.getElementsWithPriorities = function() {
  var result = [];

  for (var i = 0, l = this._queue.length; i < l; i++) {
    result.push([this._queue[i], this._priorities[i]]);
  }

  return result;
};

/**
 * Set object properties
 *
 * @param {Array} elements
 * @param {Array} priorities
 * @returns {undefined}
 * @access protected
 */
PriorityQueue.prototype._init = function(elements, priorities, sorting) {

  if (elements && priorities) {
    this._queue = [];
    this._priorities = [];

    if (elements.length !== priorities.length) {
      throw new Error('Arrays must have the same length');
    }

    for (var i = 0; i < elements.length; i++) {
      this.insert(elements[i], priorities[i]);
    }
  }

  if (sorting) {
    this._sorting = sorting;
  }
};

/**
 * Insert element at given position
 *
 * @param {Object} ele
 * @param {number} index
 * @returns {undefined}
 * @access protected
 */
PriorityQueue.prototype._insertAt = function(ele, priority, index) {
  if (this._queue.length === index) {
    this._queue.push(ele);
    this._priorities.push(priority);
  } else {
    this._queue.splice(index, 0, ele);
    this._priorities.splice(index, 0, priority);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PriorityQueue;
}

},{}],9:[function(require,module,exports){

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      DBSCAN: require('./DBSCAN.js'),
      KMEANS: require('./KMEANS.js'),
      OPTICS: require('./OPTICS.js'),
      PriorityQueue: require('./PriorityQueue.js'),
      FIZZSCAN: require('./FIZZSCAN.js')
    };
}

},{"./DBSCAN.js":4,"./FIZZSCAN.js":5,"./KMEANS.js":6,"./OPTICS.js":7,"./PriorityQueue.js":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function squaredEuclidean(p, q) {
    let d = 0;
    for (let i = 0; i < p.length; i++) {
        d += (p[i] - q[i]) * (p[i] - q[i]);
    }
    return d;
}
exports.squaredEuclidean = squaredEuclidean;
function euclidean(p, q) {
    return Math.sqrt(squaredEuclidean(p, q));
}
exports.euclidean = euclidean;

},{}],11:[function(require,module,exports){
'use strict';

/**
 * Computes a distance/similarity matrix given an array of data and a distance/similarity function.
 * @param {Array} data An array of data
 * @param {function} distanceFn  A function that accepts two arguments and computes a distance/similarity between them
 * @return {Array<Array>} The distance/similarity matrix. The matrix is square and has a size equal to the length of
 * the data array
 */
function distanceMatrix(data, distanceFn) {
  const result = getMatrix(data.length);

  // Compute upper distance matrix
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j <= i; j++) {
      result[i][j] = distanceFn(data[i], data[j]);
      result[j][i] = result[i][j];
    }
  }

  return result;
}

function getMatrix(size) {
  const matrix = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    matrix.push(row);
    for (let j = 0; j < size; j++) {
      row.push(0);
    }
  }
  return matrix;
}

module.exports = distanceMatrix;

},{}]},{},[1]);
