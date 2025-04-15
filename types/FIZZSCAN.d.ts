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
declare class FIZZSCAN {
    dataset: Array<Array<any>>;
    epsilon: number;
    minPts: number;
    distance: (p: Array<number>, q: Array<number>) => number;
    forceIn: boolean;
    clusters: Array<Array<number>>;
    clusterCentroids: Array<Pair>;
    noise: Array<number>;
    noiseAssigned: Array<Array<number>>;
    _visited: Array<number>;
    _assigned: Array<number>;
    _datasetLength: number;
    constructor(dataset: Array<Array<number>>, epsilon: number, minPts: number, forceIn: boolean, distanceFunction?: (p: any, q: any) => number);
    /******************************************************************************/
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
    run(dataset: Array<Array<number>>, epsilon: number, minPts: number, forceIn: boolean, distanceFunction?: (p: Array<number>, q: Array<number>) => number): Array<any>;
    /******************************************************************************/
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
    _init(dataset: Array<Array<number>>, epsilon: number, minPts: number, forceIn: boolean, distance?: (p: any, q: any) => number): void;
    /**
     * Expand cluster to closest points of given neighborhood
     *
     * @param {number} clusterId
     * @param {Array} neighbors
     * @returns {undefined}
     * @access protected
     */
    _expandCluster(clusterId: number, neighbors: number[]): void;
    /**
     * Add new point to cluster
     *
     * @param {number} pointId
     * @param {number} clusterId
     */
    _addToCluster(pointId: number, clusterId: number): void;
    /**
     * Find all neighbors around given point
     *
     * @param {number} pointId,
     * @param {number} epsilon
     * @returns {Array}
     * @access protected
     */
    _regionQuery(pointId: number): number[];
    /******************************************************************************/
    /**
     * @param {Array} a
     * @param {Array} b
     * @returns {Array}
     * @access protected
     */
    _mergeArrays(a: any[], b: any[]): any[];
    /**
     * Calculate euclidean distance in multidimensional space
     *
     * @param {Array} p
     * @param {Array} q
     * @returns {number}
     * @access protected
     */
    _euclideanDistance(p: number[], q: number[]): number;
    /**
     * Calculate centroid of a group of points
     *
     * @param {Array} c
     * @returns {Array}
     * @access protected
     */
    _centroid(c: Array<number>): Pair;
    /**
   * Given a list of clustered points and an outlier, returns the closest clustered point.
   *
   * @param {Array} datasetIds
   * @param {number} pointId
   * @returns {number}
   * @access protected
   */
    _nearestAssignedNeighbor(datasetIds: number[], pointId: number): number;
}
type Pair = [number, number];
export { FIZZSCAN };
//# sourceMappingURL=FIZZSCAN.d.ts.map