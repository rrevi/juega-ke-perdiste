import { h } from 'preact';
import { useState, useEffect, useMemo, useRef, useCallback } from 'preact/hooks';
import HandModel from '../../models/HandModel';
import Hand from '../../components/Hand';
import { requestWakeLock, releaseWakeLock, triggerHaptic } from '../../utils/hardware';
import './style.css';

const WIN_SCORE = 200;
const MAX_HAND_SCORE = 168;
const CONFETTI_COUNT = 20;
const CONFETTI_COLORS = ['#c75b39', '#fdeccd', '#e5cfae', '#d4694a', '#ff9a3c', '#36d6b5'];

function generateConfetti() {
	const pieces = [];
	for (let i = 0; i < CONFETTI_COUNT; i++) {
		pieces.push({
			left: Math.random() * 100,
			delay: Math.random() * 3,
			duration: 2 + Math.random() * 3,
			color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
			size: 6 + Math.random() * 8,
		});
	}
	return pieces;
}

export default function Home() {
	const modelRef = useRef(null);
	if (!modelRef.current) {
		modelRef.current = new HandModel('jkp-hands');
	}
	const model = modelRef.current;

	const [hands, setHands] = useState(model.hands);
	const [themInput, setThemInput] = useState('');
	const [usInput, setUsInput] = useState('');
	const [themError, setThemError] = useState(false);
	const [usError, setUsError] = useState(false);
	const [winner, setWinner] = useState(null);
	const [confetti, setConfetti] = useState([]);

	const themInputRef = useRef(null);
	const winnerModalRef = useRef(null);

	useEffect(() => {
		requestWakeLock();
		const unsubscribe = model.subscribe(() => {
			setHands([...model.hands]);
			const [themTotal, usTotal] = model.totalScores();
			if (themTotal >= WIN_SCORE) {
				setWinner(w => w !== null ? w : 'them');
			} else if (usTotal >= WIN_SCORE) {
				setWinner(w => w !== null ? w : 'us');
			}
		});

		return () => {
			unsubscribe();
			model.dispose();
			releaseWakeLock();
		};
	}, []);

	useEffect(() => {
		if (winner) {
			triggerHaptic('win');
			setConfetti(generateConfetti());
			winnerModalRef.current?.focus();
		}
	}, [winner]);

	const [themTotalScore, usTotalScore] = useMemo(() => {
		let themTotal = 0;
		let usTotal = 0;
		hands.forEach(hand => {
			themTotal += hand.themScore;
			usTotal += hand.usScore;
		});
		return [themTotal, usTotal];
	}, [hands]);

	const removeHand = useCallback((hand) => {
		triggerHaptic('remove');
		model.destroy(hand);
	}, []);

	const addHandButtonClick = useCallback(() => {
		const them = parseInt(themInput, 10) || 0;
		const us = parseInt(usInput, 10) || 0;

		const themErr = them > 0 && them > MAX_HAND_SCORE;
		const usErr = us > 0 && us > MAX_HAND_SCORE;

		setThemError(themErr);
		setUsError(usErr);

		if (themErr || usErr) {
			triggerHaptic('error');
			return;
		}

		if (them > 0 || us > 0) {
			triggerHaptic('success');
			model.add(them, us);
			setThemInput('');
			setUsInput('');
			requestAnimationFrame(() => {
				themInputRef.current?.focus();
			});
		}
	}, [themInput, usInput]);

	const newGameButtonClick = useCallback(() => {
		triggerHaptic('tap');
		model.destroyAll();
		setWinner(null);
	}, []);

	const dismissWinner = useCallback(() => {
		setWinner(null);
		requestAnimationFrame(() => {
			themInputRef.current?.focus();
		});
	}, []);

	const handleWinnerKeyDown = useCallback((e) => {
		if (e.key === 'Escape') {
			dismissWinner();
			return;
		}
		if (e.key === 'Tab') {
			const focusable = winnerModalRef.current?.querySelectorAll('button');
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
	}, [dismissWinner]);

	const themInputChange = useCallback((e) => {
		setThemInput(e.target.value);
		setThemError(false);
	}, []);

	const usInputChange = useCallback((e) => {
		setUsInput(e.target.value);
		setUsError(false);
	}, []);

	return (
		<div class="home">
			{/* Sticky Top Scoreboard */}
			<div class="stickyScoreboard">
				<div class="scoreboardContainer">
					<div class="teamCard themTeamCard">
						<div class="teamHeader">
							<span class="teamEmoji" role="img" aria-label="Águila">&#x1F985;</span>
							<span class="teamLabel">Ellos</span>
						</div>
						<div class="teamScore" id="themTotalScore" title="&#x1F985; Puntaje Total" aria-live="polite">
							{themTotalScore}
						</div>
					</div>

					<div class="scoreboardCenter">
						<div class="scoreDivider">VS</div>
						<button
							type="button"
							id="newGameButton"
							class="newGameButton"
							onClick={newGameButtonClick}
							title="Nuevo Juego"
							aria-label="Nuevo Juego">
								&#8635;
						</button>
					</div>

					<div class="teamCard usTeamCard">
						<div class="teamHeader">
							<span class="teamEmoji" role="img" aria-label="Tigre">&#x1F405;</span>
							<span class="teamLabel">Nosotros</span>
						</div>
						<div class="teamScore" id="usTotalScore" title="&#x1F405; Puntaje Total" aria-live="polite">
							{usTotalScore}
						</div>
					</div>
				</div>
			</div>

			{/* Scrollable Hands History */}
			<section class="handsSection">
				<div class="handsContainer">
					<table class="gameHands">
						<caption class="sr-only">Tabla de puntaje de dominó</caption>
						<thead>
							<tr>
								<th>&#x1F985; Puntos</th>
								<th>&#x1F405; Puntos</th>
								<th>Acción</th>
							</tr>
						</thead>
						<tbody>
							{hands.length === 0 ? (
								<tr class="emptyHandsRow">
									<td colSpan={3}>
										<div class="emptyState">
											<span>🀄</span>
											<p>No hay manos jugadas aún.<br />Ingresa los puntos abajo.</p>
										</div>
									</td>
								</tr>
							) : (
								hands.map(hand => (
									<Hand
										key={hand._id}
										hand={hand}
										onRemove={() => removeHand(hand)}
									/>
								))
							)}
						</tbody>
					</table>
				</div>
			</section>

			{/* Input Bar */}
			<div class="inputSection">
				<div class="inputContainer">
					<div class="inputWrapper">
						<label htmlFor="themHandScore" class="inputLabel">&#x1F985; Ellos</label>
						<input
							id="themHandScore"
							name="themHandScore"
							ref={themInputRef}
							value={themInput}
							onChange={themInputChange}
							placeholder="0"
							type="number"
							inputMode="numeric"
							pattern="[0-9]*"
							min="0"
							max="168"
							class={themError ? 'invalid' : ''}
							title="&#x1F985; Puntos de la Mano" />
					</div>

					<div class="inputWrapper">
						<label htmlFor="usHandScore" class="inputLabel">&#x1F405; Nosotros</label>
						<input
							id="usHandScore"
							name="usHandScore"
							value={usInput}
							onChange={usInputChange}
							placeholder="0"
							type="number"
							inputMode="numeric"
							pattern="[0-9]*"
							min="0"
							max="168"
							class={usError ? 'invalid' : ''}
							title="&#x1F405; Puntos de la Mano" />
					</div>

					<button
						type="button"
						id="addHandButton"
						class="addHandButton"
						onClick={addHandButtonClick}
						title="Agregar Mano"
						aria-label="Agregar Mano">
							+
					</button>
				</div>
			</div>

			{winner && (
				<div
					class="winnerBanner"
					role="dialog"
					aria-label="Anuncio de ganador"
					aria-modal="true"
					tabIndex={-1}
					ref={winnerModalRef}
					onKeyDown={handleWinnerKeyDown}
				>
					<div class="winnerConfetti">
						{confetti.map((piece, i) => (
							<div
								key={i}
								class="confetti"
								style={{
									left: `${piece.left}%`,
									animationDelay: `${piece.delay}s`,
									animationDuration: `${piece.duration}s`,
									backgroundColor: piece.color,
									width: `${piece.size}px`,
									height: `${piece.size}px`
								}}
							/>
						))}
					</div>
					<div class="winnerEmoji">
						{winner === 'them' ? '\u{1F985}' : '\u{1F405}'}
					</div>
					<h2 class="winnerText">¡Ganador!</h2>
					<div class="winnerActions">
						<button onClick={dismissWinner}>Continuar</button>
						<button onClick={() => {
							dismissWinner();
							newGameButtonClick();
						}}>Nuevo Juego</button>
					</div>
				</div>
			)}
		</div>
	);
}