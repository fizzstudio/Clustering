export { generateClusterAnalysis, type clusterObject, type coord };
declare function generateClusterAnalysis(data: coord[], showForcing: boolean, labels?: any[]): clusterObject[];
type clusterObject = {
    area: number;
    centroid: Array<number>;
    dataPoints: Array<Pair>;
    dataPointIDs: Array<number>;
    outlierIDs: Array<number>;
    density: number;
    densityRank: number;
    hasSignificantHole: boolean;
    holes: Array<hole>;
    hull: Array<coord>;
    hullIDs: Array<number>;
    hullSimplified: Array<coord>;
    id: number;
    perimeter: number;
    region: number;
    regionDesc: string;
    relations: Array<relation>;
    shape: {
        description: string;
    };
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
};
type coord = {
    x: number;
    y: number;
};
type relation = {
    angle: number;
    cardDirection: string;
    distance: number;
    id: number;
    isNeighbor?: boolean;
    overlap?: number;
    sharedPts?: Array<Pair>;
    percentPtsShared?: number;
};
type hole = [Array<number>, number, number];
type Pair = [number, number];
//# sourceMappingURL=clustering.d.ts.map