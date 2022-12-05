import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@pages': '/src/pages',
      '@components': '/src/components',
      '@models': '/src/models',
      // Amplify fix
      './runtimeConfig': './runtimeConfig.browser'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['node_modules/@syncfusion']
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  },
  test: {
    environment: 'jsdom'
  }
});
