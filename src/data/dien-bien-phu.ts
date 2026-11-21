import { vietnamOverview } from "~/data/vietnam-overview";
import type { OverviewSceneModel } from "~/data/vietnam-overview";

const base = vietnamOverview.find((scene) => scene.id === "dien-bien-phu")!;
// Reuse the sourced overview context; each campaign phase has a shareable hash.
export const dienBienPhuScenes: OverviewSceneModel[] = [
  { ...base, id: "dien-bien-chuan-bi", years: "Cuối 1953 – đầu 1954", title: "Chuẩn bị chiến dịch", summary: "Quân Pháp xây dựng tập đoàn cứ điểm trong lòng chảo Điện Biên. Bộ chỉ huy chiến dịch do Võ Nguyên Giáp đứng đầu tổ chức hậu cần và trận địa bao vây; phương châm tác chiến chuyển sang đánh chắc, tiến chắc." },
  { ...base, id: "dien-bien-dot-1", years: "13–17/3/1954", title: "Đợt 1 · Mở cửa phía Bắc", summary: "Ngày 13/3, chiến dịch mở màn bằng cuộc tiến công Him Lam. Các cứ điểm Độc Lập và Bản Kéo lần lượt bị loại khỏi hệ thống phòng ngự, mở đường tiến vào phân khu trung tâm." },
  { ...base, id: "dien-bien-dot-2", years: "30/3–30/4/1954", title: "Đợt 2 · Siết chặt vòng vây", summary: "Các đơn vị tiến công những cao điểm phía Đông, phát triển chiến hào và khống chế sân bay Mường Thanh. Giao tranh trên các đồi, đặc biệt A1, diễn ra kéo dài và quyết liệt." },
  { ...base, id: "dien-bien-phu", years: "1–7/5/1954", title: "Đợt 3 · Tổng công kích", summary: "Đợt tiến công cuối cùng đánh vào các cứ điểm còn lại. Ngày 7/5, sở chỉ huy Pháp bị chiếm, tướng de Castries bị bắt; chiến dịch kết thúc sau 56 ngày đêm." },
].map((scene) => ({ ...scene, era: "Chiến dịch Điện Biên Phủ", year: 1954, sources: ["Chiến dịch Điện Biên Phủ", "Võ Nguyên Giáp", "Christian de Castries"] }));

export const dienBienPhuSource = {
  title: "Cục Hàng không Việt Nam · Đề cương kỷ niệm 70 năm Chiến thắng Điện Biên Phủ",
  url: "https://caa.gov.vn/Pages/Print.aspx?NewsId=20240329111742840",
};
