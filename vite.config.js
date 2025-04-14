import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  plugins: [
    react(),
  ],
  build: {
    chunkSizeWarningLimit: 1600,
  },
  // server: {
  //   host: '0.0.0.0', // Force Vite to use localhost
  //   port: 8081,        // Keep your desired port
  // },
});
