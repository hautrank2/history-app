"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const storageKey = "history-atlas-reading-theme";
const changeEvent = "atlas:reading-theme-change";

const applyTheme = (mode: string) => {
  document.documentElement.dataset.readingMode = mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    mode === "dark" ? "#211e19" : "#f3ecdc",
  );
};

const subscribe = (callback: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    applyTheme(event.newValue === "dark" ? "dark" : "light");
    callback();
  };

  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", onStorage);
  };
};

export const ReadingThemeToggle = () => {
  const mode = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.readingMode ?? "light",
    () => "light",
  );
  const isDark = mode === "dark";
  const label = isDark ? "Chuyển sang giấy sáng" : "Chuyển sang đọc đêm";

  const toggleTheme = () => {
    const nextMode = isDark ? "light" : "dark";
    applyTheme(nextMode);
    try {
      localStorage.setItem(storageKey, nextMode);
    } catch {
      // Chế độ vẫn đổi được khi trình duyệt chặn lưu cài đặt.
    }
    window.dispatchEvent(new Event(changeEvent));
  };

  return (
    <button
      id="reading-theme-toggle"
      type="button"
      className="reading-theme-toggle"
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      onClick={toggleTheme}
    >
      {isDark ? <Sun size={19} aria-hidden /> : <Moon size={19} aria-hidden />}
    </button>
  );
};
