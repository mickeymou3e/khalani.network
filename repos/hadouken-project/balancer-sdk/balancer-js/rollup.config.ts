import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const external = [...Object.keys(pkg.dependencies)];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'balancer-js',
        file: pkg.browser,
        format: 'umd',
        sourcemap: true,
        globals: {
          '@ethersproject/abi': 'abi',
          '@ethersproject/constants': 'constants',
          '@ethersproject/bignumber': 'bignumber',
          '@ethersproject/address': 'address',
          '@ethersproject/bytes': 'bytes',
          '@ethersproject/abstract-signer': 'abstractSigner',
          '@ethersproject/contracts': 'contracts',
          '@hadouken-project/sor': 'sor',
          '@balancer-labs/typechain': 'typechain',
          '@ethersproject/providers': 'providers',
          'graphql-request': 'graphqlRequest',
          'json-to-graphql-query': 'jsonToGraphqlQuery',
          graphql: 'graphql',
          axios: 'axios',
        },
      },
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
    plugins: [
      nodeResolve(),
      json(),
      commonjs(),
      optimizeLodashImports(),
      typescript({
        exclude: ['node_modules', '**/*.spec.ts'],
      }),
      terser({
        format: {
          comments: false,
        },
        compress: {
          pure_funcs: ['console.log', 'console.time', 'console.timeEnd'],
        },
      }),
    ],
    external,
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts(), typescript({ exclude: ['node_modules', '**/*.spec.ts'] })],
  },
];
