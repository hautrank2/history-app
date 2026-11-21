import type { Coordinate, FactionId } from "~/data/three-kingdoms";

type TerritoryModel = { faction: FactionId; ring: Coordinate[] };
type TerritoryBorderModel = {
  faction: FactionId;
  points: [Coordinate, Coordinate];
};

// Shared edges between areas of one state disappear after a conquest.
// Fronts between different states are drawn once over their touching fills.
export const territoryBorders = (territories: TerritoryModel[]) => {
  const edges = new Map<string, TerritoryBorderModel[]>();
  for (const territory of territories) {
    territory.ring.forEach((start, index) => {
      const end = territory.ring[(index + 1) % territory.ring.length];
      const endpoints = [start.join(","), end.join(",")];
      if (endpoints[0] === endpoints[1]) return;
      const key = endpoints.sort().join("/");
      const entries = edges.get(key) ?? [];
      entries.push({ faction: territory.faction, points: [start, end] });
      edges.set(key, entries);
    });
  }
  return [...edges.values()].flatMap((entries) =>
    entries.length > 1 && entries.every((entry) =>
      entry.faction === entries[0].faction,
    ) ? [] : [entries[0]],
  );
};
