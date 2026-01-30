import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        setup: resolve(__dirname, 'setup-config.html'),
        loader: resolve(__dirname, 'config-loader.html')
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    minify: 'terser',
    sourcemap: false,
    target: 'es2015'
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  plugins: [
    {
      name: 'handlebars',
      transformIndexHtml(html) {
        return html;
      }
    }
  ],
  css: {
    devSourcemap: false
  }
});
