import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

function gtagHtmlPlugin() {
	return {
		name: 'inject-gtag-prod',
		apply: /** @type {'build'} */ ('build'),
		/** @param {string} html */
		transformIndexHtml(html) {
			return html.replace(
				'</head>',
				`\t\t<!-- Google tag (gtag.js) -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=G-FL3MM2TRRL"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag() { dataLayer.push(arguments); }
			gtag('js', new Date());
			gtag('config', 'G-FL3MM2TRRL');
		</script>
	</head>`
			);
		}
	};
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const isTest = mode === 'test';
	return {
		base: './',
		plugins: [
			preact(
				isTest
					? undefined
					: {
						prerender: {
							enabled: true,
							renderTarget: '#app'
						}
					}
			),
			!isTest &&
				VitePWA({
					registerType: 'autoUpdate',
					manifest: false,
					workbox: {
						globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}']
					}
				}),
			gtagHtmlPlugin()
		].filter(Boolean),
		test: {
			environment: 'jsdom',
			setupFiles: ['./test/setup.js'],
			coverage: {
				provider: 'v8',
				include: ['src/**/*.{js,jsx}']
			}
		}
	};
});
