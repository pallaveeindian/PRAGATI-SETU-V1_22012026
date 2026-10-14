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
//     // Increase warning limit so logs stay clean
//     chunkSizeWarningLimit: 1500,

//     // Preload split chunks in parallel in the browser
//     modulePreload: {
//       polyfill: true,
//     },

//     // Enable CSS code splitting for faster first paint
//     cssCodeSplit: true,

//     // 🛑 Prevent tree-shaking breaking canvas + Split heavy libraries safely
//     rollupOptions: {
//       treeshake: false,
//       output: {
//         manualChunks(id) {
//           if (id.includes("node_modules")) {
//             // Keep captcha in default vendor bundle to avoid CommonJS interop issues
//             if (
//               id.includes("react-simple-captcha") ||
//               id.includes("react-html-parser")
//             ) {
//               return "vendor-legacy";
//             }
//             // Heavy Document & Excel Export Libraries (Loads in parallel)
//             if (
//               id.includes("exceljs") ||
//               id.includes("xlsx") ||
//               id.includes("docx") ||
//               id.includes("jszip") ||
//               id.includes("file-saver")
//             ) {
//               return "vendor-docs";
//             }
//             // Heavy Charting Libraries
//             if (
//               id.includes("chart.js") ||
//               id.includes("react-chartjs-2") ||
//               id.includes("recharts") ||
//               id.includes("@mui/x-charts")
//             ) {
//               return "vendor-charts";
//             }
//             // Interactive Maps
//             if (id.includes("leaflet") || id.includes("react-leaflet")) {
//               return "vendor-maps";
//             }
//             // UI Frameworks
//             if (
//               id.includes("@mui/material") ||
//               id.includes("@emotion") ||
//               id.includes("styled-components")
//             ) {
//               return "vendor-ui";
//             }
//           }
//         },
//       },
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
        target: "http://72.61.255.170:8080",
        // target: "https://upsrlmtms.upsdc.gov.in",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  optimizeDeps: {
    exclude: ["react-simple-captcha", "react-html-parser"],
  },

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      treeshake: false,
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor-react";
            }
            if (
              id.includes("@mui") ||
              id.includes("@emotion") ||
              id.includes("styled-components")
            ) {
              return "vendor-ui";
            }
            if (
              id.includes("chart.js") ||
              id.includes("recharts") ||
              id.includes("@mui/x-charts")
            ) {
              return "vendor-charts";
            }
            if (id.includes("leaflet") || id.includes("react-leaflet")) {
              return "vendor-maps";
            }
            if (
              id.includes("xlsx") ||
              id.includes("exceljs") ||
              id.includes("docx") ||
              id.includes("jszip")
            ) {
              return "vendor-docs";
            }
            return "vendor-libs";
          }
        },
      },
    },
    commonjsOptions: {
      include: [/react-simple-captcha/, /node_modules/],
    },
  },
});
