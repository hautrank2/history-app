export const recentCharactersKey = "history-atlas-recent-characters";
export const readRecentCharacters = (): string[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(recentCharactersKey) ?? "[]");
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string"))].slice(0, 8) : [];
  } catch { return []; }
};
export const rememberCharacter = (id: string) => {
  try {
    localStorage.setItem(recentCharactersKey, JSON.stringify([id, ...readRecentCharacters().filter((previous) => previous !== id)].slice(0, 8)));
    window.dispatchEvent(new Event("atlas:recent-characters"));
  } catch { /* Profiles remain usable when browser storage is unavailable. */ }
};
