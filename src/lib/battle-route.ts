export function battleRouteGeometry(points: { x: number; y: number }[], bend = 30) {
  if (points.length < 2) return null;
  const start = points[0], end = points[points.length - 1];
  if (points.length === 2) {
    const dx = end.x - start.x, dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length < .001) return null;
    const offset = Math.max(bend, length * .14);
    const control = { x: (start.x + end.x) / 2 - dy / length * offset, y: (start.y + end.y) / 2 + dx / length * offset };
    return { path: `M${start.x},${start.y} Q${control.x},${control.y} ${end.x},${end.y}`,
      badgeAt: { x: (start.x + 2 * control.x + end.x) / 4, y: (start.y + 2 * control.y + end.y) / 4 } };
  }
  let total = 0;
  const lengths = points.slice(1).map((point, index) => {
    const length = Math.hypot(point.x - points[index].x, point.y - points[index].y);
    total += length;
    return length;
  });
  if (total < .001) return null;
  let remaining = total / 2;
  let badgeAt = start;
  for (let index = 0; index < lengths.length; index++) {
    if (remaining <= lengths[index] && lengths[index] > 0) {
      const ratio = remaining / lengths[index];
      badgeAt = { x: points[index].x + (points[index + 1].x - points[index].x) * ratio, y: points[index].y + (points[index + 1].y - points[index].y) * ratio };
      break;
    }
    remaining -= lengths[index];
  }
  return { path: points.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(""), badgeAt };
}
