import { h } from 'preact';
import { triggerHaptic } from '../utils/hardware';
import './DominoLogo.css';

// 3x5 pip grid coordinates (x in 0..2, y in 0..4)
const GLYPH_PIPS = {
	J: [
		[0, 0], [1, 0], [2, 0],
		[2, 1],
		[2, 2],
		[0, 3], [2, 3],
		[1, 4]
	],
	K: [
		[0, 0], [2, 0],
		[0, 1], [1, 1],
		[0, 2], [1, 2],
		[0, 3], [1, 3],
		[0, 4], [2, 4]
	],
	P: [
		[0, 0], [1, 0], [2, 0],
		[0, 1], [2, 1],
		[0, 2], [1, 2], [2, 2],
		[0, 3],
		[0, 4]
	],
	'!': [
		[1, 0],
		[1, 1],
		[1, 2],
		[1, 4]
	]
};

const X_COORDS = [6.5, 14, 21.5];
const Y_COORDS = [6.5, 12.5, 19, 25.5, 31.5];

export function DominoTileGlyph({ char }) {
	const pips = GLYPH_PIPS[char] || [];

	return (
		<svg
			class="dominoTileSvg"
			viewBox="0 0 28 38"
			width="24"
			height="32"
			aria-hidden="true"
		>
			{/* Tile Background Body */}
			<rect
				class="dominoTileBody"
				x="1"
				y="1"
				width="26"
				height="36"
				rx="4"
				ry="4"
			/>
			{/* Center Dividing Line */}
			<line
				class="dominoTileDivider"
				x1="3"
				y1="19"
				x2="25"
				y2="19"
			/>
			{/* Center Brass Spinner Rivet */}
			<circle
				class="dominoTileRivet"
				cx="14"
				cy="19"
				r="1.2"
			/>
			{/* Pips */}
			{pips.map(([gx, gy], i) => (
				<circle
					key={i}
					class="dominoTilePip"
					cx={X_COORDS[gx]}
					cy={Y_COORDS[gy]}
					r="2"
				/>
			))}
		</svg>
	);
}

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
			<div class="dominoTilesRow">
				<DominoTileGlyph char="J" />
				<DominoTileGlyph char="K" />
				<DominoTileGlyph char="P" />
				<DominoTileGlyph char="!" />
			</div>
		</div>
	);
}
