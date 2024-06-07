/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import { resolve } from './vite.config';


export default defineConfig({
  resolve,
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
