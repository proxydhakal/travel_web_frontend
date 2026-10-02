import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxy = env.VITE_API_PROXY || "http://127.0.0.1:8000";
  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: Number(env.VITE_DEV_PORT || 5173),
      host: true,
      proxy: {
        "/api": apiProxy,
      },
    },
    preview: {
      port: Number(env.VITE_PREVIEW_PORT || 4173),
      host: true,
    },
  };
});
