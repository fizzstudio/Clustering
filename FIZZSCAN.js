/**
 * DBSCAN - Density based clustering
 *
 * @author Lukasz Krawczyk <contact@lukaszkrawczyk.eu>
 * @copyright MIT
 */


/**
 * FIZZSCAN class constructor
 * @constructor
 *
 * @param {Array} dataset
 * @param {number} epsilon
 * @param {number} minPts
 * @param {function} distanceFunction
 * @returns {FIZZSCAN}
 */
class FIZZSCAN {
  constructor(dataset, epsilon, minPts, forceIn, distanceFunction) {
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
    /** @type {Array} */
    this.noiseAssigned = [];
    // temporary variables used during computation
    /** @type {Array} */
    this._visited = [];
    /** @type {Array} */
    this._assigned = [];
    /** @type {number} */
    this._datasetLength = 0;

    this._init(dataset, epsilon, minPts, forceIn, distanceFunction);
  }
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
  run(dataset, epsilon, minPts, forceIn, distanceFunction) {
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
    if (this.dataset.length > 1000) {
      var t = this.minPts * 2;
      for (var clusterId = 0; clusterId < this.clusters.length; clusterId++) {
        var tempCluster = this.clusters[clusterId];
        if (tempCluster.length < t) {
          for (var pointId = 0; pointId < tempCluster.length; pointId++) {
            this.noise.push(tempCluster[pointId]);
          }
          this.clusters[clusterId] = null;
        }
      }
      this.clusters = this.clusters.filter((e) => e !== null);
    }

    //Forms centroids of each generated cluster
    for (var i = 0; i < this.clusters.length; i++) {
      this.clusterCentroids.push(this._centroid(this.clusters[i]));
    }


    let reverseClusterLookup = {};

    for (let clusterID in this.clusters) {
      for (let point of this.clusters[clusterID]) {
        reverseClusterLookup[point] = Number(clusterID);
      }
    }

    let tempStorage = [];
    for (let noisePointID of this.noise) {
      let nearestNeighbor = this._nearestNeighbor(this.clusters.flat(), noisePointID);
      tempStorage.push([noisePointID, Number(reverseClusterLookup[nearestNeighbor])]);
    }

    //Optionally forces noise points into clusters by grouping them into the nearest already-clustered point.
    if (this.forceIn) {
      this.noiseAssigned = JSON.parse(JSON.stringify(this.noise));
      for (let i = 0; i < tempStorage.length; i++) {
        let point = tempStorage[i];
        this.noiseAssigned[this.noiseAssigned.indexOf(point[0])] = [point[0], point[1]];
        this._addToCluster(point[0], point[1]);
        //reverseClusterLookup[point[0]] = point[1];
      }
      this.noise = [];
    }
    else {
      this.noiseAssigned = JSON.parse(JSON.stringify(this.noise));
      for (let i = 0; i < tempStorage.length; i++) {
        let point = tempStorage[i];
        this.noiseAssigned[this.noiseAssigned.indexOf(point)] = [point[0], point[1]];
        //reverseClusterLookup[point[0]] = point[1];
      }
    }
    console.log(reverseClusterLookup);
    return this.clusters;
  }
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
  _init(dataset, epsilon, minPts, forceIn, distance) {

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
  }
  /**
   * Expand cluster to closest points of given neighborhood
   *
   * @param {number} clusterId
   * @param {Array} neighbors
   * @returns {undefined}
   * @access protected
   */
  _expandCluster(clusterId, neighbors) {

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
        if (this.noise.indexOf(pointId2) > -1) {
          this.noise.splice(this.noise.indexOf(pointId2), 1);
        }
      }
    }
  }
  /**
   * Add new point to cluster
   *
   * @param {number} pointId
   * @param {number} clusterId
   */
  _addToCluster(pointId, clusterId) {
    this.clusters[clusterId].push(pointId);
    this._assigned[pointId] = 1;
  }
  /**
   * Find all neighbors around given point
   *
   * @param {number} pointId,
   * @param {number} epsilon
   * @returns {Array}
   * @access protected
   */
  _regionQuery(pointId) {
    let neighbors = [];
    let nnId = 0;
    let nnDist = 0;
    for (var id = 0; id < this._datasetLength; id++) {
      var dist = this.distance(this.dataset[pointId], this.dataset[id]);
      if (dist < this.epsilon) {
        neighbors.push(id);
      }
      if (nnDist == 0) {
        nnDist = dist;
        nnId = id;
      }
      else if (nnDist > dist) {
        nnDist = dist;
        nnId = id;
      }
      //this.nearestNeighborLookup[pointId] = nnId;
    }

    return neighbors;
  }
  /******************************************************************************/
  // helpers
  /**
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   * @access protected
   */
  _mergeArrays(a, b) {
    var len = b.length;

    for (var i = 0; i < len; i++) {
      var P = b[i];
      if (a.indexOf(P) < 0) {
        a.push(P);
      }
    }

    return a;
  }
  /**
   * Calculate euclidean distance in multidimensional space
   *
   * @param {Array} p
   * @param {Array} q
   * @returns {number}
   * @access protected
   */
  _euclideanDistance(p, q) {
    var sum = 0;
    var i = Math.min(p.length, q.length);

    while (i--) {
      sum += (p[i] - q[i]) * (p[i] - q[i]);
    }

    return Math.sqrt(sum);
  }
  /**
   * Calculate centroid of a group of points
   *
   * @param {Array} c
   * @returns {Array}
   * @access protected
   */
  _centroid(c) {
    let sumX = 0;
    let sumY = 0;
    const n = c.length;
  
    for (let i of c) {
      sumX += this.dataset[i][0];
      sumY += this.dataset[i][1];
    }
  
    return [sumX / n, sumY / n];
  }
  _nearestNeighbor(datasetIds, pointId) {
    //Given a list of clustered points and an outlier, returns the closest clustered point.
    var nearest = [0, 0];
    for (var id of datasetIds) {
      if (nearest[1] == 0) {
        var nearest = [id, this._euclideanDistance(this.dataset[pointId], this.dataset[id])];
      }
      let distance = this._euclideanDistance(this.dataset[pointId], this.dataset[id]);
      if (nearest[1] > distance) {
        var nearest = [id, distance];
      }
    }
    return nearest[0];
  }
};



if (typeof module !== 'undefined' && module.exports) {
  module.exports = FIZZSCAN;
}