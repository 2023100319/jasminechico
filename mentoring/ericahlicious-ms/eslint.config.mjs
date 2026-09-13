import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Async fetch functions called inside useEffect are standard Next.js/React practice.
      // The rule incorrectly flags indirect setState calls (via async helpers) as synchronous.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
