"use client";

import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function BackButton({ placement = "floating", fallbackHref }: { placement?: "floating" | "header"; fallbackHref?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/") return null;
  const fallback = fallbackHref ?? (pathname.startsWith("/battle/") ? "/battle"
    : pathname.startsWith("/period/") ? "/period"
    : pathname.startsWith("/characters/") ? "/characters" : "/");
  const label = placement === "floating" ? "Previous Page" : "Quay lại trang trước";
  return <button type="button" className={`atlas-back-button atlas-back-button--${placement}`} aria-label={label} title={label} onClick={() => {
    if (window.history.length > 1) router.back();
    else router.replace(fallback);
  }}><ArrowLeft size={16} aria-hidden="true" /></button>;
}
