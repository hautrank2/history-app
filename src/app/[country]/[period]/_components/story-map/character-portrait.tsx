import type { ReactNode } from "react";

import type { PortraitModel } from "~/types";

type CharacterPortraitProps = {
  portrait?: PortraitModel;
  className?: string;
};

const ink = "#1c1410";

type BustProps = { background: string; skin: string; children: ReactNode; hair: ReactNode };

// Khung chung: nền, cổ, mặt, mắt mày. `children` vẽ dưới mặt (áo giáp), `hair` vẽ trên mặt (râu, mũ)
const Bust = ({ background, skin, children, hair }: BustProps) => (
  <>
    <rect width="80" height="96" fill={background} />
    {children}
    <rect x="34" y="56" width="12" height="14" fill={skin} />
    <ellipse cx="40" cy="44" rx="14" ry="17" fill={skin} />
    <path d="M29 40q5-3 9 0M42 40q4-3 9 0" stroke={ink} strokeWidth="2" fill="none" />
    <circle cx="34" cy="44" r="1.6" fill={ink} />
    <circle cx="46" cy="44" r="1.6" fill={ink} />
    <path d="M40 45v6l-2 1" stroke="#a87a55" strokeWidth="1.4" fill="none" />
    {hair}
  </>
);

// Chân dung cách điệu: không có tranh đương thời của các nhân vật này
const portraits: Record<PortraitModel, ReactNode> = {
  "tran-hung-dao": (
    <Bust
      background="#3a1414"
      skin="#e3b98c"
      hair={
        <>
          <path d="M27 50q1 12 6 17q7 14 14 0q5-5 6-17q-6 8-13 8t-13-8z" fill="#2a2320" />
          <path d="M32 53q8-4 16 0" stroke="#2a2320" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M24 30H9M56 30h15" stroke="#16110e" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M24 35q16-26 32 0z" fill="#16110e" />
          <rect x="24" y="32" width="32" height="5" fill="#c9972e" />
          <path d="M36 12h8l-1 7h-6z" fill="#c9972e" />
        </>
      }
    >
      <path d="M4 96q4-26 36-28q32 2 36 28z" fill="#8f1d1d" />
      <path d="M22 96l8-26h20l8 26z" fill="#c9972e" />
      <path d="M28 78h24M26 86h28" stroke="#8a6416" strokeWidth="1.5" />
      <path d="M30 70l10 10 10-10" stroke="#f3d27a" strokeWidth="2.5" fill="none" />
    </Bust>
  ),
  "o-ma-nhi": (
    <Bust
      background="#14202e"
      skin="#d6a57a"
      hair={
        <>
          <path d="M26 46q0 19 14 23q14-4 14-23q-4 9-14 9t-14-9z" fill={ink} />
          <path d="M31 53q9-5 18 0" stroke={ink} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M23 38v23l6 4V38zM57 38v23l-6 4V38z" fill="#5b616b" />
          <path d="M24 38q0-22 16-24q16 2 16 24z" fill="#8a9099" />
          <path d="M40 14v24" stroke="#5b616b" strokeWidth="1.5" />
          <rect x="22" y="34" width="36" height="5" fill="#5b616b" />
          <path d="M40 3v12" stroke="#8a9099" strokeWidth="3" />
          <path d="M40 3q10 2 7 12" stroke="#b3202a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      }
    >
      <path d="M4 96q4-26 36-28q32 2 36 28z" fill="#4b5563" />
      <path d="M12 82h56M8 90h64M24 74h32" stroke="#8a9099" strokeWidth="2" />
    </Bust>
  ),
  "thoat-hoan": (
    <Bust
      background="#12282a"
      skin="#e0b58a"
      hair={
        <>
          <path d="M25 46v22M55 46v22" stroke={ink} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M33 54q7-3 14 0" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M38 58h4l-2 7z" fill={ink} />
          <path d="M26 30q14-24 28 0z" fill="#b3202a" />
          <rect x="19" y="28" width="42" height="10" rx="5" fill="#6b4a2b" />
          <path d="M23 33h34" stroke="#8a6644" strokeWidth="2" strokeDasharray="2 3" />
          <circle cx="40" cy="10" r="3.5" fill="#d9b24c" />
        </>
      }
    >
      <path d="M4 96q4-26 36-28q32 2 36 28z" fill="#1f4e79" />
      <path d="M27 70l13 17 13-17" stroke="#d9b24c" strokeWidth="4.5" fill="none" />
      <path d="M14 96q2-14 10-22" stroke="#6b4a2b" strokeWidth="5" fill="none" />
      <path d="M66 96q-2-14-10-22" stroke="#6b4a2b" strokeWidth="5" fill="none" />
    </Bust>
  ),
};

export const CharacterPortrait = ({ portrait, className }: CharacterPortraitProps) =>
  portrait ? (
    <svg viewBox="0 0 80 96" className={className} aria-hidden>
      {portraits[portrait]}
    </svg>
  ) : (
    <svg viewBox="0 0 80 96" className={className} aria-hidden>
      <circle cx="40" cy="38" r="16" fill="currentColor" />
      <path d="M8 96q32-50 64 0z" fill="currentColor" />
    </svg>
  );
