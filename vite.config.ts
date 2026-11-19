import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@react-three/rapier") || id.includes("node_modules/@dimforge/rapier3d")) {
            return "rapier";
          }
          if (id.includes("node_modules/three/") || id.includes("node_modules/three-stdlib/")) {
            return "three";
          }
          if (id.includes("node_modules/gsap/") || id.includes("node_modules/gsap-trial/")) {
            return "gsap";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
});
