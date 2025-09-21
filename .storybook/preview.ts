// .storybook/preview.ts
import type { Preview } from "@storybook/react";

// ✅ Jest mock이 global을 기대하기 때문에 브라우저 환경에서 폴리필
;(globalThis as any).global ??= globalThis;

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },
};

export default preview;
