import type { Metadata } from "next";

import { ThreeKingdomsExperience } from "./_components";

export const metadata: Metadata = {
  title: "Tam Quốc trên bản đồ",
  description: "Theo dõi các trận đánh, vùng ảnh hưởng và nhân vật từ khởi nghĩa Khăn Vàng đến thế chân vạc Ngụy, Thục, Ngô.",
};

export default function ThreeKingdomsPage() {
  return <ThreeKingdomsExperience />;
}
