import { House } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";

type HomeLinkProps = { className?: string; back?: boolean };

export const HomeLink = ({ className, back = false }: HomeLinkProps) => <Link href="/" className={cn("home-link", className)} aria-label="Về trang Home">
  {back ? <span aria-hidden="true">←</span> : null}<House size={16} aria-hidden="true" /><span>Home</span>
</Link>;
