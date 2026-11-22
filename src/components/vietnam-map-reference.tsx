import {
  vietnamIslands,
  vietnamLandPath,
  vietnamReferencePlaces,
  vietnamRiverPaths,
} from "~/data/vietnam-geography";
import type { GeographyProjectModel } from "~/data/vietnam-geography";

import "~/styles/vietnam-map-reference.css";

type VietnamMapLayerProps = {
  project: GeographyProjectModel;
  unitsPerPixel?: number;
  places?: boolean;
  outline?: boolean;
};

export const VietnamGeographyLayer = ({
  project,
  unitsPerPixel = 1,
  places = true,
  outline = true,
}: VietnamMapLayerProps) => (
  <g className="vn-geography" aria-label="Sông và địa danh tham chiếu hiện đại">
    {outline ? <path className="vn-coastline" d={vietnamLandPath(project)} /> : null}
    {vietnamRiverPaths(project).map((river) => (
      <path key={river.name} className="vn-river" d={river.path}>
        <title>{`${river.name} · địa lý tham chiếu hiện đại`}</title>
      </path>
    ))}
    {places ? vietnamReferencePlaces.map((place) => {
      const [x, y] = project(place.at);
      return (
        <g key={place.name} transform={`translate(${x} ${y})`}>
          <circle className="vn-city" r={2 * unitsPerPixel} />
          <text
            className="vn-city-label"
            x={6 * unitsPerPixel}
            y={-5 * unitsPerPixel}
            fontSize={12 * unitsPerPixel}
          >
            {place.name}
          </text>
        </g>
      );
    }) : null}
  </g>
);

export const VietnamIslandLayer = ({
  project,
  unitsPerPixel = 1,
}: VietnamMapLayerProps) => (
  <g className="vn-islands" aria-label="Hoàng Sa, Trường Sa và Phú Quốc · Việt Nam">
    <title>Biển đảo Việt Nam · tham chiếu hiện đại, ký hiệu phóng đại</title>
    {vietnamIslands.map((island) => (
      <g key={island.id} data-place-id={island.id} data-territory="vietnam">
        {island.points.map((at) => {
          const [x, y] = project([...at]);
          return (
            <path
              key={at.join(",")}
              transform={`translate(${x} ${y}) scale(${Math.min(1, unitsPerPixel)})`}
              d="M-3 0 0-2 3 0 2 3-2 3Z"
            />
          );
        })}
      </g>
    ))}
  </g>
);
