import { defineConfig } from "vite";
import { TanStackStartVite } from "@tanstack/react-start/plugin";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    TanStackStartVite({
      server: { entry: "src/server.ts" }
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
