export type LngLatModel = [number, number];

// Phe quyết định màu của điểm và đường trên bản đồ
export type SideModel = "home" | "enemy" | "neutral";

export type PointKindModel = "capital" | "city" | "battle" | "ambush" | "stakes" | "port";

export type MapPointModel = {
  at: LngLatModel;
  label: string;
  kind: PointKindModel;
  side?: SideModel;
};

export type UnitKindModel = "army" | "cavalry" | "fleet";

export type PortraitModel = "tran-hung-dao" | "o-ma-nhi" | "thoat-hoan";

export type MapRouteModel = {
  path: LngLatModel[];
  side: SideModel;
  // Quân cờ chạy ở đầu đường; mặc định là bộ binh
  unit?: UnitKindModel;
};

export type CharacterModel = {
  name: string;
  role: string;
  side: SideModel;
  // Không có thì hiện bóng người theo màu phe
  portrait?: PortraitModel;
};

export type TerritoryModel = {
  // Biên giới trên đất liền, vẽ thành đường
  border: LngLatModel[];
  // Các điểm ngoài biển để khép vùng tô; lớp nước che phần thừa
  seaClosure: LngLatModel[];
};

export type RegionLabelModel = {
  at: LngLatModel;
  label: string;
};

export type CameraModel = {
  center: LngLatModel;
  zoom: number;
  pitch?: number;
  bearing?: number;
};

export type ChapterModel = {
  title: string;
  date: string;
  text: string;
  camera: CameraModel;
  points?: MapPointModel[];
  routes?: MapRouteModel[];
  characters?: CharacterModel[];
};

export type StoryModel = {
  title: string;
  subtitle: string;
  sides: { home: string; enemy: string };
  note?: string;
  territory?: TerritoryModel;
  regions?: RegionLabelModel[];
  chapters: ChapterModel[];
};

export type PeriodModel = {
  slug: string;
  years: string;
  title: string;
  blurb: string;
  // Không có story thì timeline hiện giai đoạn này là "chưa mở"
  story?: StoryModel;
};

export type CountryModel = {
  slug: string;
  name: string;
  periods: PeriodModel[];
};
