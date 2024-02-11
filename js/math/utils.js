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

function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}
