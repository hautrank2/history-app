import { useId } from "react";

import type { EnglandFlagModel } from "~/data/england-geography";

type EnglandSceneFlagProps = { flag: EnglandFlagModel };

export const EnglandSceneFlag = ({ flag }: EnglandSceneFlagProps) => {
  const clipId = useId();
  return (
    <svg
      className="vo-scene-flag h-5 w-auto shrink-0 rounded-sm ring-1 ring-border"
      data-flag-design={flag.design}
      width="36"
      height="20"
      viewBox={flag.design === "st-george" ? "0 0 50 30" : "0 0 60 30"}
      role="img"
      aria-label={flag.label}
    >
      <title>{flag.label}</title>
      {flag.design === "st-george" ? (
        <>
          <path d="M0 0H50V30H0Z" fill="#fff" />
          <path d="M25 0V30M0 15H50" stroke="#ce1124" strokeWidth="6" />
        </>
      ) : flag.design === "commonwealth-jack" ? (
        <>
          <path d="M0 0H30V30H0Z" fill="#fff" />
          <path d="M15 0V30M0 15H30" stroke="#ce1124" strokeWidth="6" />
          <path d="M30 0H60V30H30Z" fill="#012169" />
          <g fill="none" stroke="#ffd458" strokeLinejoin="round">
            <path d="M39 6Q45 6 52 11L42 24Z" strokeWidth="2" />
            <path d="M43 8V21M46 9V18M49 10V14" />
          </g>
        </>
      ) : (
        <>
          <path d="M0 0H60V30H0Z" fill="#012169" />
          <path d="M0 0L60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
          {flag.design === "union-1801" ? (
            <>
              <clipPath id={clipId}>
                <path d="M30 15H60V30ZM30 15V30H0ZM30 15H0V0ZM30 15V0H60Z" />
              </clipPath>
              <path d="M0 0L60 30M60 0L0 30" stroke="#c8102e" strokeWidth="4" clipPath={`url(#${clipId})`} />
            </>
          ) : null}
          <path d="M30 0V30M0 15H60" stroke="#fff" strokeWidth="10" />
          <path d="M30 0V30M0 15H60" stroke="#c8102e" strokeWidth="6" />
        </>
      )}
    </svg>
  );
};
