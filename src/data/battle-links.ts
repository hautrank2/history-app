export const battleDirectoryHref = "/battle";
export const periodDirectoryHref = "/period";
export const threeKingdomsHref = "/period/three-kingdoms";
export const bachDangHref = "/battle/tran-bach-dang-1288";
export const dienBienPhuHref = "/battle/tran-dien-bien-phu-1954";
export const battleHref = (id: string) => id === "bach-dang-1288" ? bachDangHref
  : id === "dien-bien-phu-1954" ? dienBienPhuHref : `/battle/tran-${id}`;

type SceneBattleLinkModel = { href: string; label: string };

const linksByScene: Readonly<Partial<Record<string, readonly SceneBattleLinkModel[]>>> = {
  "vietnam/ngo": [{ href: battleHref("bach-dang-938"), label: "Trận Bạch Đằng 938" }],
  "vietnam/ly-nhu-nguyet": [{ href: battleHref("nhu-nguyet-1077"), label: "Trận Như Nguyệt 1077" }],
  "vietnam/lam-son": [{ href: battleHref("chi-lang-xuong-giang-1427"), label: "Chi Lăng – Xương Giang 1427" }],
  "vietnam/tay-son-rach-gam": [{ href: battleHref("rach-gam-xoai-mut-1785"), label: "Rạch Gầm – Xoài Mút 1785" }],
  "vietnam/tay-son-quang-trung": [{ href: battleHref("ngoc-hoi-dong-da-1789"), label: "Ngọc Hồi – Đống Đa 1789" }],
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
