import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/proxy.php": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy.php/, "/api/proxy.php"),
      },

      "/proxy_add.php": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/proxy_add.php/, "/api/proxy_add.php"),
      },

      "/proxy_delete.php": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(/^\/proxy_delete.php/, "/api/proxy_delete.php"),
      },

      "/proxy_update_expenses.php": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(
            /^\/proxy_update_expenses.php/,
            "/api/proxy_update_expenses.php"
          ),
      },
      "/proxy_get_categories.php": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(
            /^\/proxy_get_categories.php/,
            "/api/proxy_get_categories.php"
          ),
      },

      // Aggiunto il proxy per get_expenses.php
      "/proxy_get_expenses.php": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) =>
          path.replace(
            /^\/proxy_get_expenses.php/,
            "/api/proxy_get_expenses.php"
          ),
      },
    },
  },
  build: {
    outDir: "../",
    assetsDir: "assets",
  },
});
