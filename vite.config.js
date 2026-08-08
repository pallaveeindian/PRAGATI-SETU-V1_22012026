// // prod config
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [
//     react({
//       // 🚨 Disable react compiler for legacy libs
//       babel: {
//         plugins: [],
//       },
//     }),
//   ],

//   // 🛑 Do NOT optimize captcha libs
//   optimizeDeps: {
//     exclude: ["react-simple-captcha", "react-html-parser"],
//   },

//   build: {
//     // 🛑 Prevent tree-shaking breaking canvas
//     rollupOptions: {
//       treeshake: false,
//     },

//     // 🛑 Keep commonjs captcha intact
//     commonjsOptions: {
//       include: [/react-simple-captcha/, /node_modules/],
//     },
//   },
// });

// DEV VITE CONFIG
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
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
        // target: "http://72.61.255.170:8080",
        target: "http://upsrlmtms.upsdc.gov.in",
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
