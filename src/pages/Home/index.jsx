import { h, Component, createRef } from 'preact';
import HandModel from '../../models/HandModel';
import Hand from '../../components/Hand';
import './style.css';

const WIN_SCORE = 200;
const MAX_HAND_SCORE = 168;
const CONFETTI_COUNT = 20;
const CONFETTI_COLORS = ['#c75b39', '#fdeccd', '#e5cfae', '#d4694a', '#ff9a3c', '#36d6b5'];

export default class Home extends Component {

	constructor() {
		super();
		this.state = {
			themInput: '',
			usInput: '',
			themError: false,
			usError: false,
			winner: null,
		};
		this.model = new HandModel('jkp-hands');
		this.themInputRef = createRef();
		this.winnerModalRef = createRef();
		this.model.subscribe(() => {
			const [themTotal, usTotal] = this.model.totalScores();
			let winner = null;
			if (themTotal >= WIN_SCORE) winner = 'them';
			else if (usTotal >= WIN_SCORE) winner = 'us';
			this.setState({ winner });
		});
	}

	componentDidUpdate(prevState) {
		if (!prevState.winner && this.state.winner) {
			this.winnerModalRef.current?.focus();
		}
	}

	componentWillUnmount() {
		this.model.dispose();
	}

	themInputChange = (e) => {
		this.setState({ themInput: e.target.value, themError: false });
	};

	usInputChange = (e) => {
		this.setState({ usInput: e.target.value, usError: false });
	};

	addHand = (them, us) => {
		this.model.add(parseInt(them), parseInt(us));
	};

	removeHand = (hand) => {
		this.model.destroy(hand);
	}

	addHandButtonClick = () => {
		let them = parseInt(this.state.themInput) || 0;
		let us = parseInt(this.state.usInput) || 0;

		let themError = them > 0 && them > MAX_HAND_SCORE;
		let usError = us > 0 && us > MAX_HAND_SCORE;

		this.setState({ themError, usError });

		if (themError || usError) return;

		if (them > 0 || us > 0) {
			this.addHand(them, us);
			this.setState({ themInput: '', usInput: '' });
			requestAnimationFrame(() => {
				this.themInputRef.current?.focus();
			});
		}
	};

	newGameButtonClick = () => {
		this.model.destroyAll();
		this.setState({ winner: null });
	}

	dismissWinner = () => {
		this.setState({ winner: null });
		requestAnimationFrame(() => {
			this.themInputRef.current?.focus();
		});
	};

	handleWinnerKeyDown = (e) => {
		if (e.key === 'Escape') {
			this.dismissWinner();
			return;
		}
		if (e.key === 'Tab') {
			const focusable = this.winnerModalRef.current?.querySelectorAll('button');
			if (focusable && focusable.length > 0) {
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (e.shiftKey) {
					if (document.activeElement === first) {
						e.preventDefault();
						last.focus();
					}
				} else {
					if (document.activeElement === last) {
						e.preventDefault();
						first.focus();
					}
				}
			}
		}
	};

	render(props, state) {
		let { hands } = this.model;
		let [themTotalScore, usTotalScore] = this.model.totalScores();

		let confetti = [];
		for (let i = 0; i < CONFETTI_COUNT; i++) {
			const left = Math.random() * 100;
			const delay = Math.random() * 3;
			const duration = 2 + Math.random() * 3;
			const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
			const size = 6 + Math.random() * 8;
			confetti.push(
				<div
					key={i}
					class="confetti"
					style={{
						left: `${left}%`,
						animationDelay: `${delay}s`,
						animationDuration: `${duration}s`,
						backgroundColor: color,
						width: `${size}px`,
						height: `${size}px`
					}}
				/>
			);
		}

		return (
			<div class="home">
				<section>
					<table class="gameHands">
						<caption class="sr-only">Tabla de puntaje de dominó</caption>
						<thead>
							<tr>
								<th class="teamEmoji">&#x1F985;<span class="sr-only">Águila</span></th>
								<th class="teamEmoji">&#x1F405;<span class="sr-only">Tigre</span></th>
								<th>
									<button
										type="button"
										id="newGameButton"
										class="newGameButton"
										onClick={this.newGameButtonClick}
										title="Nuevo Juego"
										aria-label="Nuevo Juego">
											&#8635;
									</button>
								</th>
							</tr>
						</thead>
						<tbody>
							{hands.map( hand => (
								<Hand
									key={hand._id}
									hand={hand}
									onRemove={() => this.removeHand(hand)}
								/>
							))}
							<tr>
								<td>
									<div class="inputWrapper">
										<input
											ref={this.themInputRef}
											id="themHandScore"
											name="themHandScore"
											value={state.themInput}
											onChange={this.themInputChange}
											placeholder="0"
											type="number"
											inputMode="numeric"
											pattern="[0-9]*"
											min="0"
											max="168"
											class={state.themError ? 'invalid' : ''}
											title="&#x1F985; Puntos de la Mano" />
									</div>
								</td>
								<td>
									<div class="inputWrapper">
										<input
											id="usHandScore"
											name="usHandScore"
											value={state.usInput}
											onChange={this.usInputChange}
											placeholder="0"
											type="number"
											inputMode="numeric"
											pattern="[0-9]*"
											min="0"
											max="168"
											class={state.usError ? 'invalid' : ''}
											title="&#x1F405; Puntos de la Mano" />
									</div>
								</td>
								<td>
									<button
										type="button"
										id="addHandButton"
										class="addHandButton"
										onClick={this.addHandButtonClick}
										title="Agregar Mano"
										aria-label="Agregar Mano">
											+
									</button>
								</td>
							</tr>
						</tbody>
						<tfoot>
						<tr>
							<th id="themTotalScore" title="&#x1F985; Puntaje Total" aria-live="polite">{themTotalScore}</th>
							<th id="usTotalScore" title="&#x1F405; Puntaje Total" aria-live="polite">{usTotalScore}</th>
							<th />
						</tr>
						</tfoot>
					</table>
				</section>

				{state.winner && (
					<div
						class="winnerBanner"
						role="dialog"
						aria-label="Anuncio de ganador"
						aria-modal="true"
						tabIndex={-1}
						ref={this.winnerModalRef}
						onKeyDown={this.handleWinnerKeyDown}
					>
						<div class="winnerConfetti">
							{confetti}
						</div>
						<div class="winnerEmoji">
							{state.winner === 'them' ? '\u{1F985}' : '\u{1F405}'}
						</div>
						<h2 class="winnerText">¡Ganador!</h2>
						<div class="winnerActions">
							<button onClick={this.dismissWinner}>Continuar</button>
							<button onClick={() => {
								this.dismissWinner();
								this.newGameButtonClick();
							}}>Nuevo Juego</button>
						</div>
					</div>
				)}
			</div>
		);
	}
}
