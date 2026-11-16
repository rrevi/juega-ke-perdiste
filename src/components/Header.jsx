import DominoLogo from './DominoLogo';

/** @param {{ rightAction?: import('preact').ComponentChildren }} [props] */
export function Header({ rightAction = null } = {}) {
	return (
		<header class="appHeader">
			<div class="headerContent">
				<DominoLogo />
				{rightAction && <div class="headerActions">{rightAction}</div>}
			</div>
		</header>
	);
}
