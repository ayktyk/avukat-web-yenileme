import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    cssMinify: "esbuild",
    minify: "esbuild",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("react-dom") || id.includes("scheduler") || id.includes("react/")) {
            return "react-vendor";
          }
          if (id.includes("react-router")) {
            return "router-vendor";
          }
          if (id.includes("@radix-ui")) {
            return "radix-vendor";
          }
          if (id.includes("framer-motion")) {
            return "motion-vendor";
          }
          if (id.includes("recharts") || id.includes("d3-")) {
            return "charts-vendor";
          }
          if (id.includes("lucide-react")) {
            return "icons-vendor";
          }
          if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) {
            return "forms-vendor";
          }
          if (id.includes("date-fns")) {
            return "date-vendor";
          }
          if (id.includes("react-markdown") || id.includes("remark") || id.includes("micromark") || id.includes("mdast")) {
            return "markdown-vendor";
          }

          return "vendor";
        },
      },
    },
  },
}));
