import type { Metadata } from "next";

import { ThreeKingdomsExperience } from "./_components";

export const metadata: Metadata = {
  title: "Tam Quốc trên bản đồ",
  description: "Theo dõi Tam Quốc từ Khăn Vàng năm 184, các cuộc Bắc phạt của Gia Cát Lượng, họ Tư Mã lập Tấn đến thống nhất năm 280.",
};

export default function ThreeKingdomsPage() {
  return <ThreeKingdomsExperience />;
}
