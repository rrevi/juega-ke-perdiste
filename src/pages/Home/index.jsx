import { h } from 'preact';
import { useState, useEffect, useMemo, useRef, useCallback } from 'preact/hooks';
import HandModel from '../../models/HandModel';
import Hand from '../../components/Hand';
import ScoreInputDrawer from '../../components/ScoreInputDrawer';
import ConfirmModal from '../../components/ConfirmModal';
import SettingsModal from '../../components/SettingsModal';
import {
	requestWakeLock,
	releaseWakeLock,
	toggleWakeLock,
	isWakeLockActive,
	onWakeLockChange,
	isWakeLockSupported,
	triggerHaptic
} from '../../utils/hardware';
import './style.css';

const WIN_SCORE = 200;
const MAX_HAND_SCORE = 168;
const CONFETTI_COUNT = 20;
const CONFETTI_COLORS = ['#18181b', '#ffffff', '#b8860b', '#dc2626', '#e5a93c', '#5a5a64'];

function formatWinningAction(team) {
	const name = team.name.trim();
	const lower = name.toLowerCase();
	let verb = 'ganó';
	if (lower === 'nosotros' || lower === 'nosotras') {
		verb = 'ganamos';
	} else if (lower === 'ellos' || lower === 'ellas' || lower.endsWith('s')) {
		verb = 'ganaron';
	}
	return `${name} ${verb}`;
}

function getWinningTitle(team) {
	return `¡${formatWinningAction(team)}!`;
}

function getShareWinningSentence(team, winnerScore, loserScore) {
	return `🏆 ¡${team.emoji} ${formatWinningAction(team)}! (${winnerScore} a ${loserScore} pts)`;
}

function loadStoredTeam(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		const parsed = raw ? JSON.parse(raw) : null;
		if (parsed && typeof parsed.name === 'string' && typeof parsed.emoji === 'string') {
			return parsed;
		}
	} catch {
		// ignore malformed storage
	}
	return fallback;
}

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
	const [winner, setWinner] = useState(null);
	const [confetti, setConfetti] = useState([]);
	const [drawerState, setDrawerState] = useState({ isOpen: false, team: 'them' });

	const [winScore, setWinScore] = useState(() => {
		try {
			const s = localStorage.getItem('jkp-win-score');
			const parsed = s ? parseInt(s, 10) : NaN;
			return Number.isFinite(parsed) && parsed > 0 ? parsed : WIN_SCORE;
		} catch {
			return WIN_SCORE;
		}
	});

	const [team1, setTeam1] = useState(() => loadStoredTeam('jkp-team1', { name: 'Ellos', emoji: '🦅' }));
	const [team2, setTeam2] = useState(() => loadStoredTeam('jkp-team2', { name: 'Nosotros', emoji: '🐅' }));

	const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [wakeLockActive, setWakeLockActive] = useState(() => isWakeLockActive());
	const [undoState, setUndoState] = useState(null);

	const winnerModalRef = useRef(null);
	const handsBodyRef = useRef(null);
	const prevHandsLengthRef = useRef(hands.length);
	const undoTimeoutRef = useRef(null);
	const copiedToastTimeoutRef = useRef(null);

	useEffect(() => {
		const unsubscribe = onWakeLockChange((active) => {
			setWakeLockActive(active);
		});
		return unsubscribe;
	}, []);

	useEffect(() => {
		if (hands.length > prevHandsLengthRef.current) {
			if (handsBodyRef.current) {
				if (typeof handsBodyRef.current.scrollTo === 'function') {
					handsBodyRef.current.scrollTo({
						top: 0,
						behavior: 'smooth'
					});
				} else {
					handsBodyRef.current.scrollTop = 0;
				}
			}
		}
		prevHandsLengthRef.current = hands.length;
	}, [hands.length]);

	const handleToggleWakeLock = useCallback(async () => {
		triggerHaptic('tap');
		await toggleWakeLock();
	}, []);

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

	const clearUndo = useCallback(() => {
		if (undoTimeoutRef.current) {
			clearTimeout(undoTimeoutRef.current);
			undoTimeoutRef.current = null;
		}
		setUndoState(null);
	}, []);

	const resetMatch = useCallback(() => {
		clearUndo();
		if (copiedToastTimeoutRef.current) {
			clearTimeout(copiedToastTimeoutRef.current);
			copiedToastTimeoutRef.current = null;
		}
		setCopiedToast(false);
		model.destroyAll();
		setWinner(null);
		setIsConfirmResetOpen(false);
	}, [clearUndo]);

	useEffect(() => {
		requestWakeLock();
		const unsubscribe = model.subscribe(() => {
			setHands([...model.hands]);
		});

		return () => {
			unsubscribe();
			model.dispose();
			releaseWakeLock();
			if (undoTimeoutRef.current) {
				clearTimeout(undoTimeoutRef.current);
			}
			if (copiedToastTimeoutRef.current) {
				clearTimeout(copiedToastTimeoutRef.current);
			}
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

	useEffect(() => {
		if (themTotalScore >= winScore) {
			setWinner(w => (w !== null ? w : 'them'));
		} else if (usTotalScore >= winScore) {
			setWinner(w => (w !== null ? w : 'us'));
		} else {
			setWinner(null);
		}
	}, [themTotalScore, usTotalScore, winScore]);

	const matchStats = useMemo(() => {
		const totalRounds = hands.length;
		const maxHand = totalRounds > 0 ? Math.max(...hands.map(h => Math.max(h.themScore, h.usScore))) : 0;
		return { totalRounds, maxHand };
	}, [hands]);

	const [copiedToast, setCopiedToast] = useState(false);

	const shareScorecard = useCallback(() => {
		triggerHaptic('tap');
		const winnerTeam = winner === 'them' ? team1 : team2;
		const winnerScore = winner === 'them' ? themTotalScore : usTotalScore;
		const loserScore = winner === 'them' ? usTotalScore : themTotalScore;

		const winnerSentence = getShareWinningSentence(winnerTeam, winnerScore, loserScore);

		const shareText = `${winnerSentence}\n\n` +
			`📊 Manos: ${matchStats.totalRounds}\n` +
			`🔥 Mano más alta: ${matchStats.maxHand} pts\n` +
			`🎯 Meta: ${winScore} pts\n\n` +
			`Juega ke perdiste!`;

		if (typeof navigator !== 'undefined' && navigator.share) {
			navigator.share({
				title: 'Resultado de Dominó - Juega ke perdiste!',
				text: shareText
			}).catch(() => {});
		} else if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText(shareText).then(() => {
				if (copiedToastTimeoutRef.current) {
					clearTimeout(copiedToastTimeoutRef.current);
				}
				setCopiedToast(true);
				copiedToastTimeoutRef.current = setTimeout(() => {
					setCopiedToast(false);
					copiedToastTimeoutRef.current = null;
				}, 2500);
			}).catch(() => {});
		}
	}, [winner, team1, team2, themTotalScore, usTotalScore, matchStats, winScore]);

	const removeHand = useCallback((hand, index) => {
		triggerHaptic('remove');
		if (undoTimeoutRef.current) {
			clearTimeout(undoTimeoutRef.current);
		}
		model.destroy(hand);
		setUndoState({ hand, index });

		undoTimeoutRef.current = setTimeout(() => {
			setUndoState(null);
			undoTimeoutRef.current = null;
		}, 5000);
	}, []);

	const undoDeleteHand = useCallback(() => {
		if (!undoState) return;
		triggerHaptic('success');
		const { hand, index } = undoState;
		clearUndo();
		const restored = [...model.hands];
		const targetIndex = typeof index === 'number' ? Math.min(index, restored.length) : restored.length;
		restored.splice(targetIndex, 0, hand);
		model.hands = restored;
		model.persist();
		model.inform();
	}, [undoState, clearUndo]);

	const newGameButtonClick = useCallback(() => {
		triggerHaptic('tap');
		if (hands.length > 0) {
			setIsConfirmResetOpen(true);
		} else {
			resetMatch();
		}
	}, [hands.length, resetMatch]);

	const dismissWinner = useCallback(() => {
		setWinner(null);
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

	return (
		<div class="home">
			{/* Top App Controls (outside score keeping board) */}
			<div class="topControlsBar">
				<button
					type="button"
					id="settingsButton"
					class="appControlBtn settingsTriggerBtn"
					onClick={() => {
						triggerHaptic('tap');
						setIsSettingsOpen(true);
					}}
					title={`Ajustes (Meta: ${winScore})`}
					aria-label={`Ajustes (Meta: ${winScore})`}
				>
					<span class="utilIcon" aria-hidden="true">⚙️</span>
				</button>

				{isWakeLockSupported() && (
					<button
						type="button"
						id="wakeLockButton"
						class={`appControlBtn wakeLockBtn ${wakeLockActive ? 'isAwake' : ''}`}
						onClick={handleToggleWakeLock}
						title={wakeLockActive ? 'Pantalla activa (no se suspenderá)' : 'Pantalla normal'}
						aria-label={wakeLockActive ? 'Pantalla activa' : 'Pantalla normal'}
					>
						<span class="utilIcon" aria-hidden="true">{wakeLockActive ? '☀️' : '🌙'}</span>
					</button>
				)}

				<button
					type="button"
					id="newGameButton"
					class="appControlBtn newGameButton"
					onClick={newGameButtonClick}
					title="Nuevo juego"
					aria-label="Nuevo juego"
				>
					<span class="utilIcon" aria-hidden="true">&#8635;</span>
				</button>
			</div>

			{/* Unified Scorecard Board */}
			<section class="scorecardBoard" aria-label="Tablero de anotaciones">
				{/* Total Scores Header */}
				<div class="scorecardTotalsHeader">
					<div class={`teamTotalDisplay themTotalDisplay ${themTotalScore > usTotalScore && themTotalScore > 0 ? 'isLeading' : ''}`}>
						<div class="teamHeader">
							<span class="teamEmoji" role="img" aria-label={team1.name}>{team1.emoji}</span>
							<span class="teamLabel">{team1.name}</span>
						</div>
						<div class="teamScore" id="themTotalScore" title="&#x1F985; Puntaje Total" aria-live="polite">
							{themTotalScore}
						</div>
					</div>

					<div class="scoreboardCenter">
						<div class="scoreDivider">VS</div>
					</div>

					<div class={`teamTotalDisplay usTotalDisplay ${usTotalScore > themTotalScore && usTotalScore > 0 ? 'isLeading' : ''}`}>
						<div class="teamHeader">
							<span class="teamEmoji" role="img" aria-label={team2.name}>{team2.emoji}</span>
							<span class="teamLabel">{team2.name}</span>
						</div>
						<div class="teamScore" id="usTotalScore" title="&#x1F405; Puntaje Total" aria-live="polite">
							{usTotalScore}
						</div>
					</div>
				</div>

				{/* Continuous Hands History List */}
				<div class="scorecardHandsBody" ref={handsBodyRef}>
					<table class="gameHands">
						<caption class="sr-only">Tabla de puntaje de dominó</caption>
						<tbody>
							{hands.length === 0 ? (
								<tr class="emptyHandsRow">
									<td colSpan={4}>
										<div class="emptyState">
											<p>Suma puntos con los botones de abajo.</p>
										</div>
									</td>
								</tr>
							) : (
								hands
									.map((hand, idx) => ({ hand, idx }))
									.reverse()
									.map(({ hand, idx }) => (
										<Hand
											key={hand._id}
											hand={hand}
											index={idx}
											onRemove={() => removeHand(hand, idx)}
										/>
									))
							)}
						</tbody>
					</table>
				</div>
			</section>

			{/* Floating Undo Snackbar */}
			{undoState && (
				<div class="undoSnackbar" role="status" aria-live="polite">
					<span class="undoText">Mano eliminada</span>
					<button type="button" class="undoActionBtn" onClick={undoDeleteHand}>
						Deshacer
					</button>
				</div>
			)}

			{/* Bottom Action Footer */}
			<footer class="inputSection">
				<div class="primaryTouchActions">
					<button
						type="button"
						id="themAddScoreBtn"
						class="touchScoreBtn themTouchBtn"
						onClick={() => openDrawer('them')}
					>
						<span class="btnEmoji">{team1.emoji}</span> + {team1.name}
					</button>
					<button
						type="button"
						id="usAddScoreBtn"
						class="touchScoreBtn usTouchBtn"
						onClick={() => openDrawer('us')}
					>
						<span class="btnEmoji">{team2.emoji}</span> + {team2.name}
					</button>
				</div>
			</footer>

			{/* Touch Score Numpad Drawer */}
			<ScoreInputDrawer
				isOpen={drawerState.isOpen}
				teamName={drawerState.team === 'them' ? team1.name : team2.name}
				teamEmoji={drawerState.team === 'them' ? team1.emoji : team2.emoji}
				maxScore={MAX_HAND_SCORE}
				onClose={closeDrawer}
				onSubmit={handleDrawerScore}
			/>

			{/* Confirm New Game Reset Modal */}
			<ConfirmModal
				isOpen={isConfirmResetOpen}
				title="¿Reiniciar juego?"
				message="Se borrarán todos los puntos."
				confirmText="Reiniciar"
				cancelText="Cancelar"
				isDanger={true}
				onConfirm={resetMatch}
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
					<h2 class="winnerText">{getWinningTitle(winner === 'them' ? team1 : team2)}</h2>

					{/* Match Stats Summary */}
					<div class="matchStatsCard">
						<div class="statItem">
							<span class="statLabel">Marcador final</span>
							<span class="statValue">{themTotalScore} - {usTotalScore}</span>
						</div>
						<div class="statItem">
							<span class="statLabel">Manos jugadas</span>
							<span class="statValue">{matchStats.totalRounds}</span>
						</div>
						<div class="statItem">
							<span class="statLabel">Mano más alta</span>
							<span class="statValue">+{matchStats.maxHand} pts</span>
						</div>
					</div>

					<div class="winnerActions">
						<button type="button" class="winnerShareBtn" onClick={shareScorecard}>
							{copiedToast ? '✓ Copiado' : '📤 Compartir'}
						</button>
						<button type="button" onClick={dismissWinner}>Continuar</button>
						<button type="button" class="winnerNewGameBtn" onClick={resetMatch}>Nuevo juego</button>
					</div>
				</div>
			)}
		</div>
	);
}