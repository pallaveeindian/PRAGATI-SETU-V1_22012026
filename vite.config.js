import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",

  plugins: [
    react({
      babel: {
        plugins: [],
      },
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: "http://66.116.207.88:8089",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  optimizeDeps: {
    exclude: ["react-simple-captcha", "react-html-parser"],
  },

  build: {
    rollupOptions: {
      treeshake: false,
    },
    commonjsOptions: {
      include: [/react-simple-captcha/, /node_modules/],
    },
  },
});
