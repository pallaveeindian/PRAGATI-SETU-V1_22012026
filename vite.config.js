// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react({
//       babel: {
//         plugins: [['babel-plugin-react-compiler']],
//       },
//     }),
//   ],
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [
    react({
      // 🚨 Disable react compiler for legacy libs
      babel: {
        plugins: [],
      },
    }),
  ],

  // 🛑 Do NOT optimize captcha libs
  optimizeDeps: {
    exclude: ["react-simple-captcha", "react-html-parser"],
  },

  build: {
    // 🛑 Prevent tree-shaking breaking canvas
    rollupOptions: {
      treeshake: false,
    },

    // 🛑 Keep commonjs captcha intact
    commonjsOptions: {
      include: [/react-simple-captcha/, /node_modules/],
    },
  },
});
