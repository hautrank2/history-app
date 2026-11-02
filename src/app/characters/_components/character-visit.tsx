"use client";

import { useEffect } from "react";
import { rememberCharacter } from "~/lib/recent-characters";

export const CharacterVisit = ({ id }: { id: string }) => {
  useEffect(() => { rememberCharacter(id); }, [id]);
  return null;
};
