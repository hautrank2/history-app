import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.tsx"],
    ignores: ["src/components/ui/image.tsx"],
    rules: {
      "no-restricted-imports": ["error", { paths: [{ name: "next/image", message: "Use Image from @/components/ui/image so preview and accessibility stay shared." }] }],
      "no-restricted-syntax": ["error", { selector: "JSXOpeningElement[name.name='img']", message: "Native img is only allowed inside src/components/ui/image.tsx." }],
    },
  },
  globalIgnores([".next/**", "next-env.d.ts"]),
]);
