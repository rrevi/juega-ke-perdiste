import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	if (command === 'serve') {
		return {
			define: {
				// By default, Vite doesn't include shims for NodeJS/
				// necessary for segment analytics lib to work
				global: {}
			},
			plugins: [preact()]
		};
	}
	return {
		plugins: [preact()]
	};
});
