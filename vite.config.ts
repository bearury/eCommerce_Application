import { defineConfig } from 'vite';
import path from 'path';

export const resolve = {
  alias: {
    '@api': path.resolve(__dirname, 'src/api'),
    '@app': path.resolve(__dirname, 'src/app'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@entity': path.resolve(__dirname, 'src/entity'),
    '@pages': path.resolve(__dirname, 'src/pages'),
    '@router': path.resolve(__dirname, 'src/router'),
    '@state': path.resolve(__dirname, 'src/state'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    'node-fetch': 'isomorphic-fetch',
  },
};

export default defineConfig({
  resolve,
  define: {
    global: {},
  },
});
