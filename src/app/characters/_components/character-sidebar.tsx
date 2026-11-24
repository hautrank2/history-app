"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { useRef } from "react";

import { CharacterAvatar } from "~/components/character-avatar";
import { CountryFlag } from "~/components/country-flag";
import { Button } from "~/components/ui/button";
import { getCharacterCountry } from "~/data/character-countries";
import { characterHref } from "~/data/characters";
import type { HistoricalCharacterModel } from "~/data/characters";
import { portraitCaption, portraitFor, portraitPlaceholder } from "~/data/portraits";

type CharacterSidebarProps = {
  person: HistoricalCharacterModel;
  onClose: () => void;
  onReturnFocus: () => void;
};

export const CharacterSidebar = ({
  person,
  onClose,
  onReturnFocus,
}: CharacterSidebarProps) => {
  const sidebar = useRef<HTMLDivElement>(null);
  const portrait = portraitFor(person.wiki) ?? portraitPlaceholder;
  const country = getCharacterCountry(person.countryId);

  return (
    <Dialog.Root
      defaultOpen
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="character-sidebar-overlay fixed inset-0 z-60 bg-background/60 backdrop-blur-sm" />
        <Dialog.Content
          ref={sidebar}
          className="character-sidebar fixed inset-y-0 right-0 z-61 flex w-full max-w-[480px] flex-col border-l border-border bg-background text-foreground shadow-2xl outline-none"
          id="character-sidebar"
          data-character-id={person.id}
          onEscapeKeyDown={(event) => {
            const imagePreview = document.querySelector<HTMLDialogElement>(
              ".image-preview[open]",
            );
            if (imagePreview) {
              // The native image dialog owns Escape while above this sidebar.
              event.preventDefault();
              imagePreview.requestClose();
              requestAnimationFrame(() => sidebar.current?.focus());
            }
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            onReturnFocus();
          }}
        >
          <header className="character-sidebar-header flex shrink-0 items-start justify-between gap-4 border-b border-border p-5">
            <div className="character-sidebar-heading min-w-0">
              <Dialog.Title className="character-sidebar-title font-[family-name:var(--font-heading)] text-2xl">
                {person.name}
              </Dialog.Title>
              <Dialog.Description className="character-sidebar-role mt-2 text-sm leading-relaxed text-muted-foreground">
                {person.role}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                className="character-sidebar-close shrink-0"
                variant="ghost"
                size="icon"
                aria-label="Đóng chi tiết nhân vật"
              >
                <X size={20} aria-hidden="true" />
              </Button>
            </Dialog.Close>
          </header>
          <div className="character-sidebar-body min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
            <figure className="character-sidebar-portrait">
              <div className="character-sidebar-image relative mx-auto aspect-4/5 w-full max-w-[280px] overflow-hidden rounded-lg bg-card">
                <CharacterAvatar
                  name={person.name}
                  portrait={portrait}
                  fill
                  sizes="280px"
                />
              </div>
              <figcaption className="character-sidebar-caption mt-2 text-xs leading-relaxed text-muted-foreground">
                {portraitCaption(portrait)}
              </figcaption>
            </figure>
            <dl className="character-sidebar-facts my-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Quốc gia</dt>
              <dd className="character-sidebar-country flex items-center gap-2">
                <CountryFlag countryId={person.countryId} />{country.name}
              </dd>
              <dt className="text-muted-foreground">Niên đại</dt>
              <dd>{person.lifespan}</dd>
              {person.aliases.length ? (
                <>
                  <dt className="text-muted-foreground">Tên gọi khác</dt>
                  <dd>{person.aliases.join(" · ")}</dd>
                </>
              ) : null}
            </dl>
            <section className="character-sidebar-biography" aria-labelledby="character-sidebar-biography-heading">
              <h3 id="character-sidebar-biography-heading" className="font-[family-name:var(--font-heading)] text-xl">
                Tiểu sử
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {person.biography}
              </p>
            </section>
            <section className="character-sidebar-sources mt-6" aria-labelledby="character-sidebar-sources-heading">
              <h3 id="character-sidebar-sources-heading" className="font-[family-name:var(--font-heading)] text-xl">
                Tư liệu
              </h3>
              <ul className="mt-3 space-y-3 text-sm">
                {person.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      className="text-primary underline underline-offset-4"
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <footer className="character-sidebar-footer shrink-0 border-t border-border p-5">
            <Button className="character-sidebar-detail w-full" asChild>
              <Link href={characterHref(person.id)}>Xem chi tiết</Link>
            </Button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
