// import tailwindcss from '@tailwindcss/vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';
// import {defineConfig} from 'vite';

// export default defineConfig(() => {
//   return {
//     plugins: [react(), tailwindcss()],
//     resolve: {
//       alias: {
//         '@': path.resolve(__dirname, '.'),
//       },
//     },
//     server: {
//       // HMR is disabled in AI Studio via DISABLE_HMR env var.
//       // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
//       hmr: process.env.DISABLE_HMR !== 'true',
//       // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
//       watch: process.env.DISABLE_HMR === 'true' ? null : {},
//     },
//   };
// });

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      // ✅ FIX: Custom compiler plugin that strips runtime @import injections 
      // directly out of compiled JavaScript vendor chunks before production deployment.
      {
        name: 'strip-runtime-css-imports',
        enforce: 'post',
        transform(code, id) {
          if (id.endsWith('.js') || id.endsWith('.ts') || id.endsWith('.tsx') || id.includes('node_modules')) {
            // Replaces illegal dynamic CSS insertRule("@import ...") calls with safe empty strings
            return {
              code: code.replace(/insertRule\s*\(\s*['"`]\s*@import[\s\S]*?['"`]\s*\)/g, 'insertRule("")'),
              map: null
            };
          }
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

});
