import { House } from "lucide-react";
import Link from "next/link";

export const RootLink = () => (
  <Link
    id="root-link"
    href="/"
    aria-label="Về trang gốc (Root)"
    className="root-link fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-[65] inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary/40 bg-background/95 px-4 text-sm font-semibold text-primary shadow-lg backdrop-blur-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
  >
    <House size={18} aria-hidden="true" />
    <span>Root</span>
  </Link>
);
