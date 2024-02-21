import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import externalGlobals from 'rollup-plugin-external-globals';
import pkg from './package.json' assert { type: 'json' };

const production = process.env.NODE_ENV === 'production';
console.debug(`${production ? 'PRODUCTION' : 'DEVELOPMENT'} mode bundle.`);

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      name: pkg.name,
      exports: 'named',
    },
    {
      file: pkg.main,
      format: 'iife',
      sourcemap: !production ? 'inline' : 'hidden',
      name: 'ed',
      globals: {
        jquery: '$',
        'datatables.net-bs5': 'DataTable',
      },
      plugins: [
        production &&
          terser({
            ecma: 2020,
            compress: true,
            mangle: true,
            maxWorkers: 4,
          }),
      ],
    },
  ],
  external: ['jquery', 'datatables.net-bs5'],
  plugins: [
    nodeResolve({
      browser: true,
      extensions: ['.ts', '.js'],
    }),
    commonjs(),
    externalGlobals({
      jquery: '$',
      'datatables.net-bs5': 'DataTable',
    }),
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
  ],
});
