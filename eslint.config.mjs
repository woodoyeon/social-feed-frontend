// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import storybook from "eslint-plugin-storybook";
import globals from "globals"; // ✅ Jest/Browser/Node 전역 세트
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Next.js 기본 추천 + TS
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 공통 ignore
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },

  // Storybook 권장
  ...storybook.configs["flat/recommended"],

  // ✅ 테스트 파일 + setup 파일 전용 오버라이드 (Jest 전역 추가)
  {
    files: ["src/**/*.test.{ts,tsx}", "jest.setup.ts"],
    languageOptions: {
      globals: {
        ...globals.jest, // test/expect/describe/jest 등 모두 포함
      },
    },
  },

  // (선택) 앱 코드 전역(브라우저) 인식
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
