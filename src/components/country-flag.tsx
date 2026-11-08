import { Flag } from "lucide-react";
import { getCharacterCountry } from "~/data/character-countries";
import { NationalFlag } from "./national-flag";

type CountryFlagProps = { countryId: string };
const star = "M0-1 .2245-.309 .9511-.309 .3633.118 .5878.809 0 .382-.5878.809-.3633.118-.9511-.309-.2245-.309Z";

export const CountryFlag = ({ countryId }: CountryFlagProps) => {
  const country = getCharacterCountry(countryId);
  if (countryId === "vietnam") return <NationalFlag className="country-flag" />;
  if (countryId === "champa" || countryId === "nanyue") return <Flag className="country-flag" size={28} role="img" aria-label={`Biểu trưng ${country.name}, không phải quốc kỳ lịch sử`} />;
  return <svg className="country-flag" width="30" height="20" viewBox="0 0 30 20" role="img" aria-label={countryId === "soviet-union" ? "Quốc kỳ Liên Xô" : `Quốc kỳ ${country.name} hiện nay`}>
    {countryId === "china" ? <><path fill="#de2910" d="M0 0h30v20H0z" /><g fill="#ffde00"><path d={star} transform="translate(5 5) scale(3)" />{[[10, 2, 23], [12, 4, 45], [12, 7, 70], [10, 9, 20]].map(([x, y, angle]) => <path key={y} d={star} transform={`translate(${x} ${y}) rotate(${angle})`} />)}</g></> : null}
    {countryId === "france" ? <><path fill="#fff" d="M0 0h30v20H0z" /><path fill="#002395" d="M0 0h10v20H0z" /><path fill="#ed2939" d="M20 0h10v20H20z" /></> : null}
    {countryId === "thailand" ? <><path fill="#a51931" d="M0 0h30v20H0z" /><path fill="#f4f5f8" d="M0 3.33h30v13.34H0z" /><path fill="#2d2a4a" d="M0 6.67h30v6.66H0z" /></> : null}
    {countryId === "japan" ? <><path fill="#fff" d="M0 0h30v20H0z" /><circle cx="15" cy="10" r="6" fill="#bc002d" /></> : null}
    {countryId === "usa" ? <><path fill="#fff" d="M0 0h30v20H0z" />{Array.from({ length: 7 }, (_, i) => <path key={i} fill="#b22234" d={`M0 ${i * 40 / 13}h30v${20 / 13}H0z`} />)}<path fill="#3c3b6e" d="M0 0h12v10.77H0z" />{Array.from({ length: 9 }, (_, row) => Array.from({ length: row % 2 ? 5 : 6 }, (_, col) => <path key={`${row}-${col}`} d={star} fill="#fff" transform={`translate(${1 + col * 2 + row % 2} ${1 + row * 1.1}) scale(.45)`} />))}</> : null}
    {countryId === "cambodia" ? <><path fill="#032ea1" d="M0 0h30v20H0z" /><path fill="#e00025" d="M0 5h30v10H0z" /><path fill="#fff" d="M8 13h14v1H8zM9 11h12v2H9zM10 9h3v3h-3zM14 7h3v5h-3zM18 9h3v3h-3zM10 8h3v1h-3zM14 6h3v1h-3zM18 8h3v1h-3z" /></> : null}
    {countryId === "soviet-union" ? <><path fill="#cc0000" d="M0 0h30v20H0z" /><text x="3" y="11" fill="#ffd700" fontSize="10">☭</text><path d={star} fill="#ffd700" transform="translate(7 2)" /></> : null}
    {countryId === "england" ? <><path fill="#fff" d="M0 0h30v20H0z" /><path stroke="#ce1124" strokeWidth="4" d="M12 0v20M0 10h30" /></> : null}
    {countryId === "denmark" ? (
      <>
        <path fill="#c8102e" d="M0 0h30v20H0z" />
        <path stroke="#fff" strokeWidth="3" d="M11 0v20M0 10h30" />
      </>
    ) : null}
    {countryId === "norway" ? (
      <>
        <path fill="#ba0c2f" d="M0 0h30v20H0z" />
        <path stroke="#fff" strokeWidth="5" d="M11 0v20M0 10h30" />
        <path stroke="#00205b" strokeWidth="2.5" d="M11 0v20M0 10h30" />
      </>
    ) : null}
  </svg>;
};
