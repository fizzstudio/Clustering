export default Voronoi;
/*!
Copyright (C) 2010-2013 Raymond Hill: https://github.com/gorhill/Javascript-Voronoi
MIT License: See https://github.com/gorhill/Javascript-Voronoi/LICENSE.md
*/
declare function Voronoi(): void;
declare class Voronoi {
    vertices: any[] | null;
    edges: any[] | null;
    cells: any[] | null;
    toRecycle: {} | null;
    beachsectionJunkyard: any[];
    circleEventJunkyard: any[];
    vertexJunkyard: any[];
    edgeJunkyard: any[];
    cellJunkyard: any[];
    reset(): void;
    beachline: any;
    circleEvents: any;
    firstCircleEvent: any;
    sqrt: (x: number) => number;
    abs: (x: number) => number;
    ε: number;
    invε: number;
    equalWithEpsilon(a: any, b: any): boolean;
    greaterThanWithEpsilon(a: any, b: any): boolean;
    greaterThanOrEqualWithEpsilon(a: any, b: any): boolean;
    lessThanWithEpsilon(a: any, b: any): boolean;
    lessThanOrEqualWithEpsilon(a: any, b: any): boolean;
    RBTree(): void;
    root: any;
    Diagram(site: any): void;
    site: any;
    Cell(site: any): void;
    halfedges: any[] | undefined;
    closeMe: boolean | undefined;
    createCell(site: any): any;
    Vertex(x: any, y: any): void;
    x: any;
    y: any;
    Edge(lSite: any, rSite: any): void;
    lSite: any;
    rSite: any;
    va: any;
    vb: any;
    Halfedge(edge: any, lSite: any, rSite: any): void;
    edge: any;
    angle: number | undefined;
    createHalfedge(edge: any, lSite: any, rSite: any): any;
    createVertex(x: any, y: any): any;
    createEdge(lSite: any, rSite: any, va: any, vb: any): any;
    createBorderEdge(lSite: any, va: any, vb: any): any;
    setEdgeStartpoint(edge: any, lSite: any, rSite: any, vertex: any): void;
    setEdgeEndpoint(edge: any, lSite: any, rSite: any, vertex: any): void;
    Beachsection(): void;
    createBeachsection(site: any): any;
    leftBreakPoint(arc: any, directrix: any): any;
    rightBreakPoint(arc: any, directrix: any): any;
    detachBeachsection(beachsection: any): void;
    removeBeachsection(beachsection: any): void;
    addBeachsection(site: any): void;
    CircleEvent(): void;
    arc: any;
    rbLeft: any;
    rbNext: any;
    rbParent: any;
    rbPrevious: any;
    rbRed: boolean | undefined;
    rbRight: any;
    ycenter: number | undefined;
    attachCircleEvent(arc: any): void;
    detachCircleEvent(arc: any): void;
    connectEdge(edge: any, bbox: any): boolean;
    clipEdge(edge: any, bbox: any): boolean;
    clipEdges(bbox: any): void;
    closeCells(bbox: any): void;
    quantizeSites(sites: any): void;
    recycle(diagram: any): void;
    compute(sites: any, bbox: any): any;
}
declare namespace Voronoi {
    let ε: number;
    let invε: number;
}
//# sourceMappingURL=rhill-voronoi-core.d.ts.map