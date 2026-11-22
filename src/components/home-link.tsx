"use client";

import { House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";

type HomeLinkProps = {
  className?: string;
  back?: boolean;
  section?: "intro" | "countries" | "periods" | "battles" | "characters";
};

export const HomeLink = ({ className, back = false, section }: HomeLinkProps) => {
  const pathname = usePathname();
  const destination = section ?? (
    pathname.startsWith("/battle") ? "battles"
      : pathname.startsWith("/period") ? "periods"
        : pathname.startsWith("/characters") ? "characters"
          : "countries"
  );

  return (
    <Link
      href={`/#${destination}`}
      className={cn("home-link", className)}
      aria-label="Về trang Home"
    >
      {back ? <span aria-hidden="true">←</span> : null}
      <House size={16} aria-hidden="true" /><span>Home</span>
    </Link>
  );
};
