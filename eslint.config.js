import preact from 'eslint-config-preact';

export default [
	{
		ignores: ['dist/**', 'dev-dist/**', 'coverage/**']
	},
	...preact
];
