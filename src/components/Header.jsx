import dominoLogo from '../assets/domino.svg';

export function Header() {
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
