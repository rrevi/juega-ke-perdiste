import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import Hand from '../../components/Hand';
import ScoreInputDrawer from '../../components/ScoreInputDrawer';
import ConfirmModal from '../../components/ConfirmModal';
import SettingsModal from '../../components/SettingsModal';
import WinnerModal from '../../components/WinnerModal';
import { useMatchState } from '../../hooks/useMatchState';
import { triggerHaptic } from '../../utils/hardware';
import './style.css';

const MAX_HAND_SCORE = 168;

export default function Home() {
	const {
		hands,
		winScore,
		team1,
		team2,
		winner,
		wakeLockAvailable,
		wakeLockActive,
		undoState,
		copiedToast,
		themTotalScore,
		usTotalScore,
		matchStats,
		addHand,
		removeHand,
		undoDeleteHand,
		resetMatch,
		saveSettings,
		handleToggleWakeLock,
		dismissWinner,
		shareScorecard
	} = useMatchState();

	const [drawerState, setDrawerState] = useState({ isOpen: false, team: 'them' });
	const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const drawerTriggerRef = useRef(/** @type {HTMLElement | null} */ (null));
	const settingsTriggerRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
	const resetTriggerRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
	const handsBodyRef = useRef(/** @type {HTMLDivElement | null} */ (null));
	const prevHandsLengthRef = useRef(hands.value.length);

	const handsList = hands.value;
	useEffect(() => {
		if (handsList.length > prevHandsLengthRef.current && handsBodyRef.current) {
			if (typeof handsBodyRef.current.scrollTo === 'function') {
				handsBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
			} else {
				handsBodyRef.current.scrollTop = 0;
			}
		}
		prevHandsLengthRef.current = handsList.length;
	}, [handsList.length]);

	const openDrawer = useCallback((team, triggerEl) => {
		triggerHaptic('tap');
		drawerTriggerRef.current = triggerEl || (typeof document !== 'undefined' ? /** @type {HTMLElement | null} */ (document.activeElement) : null);
		setDrawerState({ isOpen: true, team });
	}, []);

	const closeDrawer = useCallback(() => {
		setDrawerState(prev => ({ ...prev, isOpen: false }));
	}, []);

	const handleDrawerScore = useCallback((score) => {
		addHand(drawerState.team, score);
	}, [addHand, drawerState.team]);

	const newGameButtonClick = useCallback(() => {
		triggerHaptic('tap');
		if (hands.value.length > 0) {
			setIsConfirmResetOpen(true);
		} else {
			resetMatch();
		}
	}, [hands, resetMatch]);

	const handleConfirmReset = useCallback(() => {
		resetMatch();
		setIsConfirmResetOpen(false);
	}, [resetMatch]);

	return (
		<div class="home">
			{/* Top App Controls (outside score keeping board) */}
			<div class="topControlsBar">
				<button
					type="button"
					id="settingsButton"
					ref={settingsTriggerRef}
					class="appControlBtn settingsTriggerBtn"
					onClick={() => {
						triggerHaptic('tap');
						setIsSettingsOpen(true);
					}}
					title={`Ajustes (Meta: ${winScore.value})`}
					aria-label={`Ajustes (Meta: ${winScore.value})`}
				>
					<span class="utilIcon" aria-hidden="true">⚙️</span>
				</button>

				{wakeLockAvailable.value && (
					<button
						type="button"
						id="wakeLockButton"
						class={`appControlBtn wakeLockBtn ${wakeLockActive.value ? 'isAwake' : ''}`}
						onClick={handleToggleWakeLock}
						title={wakeLockActive.value ? 'Pantalla activa (no se suspenderá)' : 'Pantalla normal'}
						aria-label={wakeLockActive.value ? 'Pantalla activa' : 'Pantalla normal'}
					>
						<span class="utilIcon" aria-hidden="true">{wakeLockActive.value ? '☀️' : '🌙'}</span>
					</button>
				)}

				<button
					type="button"
					id="newGameButton"
					ref={resetTriggerRef}
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
					<div class={`teamTotalDisplay themTotalDisplay ${themTotalScore.value > usTotalScore.value && themTotalScore.value > 0 ? 'isLeading' : ''}`}>
						<div class="teamHeader">
							<span class="teamEmoji" role="img" aria-label={team1.value.name}>{team1.value.emoji}</span>
							<span class="teamLabel">{team1.value.name}</span>
						</div>
						<div class="teamScore" id="themTotalScore" title="&#x1F985; Puntaje Total" aria-live="polite">
							{themTotalScore.value}
						</div>
					</div>

					<div class="scoreboardCenter">
						<div class="scoreDivider">VS</div>
					</div>

					<div class={`teamTotalDisplay usTotalDisplay ${usTotalScore.value > themTotalScore.value && usTotalScore.value > 0 ? 'isLeading' : ''}`}>
						<div class="teamHeader">
							<span class="teamEmoji" role="img" aria-label={team2.value.name}>{team2.value.emoji}</span>
							<span class="teamLabel">{team2.value.name}</span>
						</div>
						<div class="teamScore" id="usTotalScore" title="&#x1F405; Puntaje Total" aria-live="polite">
							{usTotalScore.value}
						</div>
					</div>
				</div>

				{/* Continuous Hands History List */}
				<div class="scorecardHandsBody" ref={handsBodyRef}>
					<table class="gameHands">
						<caption class="sr-only">Tabla de puntaje de dominó</caption>
						<tbody>
							{handsList.length === 0 ? (
								<tr class="emptyHandsRow">
									<td colSpan={4}>
										<div class="emptyState">
											<p>Suma puntos con los botones de abajo.</p>
										</div>
									</td>
								</tr>
							) : (
								handsList
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
			{undoState.value && (
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
						onClick={(event) => openDrawer('them', event.currentTarget)}
					>
						<span class="btnEmoji">{team1.value.emoji}</span> + {team1.value.name}
					</button>
					<button
						type="button"
						id="usAddScoreBtn"
						class="touchScoreBtn usTouchBtn"
						onClick={(event) => openDrawer('us', event.currentTarget)}
					>
						<span class="btnEmoji">{team2.value.emoji}</span> + {team2.value.name}
					</button>
				</div>
			</footer>

			{/* Touch Score Numpad Drawer */}
			<ScoreInputDrawer
				isOpen={drawerState.isOpen}
				teamName={drawerState.team === 'them' ? team1.value.name : team2.value.name}
				teamEmoji={drawerState.team === 'them' ? team1.value.emoji : team2.value.emoji}
				maxScore={MAX_HAND_SCORE}
				returnFocusRef={drawerTriggerRef}
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
				returnFocusRef={resetTriggerRef}
				onConfirm={handleConfirmReset}
				onCancel={() => setIsConfirmResetOpen(false)}
			/>

			{/* Settings Modal */}
			<SettingsModal
				isOpen={isSettingsOpen}
				currentWinScore={winScore.value}
				team1={team1.value}
				team2={team2.value}
				returnFocusRef={settingsTriggerRef}
				onClose={() => setIsSettingsOpen(false)}
				onSave={saveSettings}
			/>

			<WinnerModal
				winner={winner.value}
				team1={team1.value}
				team2={team2.value}
				themTotalScore={themTotalScore.value}
				usTotalScore={usTotalScore.value}
				matchStats={matchStats.value}
				copiedToast={copiedToast.value}
				onShare={shareScorecard}
				onDismiss={dismissWinner}
				onNewGame={resetMatch}
			/>
		</div>
	);
}
