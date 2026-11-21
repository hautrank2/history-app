export const battleDirectoryHref = "/battle";
export const periodDirectoryHref = "/period";
export const threeKingdomsHref = "/period/three-kingdoms";
export const bachDangHref = "/battle/tran-bach-dang-1288";
export const dienBienPhuHref = "/battle/tran-dien-bien-phu-1954";
export const battleHref = (id: string) => id === "bach-dang-1288" ? bachDangHref
  : id === "dien-bien-phu-1954" ? dienBienPhuHref : `/battle/tran-${id}`;

type SceneBattleLinkModel = { href: string; label: string };

const linksByScene: Readonly<Partial<Record<string, readonly SceneBattleLinkModel[]>>> = {
  "vietnam/tran-bach-dang": [{ href: bachDangHref, label: "Trận Bạch Đằng 1288" }],
  "vietnam/tran-dung-nuoc": [{ href: bachDangHref, label: "Trận Bạch Đằng 1288" }],
  "vietnam/tran-van-hoa": [{ href: bachDangHref, label: "Trận Bạch Đằng 1288" }],
  "vietnam/dien-bien-phu": [{ href: dienBienPhuHref, label: "Trận Điện Biên Phủ 1954" }],
  "china/three-kingdoms": [
    { href: threeKingdomsHref, label: "Khám phá thời kỳ Tam Quốc" },
  ],
};

export const battleLinksFor = (country: string, scene: string) =>
  linksByScene[`${country}/${scene}`] ?? [];
