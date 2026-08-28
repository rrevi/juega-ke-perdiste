import { h } from 'preact';
import DominoLogo from './DominoLogo';

export function Header({ rightAction }) {
	return (
		<header class="appHeader">
			<div class="headerContent">
				<DominoLogo />
				{rightAction && <div class="headerActions">{rightAction}</div>}
			</div>
		</header>
	);
}
