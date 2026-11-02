import type { LifeSceneModel } from "~/types/ho-chi-minh";

export const projectLifePoint = ([longitude, latitude]: number[]): [number, number] => [(longitude + 180) * 3, (85 - latitude) * 3];
export const lifePhase = (scene: LifeSceneModel): "roots" | "journey" | "leadership" => scene.year < 1911 ? "roots" : scene.year < 1941 ? "journey" : "leadership";
export const lifePhaseLabels = { roots: "1890–1910 · Cội nguồn", journey: "1911–1940 · Tìm đường & hoạt động quốc tế", leadership: "1941–1969 · Trở về & lãnh đạo đất nước" };

export type LifeMapLegModel = { id: string; from: number; to: number; path: string; arrow: string; phase: ReturnType<typeof lifePhase> };
export const lifeMapLegs = (scenes: LifeSceneModel[]): LifeMapLegModel[] => {
  const pairs = new Map<string, number>();
  return scenes.flatMap((scene, to) => {
    if (!to) return [];
    const [x1, y1] = projectLifePoint(scenes[to - 1].location.at);
    const [x2, y2] = projectLifePoint(scene.location.at);
    const length = Math.hypot(x2 - x1, y2 - y1);
    if (length < 1) return [];
    const key = [scenes[to - 1].location.at.map((value) => value.toFixed(1)).join(","), scene.location.at.map((value) => value.toFixed(1)).join(",")].sort().join("|");
    const visit = pairs.get(key) ?? 0;
    pairs.set(key, visit + 1);
    // Curves distinguish return visits without moving the geographic stops.
    const bend = Math.min(90, length * (.1 + visit * .055));
    const cx = (x1 + x2) / 2 - (y2 - y1) / length * bend;
    const cy = (y1 + y2) / 2 + (x2 - x1) / length * bend;
    const at = (t: number) => [(1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t ** 2 * x2, (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t ** 2 * y2];
    return [{ id: `${scenes[to - 1].id}-${scene.id}`, from: to - 1, to, path: `M${x1},${y1}Q${cx},${cy} ${x2},${y2}`, arrow: `M${at(.48).join(",")}L${at(.53).join(",")}`, phase: lifePhase(scene) }];
  });
};
