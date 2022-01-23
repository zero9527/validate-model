import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

const banner = `\
// ================================== 
//    ${pkg.name}@${pkg.version}
//    ${pkg.description}
// ==================================
`;

const plugins = [
	resolve(),
	commonjs(),
	typescript()
];

export default [
	{
		input: 'src/index.ts',
		output: {
			name: 'validateModel',
			file: pkg.main,
			format: 'umd',
			banner,
		},
		plugins,
	},
	{
		input: 'src/index.ts',
		output: {
			name: 'validateModel',
			file: pkg.min,
			format: 'umd',
			banner,
		},
		plugins: [
			...plugins,
			terser({
				// format: { comments: 'all' }
				format: { comments: true }
			})
		],
	},
	{
		input: 'src/index.ts',
		output: [
			{
				file: pkg.module, 
				format: 'es',
				banner,
			}
		],
		external: ['ms'],
		plugins,
	},
	{
		input: 'src/index.ts',
		output: {
			file: pkg.typings,
			format: 'es',
		},
		plugins: [dts()],
	}
];
