function getNearestPoint(
  location,
  points,
  threshold = Number.MAX_SAFE_INTEGER
) {
  let minDistance = Number.MAX_SAFE_INTEGER;
  let nearestPoint = null;
  for (const point of points) {
    const dist = distance(point, location);
    // threshold: how far from point if we put mouse it will select it
    if (dist < minDistance && dist < threshold) {
      minDistance = dist;
      nearestPoint = point;
    }
  }
  return nearestPoint;
}

function getNearestSegment(
  location,
  segments,
  threshold = Number.MAX_SAFE_INTEGER
) {
  let minDistance = Number.MAX_SAFE_INTEGER;
  let nearestSegment = null;
  for (const segment of segments) {
    const dist = segment.distanceToPoint(location);
    // threshold: how far from segment if we put mouse it will select it
    if (dist < minDistance && dist < threshold) {
      minDistance = dist;
      nearestSegment = segment;
    }
  }
  return nearestSegment;
}

function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function average(p1, p2) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

function dot(p1, p2) {
  return p1.x * p2.x + p1.y * p2.y;
}

function add(p1, p2) {
  return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtract(p1, p2) {
  return new Point(p1.x - p2.x, p1.y - p2.y);
}

function scale(p, scaler) {
  return new Point(p.x * scaler, p.y * scaler);
}

function normalize(p) {
  return scale(p, 1 / magnitude(p));
}

function magnitude(p) {
  // distance of point from origin: sqrt(x^2+y^2)
  return Math.hypot(p.x, p.y);
}

function translate(loc, angle, offset) {
  return new Point(
    loc.x + Math.cos(angle) * offset,
    loc.y + Math.sin(angle) * offset
  );
}

function angle(p) {
  return Math.atan2(p.y, p.x);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerp2D(A, B, t) {
  return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
}

// Arguments are vectors
function getIntersection(A, B, C, D) {
  const tNumerator = (D.x - C.x) * (A.y - C.y) - (A.x - C.x) * (D.y - C.y);
  const uNumerator = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const denominator = (B.x - A.x) * (D.y - C.y) - (D.x - C.x) * (B.y - A.y);

  const eps = 0.001;
  if (Math.abs(denominator) > eps) {
    const t = tNumerator / denominator;
    const u = uNumerator / denominator;

    // return only when lines intersect
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // do linear interpolation on either A-B or C-D to get intersection point
      return {
        x: A.x + (B.x - A.x) * t,
        y: A.y + (B.y - A.y) * t,
        offset: t,
      };
    }
  }
  return null;
}

function getRandomColor() {
  const hue = 290 + Math.random() * 260;
  return `hsl(${hue},100%,60%)`;
}

function getFake3DPoint(point, viewPoint, height) {
  const direction = normalize(subtract(point, viewPoint));
  const dist = distance(point, viewPoint);
  const scaler = Math.atan(dist / 300) / (Math.PI / 2);
  return add(point, scale(direction, height * scaler));
}
