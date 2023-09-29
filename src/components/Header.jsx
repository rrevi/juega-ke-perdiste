import dominoLogo from '../assets/domino.svg';
import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	return (
		<header>
			<div class="headerLogo">
				<img src={dominoLogo} alt="Juega ke perdiste! logo" height="" width="90" />
			</div>
			<div class="headerTitle">
				<h4>Juega ke perdiste!</h4>
			</div>
		</header>
	);
}
