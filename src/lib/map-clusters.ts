export type ClusterPointModel = { index: number; x: number; y: number };
export type MapClusterModel = { id: string; x: number; y: number; indices: number[] };

// Cluster in screen pixels so zooming naturally separates nearby locations.
// Every point remains in exactly one group, including coincident coordinates.
export const clusterMapPoints = (points: ClusterPointModel[], radius = 56): MapClusterModel[] => {
  const parents = points.map((_, index) => index);
  const root = (index: number): number => {
    if (parents[index] !== index) parents[index] = root(parents[index]);
    return parents[index];
  };
  points.forEach((point, index) => {
    for (let other = index + 1; other < points.length; other++) {
      if (Math.hypot(point.x - points[other].x, point.y - points[other].y) <= radius) parents[root(other)] = root(index);
    }
  });
  const groups = new Map<number, ClusterPointModel[]>();
  points.forEach((point, index) => {
    const group = groups.get(root(index)) ?? [];
    group.push(point); groups.set(root(index), group);
  });
  return [...groups.values()].map((group) => {
    const indices = group.map((point) => point.index).sort((a, b) => a - b);
    return { id: indices.join("-"), x: group.reduce((sum, point) => sum + point.x, 0) / group.length, y: group.reduce((sum, point) => sum + point.y, 0) / group.length, indices };
  });
};
