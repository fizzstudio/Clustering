import { describe, expect, test } from 'vitest';
import { convexHull, type Point } from '../lib/convexhull.js';

/** Sort by x then y for order-independent set comparison. */
function sortPts(pts: Point[]): Point[] {
  return [...pts].sort((a, b) => (a.x - b.x) || (a.y - b.y));
}

function signedAreaTwice(pts: Point[]): number {
  if (pts.length < 3) {
    return 0;
  }

  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const next = pts[(i + 1) % pts.length];
    sum += pts[i].x * next.y - pts[i].y * next.x;
  }

  return sum;
}

describe('convexHull', () => {
  // --- degenerate inputs ---

  test('empty input returns empty array', () => {
    expect(convexHull([])).toEqual([]);
  });

  test('single point returns that point', () => {
    expect(convexHull([{ x: 3, y: 7 }])).toEqual([{ x: 3, y: 7 }]);
  });

  test('two distinct points returns both', () => {
    const pts = [{ x: 1, y: 0 }, { x: 0, y: 0 }];
    expect(sortPts(convexHull(pts))).toEqual([{ x: 0, y: 0 }, { x: 1, y: 0 }]);
  });

  test('all duplicate points returns a single point', () => {
    const pts = [{ x: 2, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 3 }];
    expect(convexHull(pts)).toEqual([{ x: 2, y: 3 }]);
  });

  test('two distinct values among duplicates returns those two', () => {
    const pts = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 1 }];
    expect(sortPts(convexHull(pts))).toEqual([{ x: 0, y: 0 }, { x: 1, y: 1 }]);
  });

  // --- collinear ---

  test('collinear horizontal - returns only the two endpoints', () => {
    const pts = [{ x: 1, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 0 }, { x: 2, y: 0 }];
    expect(sortPts(convexHull(pts))).toEqual([{ x: 0, y: 0 }, { x: 3, y: 0 }]);
  });

  test('collinear diagonal - returns only the two endpoints', () => {
    const pts = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }];
    expect(sortPts(convexHull(pts))).toEqual([{ x: 0, y: 0 }, { x: 3, y: 3 }]);
  });

  // --- correct hull vertices ---

  test('triangle - all three corners on hull', () => {
    const pts = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 2, y: 3 }];
    expect(sortPts(convexHull(pts))).toEqual(sortPts(pts));
  });

  test('square - all four corners on hull', () => {
    const pts = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
    expect(sortPts(convexHull(pts))).toEqual(sortPts(pts));
  });

  test('convex pentagon - all five corners on hull', () => {
    const pts = [
      { x: 0, y: 3 }, { x: 3, y: 1 }, { x: 2, y: -2 },
      { x: -2, y: -2 }, { x: -3, y: 1 },
    ];
    expect(sortPts(convexHull(pts))).toEqual(sortPts(pts));
  });

  test('returns hull vertices in clockwise order without repeating the first point', () => {
    const corners = [{ x: 0, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 0 }];
    const hull = convexHull([
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 1, y: 0 },
      { x: 0, y: 2 },
      { x: 2, y: 0 },
    ]);

    expect(sortPts(hull)).toEqual(sortPts(corners));
    expect(signedAreaTwice(hull)).toBeLessThan(0);
    expect(hull[0]).not.toEqual(hull[hull.length - 1]);
  });

  // --- exclusion ---

  test('interior point excluded from square hull', () => {
    const corners = [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 }];
    expect(sortPts(convexHull([...corners, { x: 1, y: 1 }]))).toEqual(sortPts(corners));
  });

  test('edge midpoint excluded from hull', () => {
    // (1,0) is the midpoint of the bottom edge from (0,0) to (2,0)
    const corners = [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 }, { x: 0, y: 2 }];
    expect(sortPts(convexHull([...corners, { x: 1, y: 0 }]))).toEqual(sortPts(corners));
  });

  test('cluster of interior points excluded, boundary preserved', () => {
    const boundary = [
      { x: 0, y: 3 }, { x: 3, y: 1 }, { x: 2, y: -2 },
      { x: -2, y: -2 }, { x: -3, y: 1 },
    ];
    const interior = [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 },
      { x: 0, y: 1 }, { x: 0, y: -1 },
    ];
    expect(sortPts(convexHull([...boundary, ...interior]))).toEqual(sortPts(boundary));
  });

  // --- coordinate types ---

  test('negative coordinates', () => {
    const boundary = [{ x: -2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 0 }, { x: 0, y: -2 }];
    expect(sortPts(convexHull([...boundary, { x: 0, y: 0 }]))).toEqual(sortPts(boundary));
  });

  test('fractional coordinates', () => {
    const boundary = [
      { x: 0.5, y: 0 }, { x: 1, y: 0.5 }, { x: 0.5, y: 1 }, { x: 0, y: 0.5 },
    ];
    expect(sortPts(convexHull([...boundary, { x: 0.5, y: 0.5 }]))).toEqual(sortPts(boundary));
  });

  // --- mutation safety ---

  test('does not mutate the input array', () => {
    const pts = [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 2 }];
    const before = pts.map(p => ({ ...p }));
    convexHull(pts);
    expect(pts).toEqual(before);
  });

  test('does not mutate point objects in the input', () => {
    const pts = [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 2 }];
    const before = pts.map(p => ({ ...p }));
    convexHull(pts);
    for (let i = 0; i < pts.length; i++) {
      expect(pts[i]).toEqual(before[i]);
    }
  });
});
