import { House } from "lucide-react";
import Link from "next/link";

export const RootLink = () => (
  <Link
    id="root-link"
    href="/"
    aria-label="Về trang gốc (Root)"
    className="root-link"
  >
    <House size={18} aria-hidden="true" />
    <span>Root</span>
  </Link>
);
