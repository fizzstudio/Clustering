interface Point {
    x: number;
    y: number;
}
export default makeHull;
declare function makeHull<P extends Point>(points: Readonly<Array<P>>): Array<P>;
//# sourceMappingURL=convexhull.d.ts.map