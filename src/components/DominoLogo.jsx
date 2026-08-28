import { h } from 'preact';
import { triggerHaptic } from '../utils/hardware';
import './DominoLogo.css';

export default function DominoLogo() {
	const handleLogoClick = () => {
		triggerHaptic('tap');
	};

	return (
		<div
			class="dominoLogoLockup"
			onClick={handleLogoClick}
			role="banner"
			title="Juega ke perdiste!"
			aria-label="Juega ke perdiste!"
		>
			<svg
				class="dominoHeaderLogoSvg"
				viewBox="50 65 410 380"
				width="42"
				height="38"
				aria-hidden="true"
			>
				<defs>
					{/* Shadows */}
					<filter id="headerTileShadowLeft" x="-20%" y="-20%" width="150%" height="150%">
						<feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.3" />
					</filter>
					<filter id="headerTileShadowRight" x="-20%" y="-20%" width="150%" height="150%">
						<feDropShadow dx="-8" dy="14" stdDeviation="14" flood-color="#000000" flood-opacity="0.4" />
					</filter>

					{/* Ceramic Gradient */}
					<linearGradient id="headerCeramicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stop-color="var(--surface)" />
						<stop offset="85%" stop-color="var(--surface)" />
						<stop offset="100%" stop-color="var(--surface-hover)" />
					</linearGradient>

					{/* Brass Spinner Rivet Gradient */}
					<radialGradient id="headerBrassGrad" cx="35%" cy="35%" r="65%">
						<stop offset="0%" stop-color="#ffe484" />
						<stop offset="45%" stop-color="var(--brass)" />
						<stop offset="100%" stop-color="#543702" />
					</radialGradient>
				</defs>

				{/* TILE 1: Left Domino [ J | K ] (Tilted -6°) */}
				<g transform="translate(80, 85) rotate(-6, 85, 160)" filter="url(#headerTileShadowLeft)">
					<rect
						class="dominoTileBody"
						x="0"
						y="0"
						width="170"
						height="320"
						rx="22"
						fill="url(#headerCeramicGrad)"
						stroke="var(--border)"
						stroke-width="4.5"
					/>
					<rect
						class="dominoTileInnerBevel"
						x="3.5"
						y="3.5"
						width="163"
						height="313"
						rx="18"
						fill="none"
						stroke="var(--surface)"
						stroke-width="2"
						stroke-opacity="0.8"
					/>

					{/* Center Divider */}
					<line x1="10" y1="159" x2="160" y2="159" stroke="var(--border)" stroke-width="2.5" opacity="0.45" />
					<line x1="10" y1="161.5" x2="160" y2="161.5" stroke="var(--surface)" stroke-width="1.5" opacity="0.9" />

					{/* Center Brass Spinner Rivet */}
					<circle cx="85" cy="160" r="9" fill="url(#headerBrassGrad)" stroke="var(--border)" stroke-width="1.5" />
					<circle cx="82" cy="157" r="2.5" fill="#ffffff" opacity="0.75" />

					{/* TOP HALF: Letter 'J' in Pips */}
					<circle class="dominoTilePip" cx="42" cy="36" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="85" cy="36" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="128" cy="36" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="128" cy="68" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="42" cy="100" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="128" cy="100" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="85" cy="128" r="11" fill="var(--text)" />

					{/* BOTTOM HALF: Letter 'K' in Pips */}
					<circle class="dominoTilePip" cx="42" cy="192" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="128" cy="192" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="42" cy="221" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="85" cy="221" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="42" cy="249" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="75" cy="249" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="42" cy="277" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="85" cy="277" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="42" cy="304" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="128" cy="304" r="11" fill="var(--text)" />
				</g>

				{/* TILE 2: Right Domino [ P | ! ] (Tilted +5°) */}
				<g transform="translate(255, 108) rotate(5, 85, 160)" filter="url(#headerTileShadowRight)">
					<rect
						class="dominoTileBody"
						x="0"
						y="0"
						width="170"
						height="320"
						rx="22"
						fill="url(#headerCeramicGrad)"
						stroke="var(--border)"
						stroke-width="4.5"
					/>
					<rect
						class="dominoTileInnerBevel"
						x="3.5"
						y="3.5"
						width="163"
						height="313"
						rx="18"
						fill="none"
						stroke="var(--surface)"
						stroke-width="2"
						stroke-opacity="0.8"
					/>

					{/* Center Divider */}
					<line x1="10" y1="159" x2="160" y2="159" stroke="var(--border)" stroke-width="2.5" opacity="0.45" />
					<line x1="10" y1="161.5" x2="160" y2="161.5" stroke="var(--surface)" stroke-width="1.5" opacity="0.9" />

					{/* Center Brass Spinner Rivet */}
					<circle cx="85" cy="160" r="9" fill="url(#headerBrassGrad)" stroke="var(--border)" stroke-width="1.5" />
					<circle cx="82" cy="157" r="2.5" fill="#ffffff" opacity="0.75" />

					{/* TOP HALF: Letter 'P' in Pips */}
					<circle class="dominoTilePip" cx="42" cy="36" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="85" cy="36" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="128" cy="36" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="42" cy="68" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="128" cy="68" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="42" cy="100" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="85" cy="100" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="128" cy="100" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="42" cy="128" r="11" fill="var(--text)" />

					{/* BOTTOM HALF: Exclamation '!' in Pips */}
					<circle class="dominoTilePip" cx="85" cy="192" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="85" cy="222" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="85" cy="252" r="11" fill="var(--text)" />
					<circle class="dominoTilePip" cx="85" cy="304" r="11" fill="var(--text)" />
				</g>
			</svg>
		</div>
	);
}
