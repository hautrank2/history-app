import Link from "next/link";

type SectionAnchorProps = { id: string; label: string };

export const SectionAnchor = ({ id, label }: SectionAnchorProps) => (
  <Link
    href={`/#${id}`}
    className="atlas-section-anchor inline-flex shrink-0 px-2 text-primary/70 hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
    aria-label={`Liên kết đến mục ${label}`}
    title={`Liên kết đến mục ${label}`}
  >
    #
  </Link>
);
