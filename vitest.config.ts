import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

const resolvePath = (str: string) => resolve(__dirname, str);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': resolvePath('./src'),
      tests: resolvePath('./tests'),
    },
  },
  test: {},
});
