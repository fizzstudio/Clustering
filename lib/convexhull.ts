/**
 * Convex hull using Andrew's monotone chain algorithm.
 *
 * Implemented according to: de Berg, Cheong, van Kreveld, and Overmars,
 * Computational Geometry: Algorithms and Applications, 3rd ed., Sec. 1.1.
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Twice the signed area of triangle (a, b, c).
 */
function cross(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

/**
 * Returns true when the ordered triple makes a strict right turn.
 */
function makesRightTurn(a: Point, b: Point, c: Point): boolean {
  return cross(a, b, c) < 0;
}

/**
 * Builds one hull chain from points in traversal order.
 */
function buildChain(points: Point[]): Point[] {
  const chain: Point[] = [];
  for (const p of points) {
    chain.push(p);
    while (
      chain.length > 2 &&
      !makesRightTurn(
        chain[chain.length - 3],
        chain[chain.length - 2],
        chain[chain.length - 1],
      )
    ) {
      chain.splice(chain.length - 2, 1);
    }
  }
  return chain;
}

/**
 * Computes the convex hull of a planar point set.
 */
export function convexHull(points: Point[]): Point[] {
  const sorted = [...points].sort((a, b) => (a.x - b.x) || (a.y - b.y));

  // Exact duplicates add no information to the hull.
  const uniquePoints: Point[] = [];
  for (const p of sorted) {
    const last = uniquePoints[uniquePoints.length - 1];
    if (!last || last.x !== p.x || last.y !== p.y) {
      uniquePoints.push(p);
    }
  }

  const n = uniquePoints.length;
  if (n < 3) {
    return uniquePoints;
  }

  const upper = buildChain(uniquePoints);

  const lower = buildChain([...uniquePoints].reverse());

  lower.pop();
  lower.shift();

  return [...upper, ...lower];
}
