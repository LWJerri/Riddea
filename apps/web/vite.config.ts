import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import "dotenv/config";

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 4000,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL ?? "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  optimizeDeps: { exclude: ["svelte-routing"] },
});
