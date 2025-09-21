/// <reference types="jest" />
import "@testing-library/jest-dom";

// ✅ Next.js navigation 훅 기본 mock (테스트 공통)
jest.mock("next/navigation", () => {
  const noop = () => {};
  return {
    useRouter: () => ({
      push: noop,
      prefetch: noop,
      replace: noop,
      back: noop,
    }),
    useSearchParams: () => ({
      get: () => null,
      toString: () => "",
      entries: function* () {},
      keys: function* () {},
      values: function* () {},
      has: () => false,
    }),
  };
});

// 모듈 스코프로 유지 (전역 오염 방지)
export {};
