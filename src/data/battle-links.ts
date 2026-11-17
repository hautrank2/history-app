export const battleDirectoryHref = "/battle";
export const threeKingdomsHref = "/battle/three-kingdoms";

type SceneBattleLinkModel = { href: string; label: string };

const linksByScene: Readonly<Partial<Record<string, readonly SceneBattleLinkModel[]>>> = {
  "china/three-kingdoms": [
    { href: threeKingdomsHref, label: "Chi tiết trận đánh" },
  ],
};

export const battleLinksFor = (country: string, scene: string) =>
  linksByScene[`${country}/${scene}`] ?? [];
