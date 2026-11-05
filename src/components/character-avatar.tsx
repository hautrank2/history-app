"use client";

import { useState } from "react";

import { Image } from "@/components/ui/image";
import { portraitCaption, portraitPlaceholder } from "~/data/portraits";
import type { PortraitModel } from "~/data/portraits";

type CharacterAvatarProps = {
  name: string;
  portrait: PortraitModel;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  preview?: boolean;
};

export const CharacterAvatar = ({
  name,
  portrait,
  ...props
}: CharacterAvatarProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const current = failedSrc === portrait.src ? portraitPlaceholder : portrait;

  return (
    <Image
      {...props}
      src={current.src}
      alt={current.placeholder
        ? `Ảnh đại diện tượng trưng cho ${name}`
        : current.generated
          ? `Minh họa AI ${name}, không phải chân dung xác thực`
          : `Hình ảnh ${name}`}
      title={portraitCaption(current)}
      style={{ objectPosition: current.position }}
      onError={() => setFailedSrc(portrait.src)}
    />
  );
};
