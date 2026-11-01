export type EffectSampleModel = { file: string; level: number; offset?: number; rate?: number };
// Kenney CC0 recordings, selected and layered for a restrained fantasy/MOBA UI.
export const effectSamples = {
  click: [{ file: "ui-click", level: .32 }, { file: "metal-click", level: .08 }],
  select: [{ file: "ui-select", level: .24 }, { file: "ui-confirm", level: .08, offset: .025 }],
  navigate: [{ file: "ui-transition", level: .25 }, { file: "book-flip", level: .12, offset: .025 }],
  open: [{ file: "ui-open", level: .24 }],
  close: [{ file: "ui-close", level: .20 }],
  march: [
    { file: "step-1", level: .38, offset: 0 }, { file: "step-2", level: .30, offset: .15 },
    { file: "step-3", level: .34, offset: .30 }, { file: "step-4", level: .27, offset: .45 },
    { file: "step-1", level: .28, offset: .60 }, { file: "step-2", level: .22, offset: .75 },
    { file: "armor-cloth", level: .13, offset: .1 }, { file: "metal-light", level: .07, offset: .35 },
  ],
  battle: [{ file: "sword-swish", level: .27 }, { file: "metal-impact", level: .23, offset: .14 }, { file: "step-3", level: .25, offset: .33 }, { file: "metal-light", level: .16, offset: .45 }],
  victory: [{ file: "ui-confirm", level: .28, rate: .9 }, { file: "ui-confirm", level: .18, offset: .20, rate: 1.125 }],
} satisfies Record<string, EffectSampleModel[]>;
