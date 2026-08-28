import dominoLogo from '../assets/domino.svg';

export function Header({ rightAction }) {
	return (
		<header class="appHeader">
			<div class="headerContent">
				<div class="headerBrand">
					<img src={dominoLogo} alt="Juega ke perdiste! logo" class="headerLogoImg" />
					<h1 class="headerAppTitle">Juega ke perdiste!</h1>
				</div>
				{rightAction && <div class="headerActions">{rightAction}</div>}
			</div>
		</header>
	);
}
