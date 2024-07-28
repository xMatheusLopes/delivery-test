import angular from "@analogjs/vite-plugin-angular";

import { defineConfig } from "vite";
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  return {
    plugins: [tsconfigPaths(), angular()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["src/test-setup.ts"],
      include: ["**/*.spec.ts"],
      reporters: ["default"],
      coverage: {
        provider: 'istanbul',
        include: ["src/app/**"]
      }
    },
    define: {
      "import.meta.vitest": mode !== "production",
    },
  };
});
