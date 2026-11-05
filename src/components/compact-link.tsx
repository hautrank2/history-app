import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

type CompactLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export const CompactLink = ({ href, label, className }: CompactLinkProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Link
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        aria-label={label}
        className={cn(
          "compact-link inline-flex size-6 shrink-0 items-center justify-center rounded border border-border text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
          className,
        )}
      >
        <ExternalLink size={12} aria-hidden="true" />
      </Link>
    </TooltipTrigger>
    <TooltipContent className="max-w-72">{label}</TooltipContent>
  </Tooltip>
);
