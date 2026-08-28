import { h } from 'preact';
import { useState, useEffect, useMemo, useRef, useCallback } from 'preact/hooks';
import HandModel from '../../models/HandModel';
import Hand from '../../components/Hand';
import ScoreInputDrawer from '../../components/ScoreInputDrawer';
import ConfirmModal from '../../components/ConfirmModal';
import SettingsModal from '../../components/SettingsModal';
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
	const [drawerState, setDrawerState] = useState({ isOpen: false, team: 'them' });

	const [winScore, setWinScore] = useState(() => {
		try {
			const s = localStorage.getItem('jkp-win-score');
			return s ? parseInt(s, 10) : 200;
		} catch {
			return 200;
		}
	});

	const [team1, setTeam1] = useState(() => {
		try {
			const t = localStorage.getItem('jkp-team1');
			return t ? JSON.parse(t) : { name: 'Ellos', emoji: '🦅' };
		} catch {
			return { name: 'Ellos', emoji: '🦅' };
		}
	});

	const [team2, setTeam2] = useState(() => {
		try {
			const t = localStorage.getItem('jkp-team2');
			return t ? JSON.parse(t) : { name: 'Nosotros', emoji: '🐅' };
		} catch {
			return { name: 'Nosotros', emoji: '🐅' };
		}
	});

	const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const themInputRef = useRef(null);
	const winnerModalRef = useRef(null);

	const openDrawer = useCallback((team) => {
		triggerHaptic('tap');
		setDrawerState({ isOpen: true, team });
	}, []);

	const closeDrawer = useCallback(() => {
		setDrawerState(prev => ({ ...prev, isOpen: false }));
	}, []);

	const handleDrawerScore = useCallback((score) => {
		if (drawerState.team === 'them') {
			model.add(score, 0);
		} else {
			model.add(0, score);
		}
	}, [drawerState.team]);

	const handleSaveSettings = useCallback((newSettings) => {
		setWinScore(newSettings.winScore);
		setTeam1(newSettings.team1);
		setTeam2(newSettings.team2);
		try {
			localStorage.setItem('jkp-win-score', String(newSettings.winScore));
			localStorage.setItem('jkp-team1', JSON.stringify(newSettings.team1));
			localStorage.setItem('jkp-team2', JSON.stringify(newSettings.team2));
		} catch {
			// ignore storage errors
		}
	}, []);

	useEffect(() => {
		requestWakeLock();
		const unsubscribe = model.subscribe(() => {
			setHands([...model.hands]);
			const [themTotal, usTotal] = model.totalScores();
			if (themTotal >= winScore) {
				setWinner(w => w !== null ? w : 'them');
			} else if (usTotal >= winScore) {
				setWinner(w => w !== null ? w : 'us');
			}
		});

		return () => {
			unsubscribe();
			model.dispose();
			releaseWakeLock();
		};
	}, [winScore]);

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
		if (hands.length > 0) {
			setIsConfirmResetOpen(true);
		} else {
			model.destroyAll();
			setWinner(null);
		}
	}, [hands.length]);

	const handleConfirmReset = useCallback(() => {
		model.destroyAll();
		setWinner(null);
		setIsConfirmResetOpen(false);
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
					<div
						class="teamCard themTeamCard clickableTeamCard"
						role="button"
						tabIndex={0}
						onClick={() => openDrawer('them')}
						onKeyDown={(e) => e.key === 'Enter' && openDrawer('them')}
						title={`Tocar para sumar puntos a ${team1.name}`}
					>
						<div class="teamHeader">
							<span class="teamEmoji" role="img" aria-label={team1.name}>{team1.emoji}</span>
							<span class="teamLabel">{team1.name}</span>
						</div>
						<div class="teamScore" id="themTotalScore" title="&#x1F985; Puntaje Total" aria-live="polite">
							{themTotalScore}
						</div>
						<span class="tapToScoreHint">+ Tocar para sumar</span>
					</div>

					<div class="scoreboardCenter">
						<div class="scoreDivider">VS</div>
						<div class="centerControls">
							<button
								type="button"
								id="newGameButton"
								class="newGameButton"
								onClick={newGameButtonClick}
								title="Nuevo Juego"
								aria-label="Nuevo Juego">
									&#8635;
							</button>
							<button
								type="button"
								id="settingsButton"
								class="settingsTriggerBtn"
								onClick={() => {
									triggerHaptic('tap');
									setIsSettingsOpen(true);
								}}
								title="Ajustes"
								aria-label="Ajustes">
									⚙️
							</button>
						</div>
						<button
							type="button"
							class="targetScorePill"
							onClick={() => {
								triggerHaptic('tap');
								setIsSettingsOpen(true);
							}}
							title="Meta para ganar"
						>
							Meta: {winScore}
						</button>
					</div>

					<div
						class="teamCard usTeamCard clickableTeamCard"
						role="button"
						tabIndex={0}
						onClick={() => openDrawer('us')}
						onKeyDown={(e) => e.key === 'Enter' && openDrawer('us')}
						title={`Tocar para sumar puntos a ${team2.name}`}
					>
						<div class="teamHeader">
							<span class="teamEmoji" role="img" aria-label={team2.name}>{team2.emoji}</span>
							<span class="teamLabel">{team2.name}</span>
						</div>
						<div class="teamScore" id="usTotalScore" title="&#x1F405; Puntaje Total" aria-live="polite">
							{usTotalScore}
						</div>
						<span class="tapToScoreHint">+ Tocar para sumar</span>
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
								<th>{team1.emoji} {team1.name}</th>
								<th>{team2.emoji} {team2.name}</th>
								<th>Acción</th>
							</tr>
						</thead>
						<tbody>
							{hands.length === 0 ? (
								<tr class="emptyHandsRow">
									<td colSpan={3}>
										<div class="emptyState">
											<span>🀄</span>
											<p>No hay manos jugadas aún.<br />Toca un equipo para sumar puntos.</p>
										</div>
									</td>
								</tr>
							) : (
								hands.map((hand, idx) => (
									<Hand
										key={hand._id}
										hand={hand}
										index={idx}
										onRemove={() => removeHand(hand)}
									/>
								))
							)}
						</tbody>
					</table>
				</div>
			</section>

			{/* Bottom Action Area */}
			<div class="inputSection">
				<div class="primaryTouchActions">
					<button
						type="button"
						class="touchScoreBtn themTouchBtn"
						onClick={() => openDrawer('them')}
					>
						<span class="btnEmoji">{team1.emoji}</span> + {team1.name}
					</button>
					<button
						type="button"
						class="touchScoreBtn usTouchBtn"
						onClick={() => openDrawer('us')}
					>
						<span class="btnEmoji">{team2.emoji}</span> + {team2.name}
					</button>
				</div>

				<div class="inputContainer manualInputContainer">
					<div class="inputWrapper">
						<label htmlFor="themHandScore" class="inputLabel">{team1.emoji} {team1.name}</label>
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
						<label htmlFor="usHandScore" class="inputLabel">{team2.emoji} {team2.name}</label>
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

			{/* Touch Score Numpad Drawer */}
			<ScoreInputDrawer
				isOpen={drawerState.isOpen}
				team={drawerState.team}
				teamName={drawerState.team === 'them' ? team1.name : team2.name}
				teamEmoji={drawerState.team === 'them' ? team1.emoji : team2.emoji}
				maxScore={MAX_HAND_SCORE}
				onClose={closeDrawer}
				onSubmit={handleDrawerScore}
			/>

			{/* Confirm New Game Reset Modal */}
			<ConfirmModal
				isOpen={isConfirmResetOpen}
				title="¿Reiniciar partida?"
				message="Se borrarán todos los puntos y manos registradas."
				confirmText="Reiniciar"
				cancelText="Cancelar"
				isDanger={true}
				onConfirm={handleConfirmReset}
				onCancel={() => setIsConfirmResetOpen(false)}
			/>

			{/* Settings Modal */}
			<SettingsModal
				isOpen={isSettingsOpen}
				currentWinScore={winScore}
				team1={team1}
				team2={team2}
				onClose={() => setIsSettingsOpen(false)}
				onSave={handleSaveSettings}
			/>

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
						{winner === 'them' ? team1.emoji : team2.emoji}
					</div>
					<h2 class="winnerText">¡{winner === 'them' ? team1.name : team2.name} Gana!</h2>
					<div class="winnerActions">
						<button onClick={dismissWinner}>Continuar</button>
						<button onClick={() => {
							dismissWinner();
							model.destroyAll();
						}}>Nuevo Juego</button>
					</div>
				</div>
			)}
		</div>
	);
}