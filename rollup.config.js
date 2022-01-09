import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

const plugins = [
	resolve(),
	commonjs(),
	typescript(),
];

export default [
	{
		input: 'src/index.ts',
		output: {
			name: 'validateModel',
			file: pkg.main,
			format: 'umd'
		},
		plugins,
	},
	{
		input: 'src/index.ts',
		external: ['ms'],
		output: [
			{
				file: pkg.module, 
				format: 'es'
			}
		],
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
