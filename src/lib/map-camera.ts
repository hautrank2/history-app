export type SvgMapCamera = { zoom: number; x: number; y: number };

// x/y are the world-space offset of the viewport center. Keep the world point
// under the cursor stationary when zooming, including after a manual pan.
export function zoomMapAt(camera: SvgMapCamera, factor: number, point: [number, number],
  size: [number, number] = [600, 520], limits: [number, number] = [.65, 16]): SvgMapCamera {
  const zoom = Math.max(limits[0], Math.min(limits[1], camera.zoom * factor));
  return {
    zoom,
    x: camera.x + (point[0] - size[0] / 2) * (1 / camera.zoom - 1 / zoom),
    y: camera.y + (point[1] - size[1] / 2) * (1 / camera.zoom - 1 / zoom),
  };
}
