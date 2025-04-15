import { defineConfig } from 'vite'
//import eslintPlugin from "@nabla/vite-plugin-eslint";
//import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: './lib/index.ts',
      formats: ['es']
    },
    rollupOptions: {
      // don't include these in the bundled NPM package
      external: ['simple-statistics']
      //input: ['src/eval.ts'],
      //output: {
      //  format: 'es',
      //  dir: 'dist'
      //},
      //plugins: [typescript()]
    }
  },
  //plugins: [eslintPlugin({eslintOptions: {cache: false}})]
})
