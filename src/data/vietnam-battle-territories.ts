import { geographicLine, vietnamLandPath, type GeographyProjectModel } from "~/data/vietnam-geography";

// Schematic historical extent, not cadastral boundaries or military control.
// Northern/western vertices follow the existing 1288 story reconstruction.
const north = [[108.05, 21.54], [107.2, 21.72], [106.72, 21.98], [106.55, 22.45],
  [106.0, 22.95], [105.32, 23.35], [104.8, 22.9], [103.95, 22.5], [103.75, 21.7],
  [104.1, 20.9], [104.6, 20.45], [104.05, 19.45]];
const medieval = (south: number) => [...north, [104.9, 18.8], [105.2, 18.55],
  ...(south < 18 ? [[105.6, 17.9], [106.3, south], [107.1, south]] : [[105.7, south]]),
  [106.1, 19.7], [106.8, 20.8], [108.05, 21.54]];

export function vietnamBattleTerritory(id: string, project: GeographyProjectModel) {
  const year = Number(id.match(/\d{3,4}$/)?.[0]);
  const early = year < 1500;
  const south = year === 938 ? 18 : year === 1077 ? 17.1 : year === 1288 ? 16.85 : 16.2;
  return {
    path: early ? `${geographicLine(medieval(south), project)}Z` : vietnamLandPath(project),
    name: year === 938 ? "TĨNH HẢI QUÂN · NGÔ QUYỀN" : year < 1400 ? "ĐẠI VIỆT"
      : year === 1427 ? "ĐẠI VIỆT · KHỞI NGHĨA LAM SƠN" : year < 1800 ? "ĐẠI VIỆT" : "VIỆT NAM · 1954",
    label: early ? [105.5, 19.6] : [107.2, 15.5],
    neighbors: [
      { name: year === 938 ? "NAM HÁN" : year === 1077 ? "TỐNG" : year === 1288 ? "NGUYÊN" : year === 1427 ? "MINH" : year < 1800 ? "THANH" : "TRUNG QUỐC", at: [107.7, 25] },
      { name: year < 1353 ? "CÁC MƯỜNG LÀO" : year < 1700 ? "LAN XANG" : year < 1900 ? "CÁC VƯƠNG QUỐC LÀO" : "LÀO", at: [101.8, 19.2] },
      { name: year < 1500 ? "CHAMPA" : year < 1900 ? "CHÂN LẠP" : "CAMPUCHIA", at: year < 1500 ? [108.5, 14] : [104.2, 12.5] },
      { name: year < 1400 ? "VÙNG CHAO PHRAYA" : year < 1900 ? "XIÊM" : "THÁI LAN", at: [100.2, 15.2] },
    ],
    note: early
      ? "Vùng tô và nét liền: phạm vi lịch sử khái quát; đường biên cổ có độ bất định. Nét mảnh đứt: biên giới hiện đại để định hướng."
      : year < 1800
        ? "Đại Việt có nhiều thế lực cùng tồn tại. Vùng tô chỉ không gian địa lý khái quát, không thể hiện toàn bộ đất nước thuộc quyền Tây Sơn. Nét đứt là biên giới hiện đại."
        : "Bối cảnh Việt Nam trong chiến tranh Đông Dương, trước Hiệp định Genève. Vùng tô không biểu thị vùng kiểm soát quân sự; nét đứt là biên giới hiện đại.",
    source: early
      ? { title: "Đại học Đà Lạt · Quá trình mở rộng lãnh thổ về phía Nam", url: "https://tckh.dlu.edu.vn/index.php/tckhdhdl/article/download/641/292" }
      : { title: "Bảo tàng Lịch sử Quốc gia", url: "https://baotanglichsu.vn" },
  };
}
