/**
 * Generate C2-continuous Bézier curve segments through points
 * Uses two points before and two points after for better tangent calculation
 *
 * @param {Array<{x: number, y: number}>} points - Array of all points
 * @param {number} tension - Controls curve tightness (0.1-1.0, default: 0.4)
 * @returns {Array<{start: {x,y}, end: {x,y}, control1: {x,y}, control2: {x,y}}>} - Array of valid Bézier segments
 */
function generateEnhancedC2BezierCurve(points, tension = 0.4) {
  // Need at least 5 points for the enhanced calculation (2 before + point + 2 after)
  if (!points || points.length < 5) {
    return [];
  }

  // Calculate tangent vectors at each point using wider neighborhood
  const tangents = calculateEnhancedTangents(points);

  // Generate all possible segments
  const segments = [];
  const n = points.length;

  // Clamp tension between 0 and 1
  const t = Math.max(0, Math.min(1, tension));

  // Generate segments only where we have enough data for proper tangent calculation
  // Skip first two and last two segments which don't have enough neighboring points
  for (let i = 2; i < n - 3; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];

    // Calculate segment length for scaling control points
    const segmentLength = distance(p0, p1);
    const controlScale = segmentLength * t;

    // Calculate control points using tangent vectors
    const control1 = {
      x: p0.x + tangents[i].x * controlScale,
      y: p0.y + tangents[i].y * controlScale,
    };

    const control2 = {
      x: p1.x - tangents[i + 1].x * controlScale,
      y: p1.y - tangents[i + 1].y * controlScale,
    };

    segments.push({
      start: { x: p0.x, y: p0.y },
      end: { x: p1.x, y: p1.y },
      control1,
      control2,
    });
  }

  return segments;
}

/**
 * Calculate enhanced tangent vectors using two points before and two points after
 */
function calculateEnhancedTangents(points) {
  const n = points.length;
  const tangents = new Array(n);

  // For interior points with enough neighbors, use 2 points before and 2 points after
  for (let i = 2; i < n - 2; i++) {
    // Use Catmull-Rom style calculation with wider neighborhood
    const p_2 = points[i - 2]; // 2 points before
    const p_1 = points[i - 1]; // 1 point before
    const p1 = points[i + 1]; // 1 point after
    const p2 = points[i + 2]; // 2 points after

    // Calculate weighted direction vector using all 4 neighboring points
    // This gives more weight to closer points but still considers the wider neighborhood
    const dx = (p2.x - p_2.x) * 0.5 + (p1.x - p_1.x);
    const dy = (p2.y - p_2.y) * 0.5 + (p1.y - p_1.y);

    // Normalize the tangent vector
    const len = Math.sqrt(dx * dx + dy * dy);
    tangents[i] = {
      x: dx / len,
      y: dy / len,
    };
  }

  // For points near the ends, use available points but maintain the same calculation approach
  // First point
  const dx0 = points[1].x - points[0].x;
  const dy0 = points[1].y - points[0].y;
  const len0 = Math.sqrt(dx0 * dx0 + dy0 * dy0);
  tangents[0] = {
    x: dx0 / len0,
    y: dy0 / len0,
  };

  // Second point
  const dx1 = points[2].x - points[0].x;
  const dy1 = points[2].y - points[0].y;
  const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  tangents[1] = {
    x: dx1 / len1,
    y: dy1 / len1,
  };

  // Second-to-last point
  const dxn1 = points[n - 1].x - points[n - 3].x;
  const dyn1 = points[n - 1].y - points[n - 3].y;
  const lenn1 = Math.sqrt(dxn1 * dxn1 + dyn1 * dyn1);
  tangents[n - 2] = {
    x: dxn1 / lenn1,
    y: dyn1 / lenn1,
  };

  // Last point
  const dxn = points[n - 1].x - points[n - 2].x;
  const dyn = points[n - 1].y - points[n - 2].y;
  const lenn = Math.sqrt(dxn * dxn + dyn * dyn);
  tangents[n - 1] = {
    x: dxn / lenn,
    y: dyn / lenn,
  };

  return tangents;
}

/**
 * Calculate Euclidean distance between two points
 */
function distance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}






ID, Description,	Size,	Material,	jpg filename,	Age,	Provenace,	Notes,	Room,	Overview jpg,	Value