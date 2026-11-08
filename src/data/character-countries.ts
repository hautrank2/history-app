export const characterCountries = [
  { id: "vietnam", name: "Việt Nam" },
  { id: "china", name: "Trung Quốc" },
  { id: "france", name: "Pháp" },
  { id: "thailand", name: "Thái Lan" },
  { id: "japan", name: "Nhật Bản" },
  { id: "usa", name: "Hoa Kỳ" },
  { id: "cambodia", name: "Campuchia" },
  { id: "soviet-union", name: "Liên Xô" },
  { id: "england", name: "Anh" },
  { id: "denmark", name: "Đan Mạch" },
  { id: "norway", name: "Na Uy" },
  { id: "champa", name: "Champa" },
  { id: "nanyue", name: "Nam Việt" },
];

export const getCharacterCountry = (id: string) => {
  const country = characterCountries.find((item) => item.id === id);
  if (!country) throw new Error(`Unknown character country: ${id}`);
  return country;
};
