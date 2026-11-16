import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { getWinningTitle } from '../utils/dominoText';
import { triggerHaptic } from '../utils/hardware';

const CONFETTI_COUNT = 20;
const CONFETTI_COLORS = ['#18181b', '#ffffff', '#b8860b', '#dc2626', '#e5a93c', '#5a5a64'];

function generateConfetti() {
	const pieces = [];
	for (let i = 0; i < CONFETTI_COUNT; i++) {
		pieces.push({
			left: Math.random() * 100,
			delay: Math.random() * 3,
			duration: 2 + Math.random() * 3,
			color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
			size: 6 + Math.random() * 8
		});
	}
	return pieces;
}

/**
 * Full-screen celebration overlay displaying final domino match stats and share actions.
 * @param {{
 *   winner: 'them' | 'us' | null,
 *   team1: { name: string, emoji: string },
 *   team2: { name: string, emoji: string },
 *   themTotalScore: number,
 *   usTotalScore: number,
 *   matchStats: { totalRounds: number, maxHand: number },
 *   copiedToast: boolean,
 *   onShare: () => void,
 *   onDismiss: () => void,
 *   onNewGame: () => void
 * }} props
 */
export default function WinnerModal({
	winner,
	team1,
	team2,
	themTotalScore,
	usTotalScore,
	matchStats,
	copiedToast,
	onShare,
	onDismiss,
	onNewGame
}) {
	const [confetti, setConfetti] = useState(/** @type {ReturnType<typeof generateConfetti>} */ ([]));
	const modalRef = useRef(/** @type {HTMLDivElement | null} */ (null));

	useEffect(() => {
		if (winner) {
			triggerHaptic('win');
			setConfetti(generateConfetti());
			modalRef.current?.focus();
		}
	}, [winner]);

	/** @param {KeyboardEvent} e */
	const handleKeyDown = useCallback((e) => {
		if (e.key === 'Escape') {
			onDismiss();
			return;
		}
		if (e.key === 'Tab') {
			const focusable = modalRef.current?.querySelectorAll('button');
			if (focusable && focusable.length > 0) {
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (e.shiftKey) {
					if (document.activeElement === first) {
						e.preventDefault();
						last.focus();
					}
				} else if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		}
	}, [onDismiss]);

	if (!winner) return null;

	const winningTeam = winner === 'them' ? team1 : team2;

	return (
		<div
			class="winnerBanner"
			role="dialog"
			aria-label="Anuncio de ganador"
			aria-modal="true"
			tabIndex={-1}
			ref={modalRef}
			onKeyDown={handleKeyDown}
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
			<div class="winnerEmoji">{winningTeam.emoji}</div>
			<h2 class="winnerText">{getWinningTitle(winningTeam)}</h2>

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
				<button type="button" class="winnerShareBtn" onClick={onShare}>
					{copiedToast ? '✓ Copiado' : '📤 Compartir'}
				</button>
				<button type="button" onClick={onDismiss}>Continuar</button>
				<button type="button" class="winnerNewGameBtn" onClick={onNewGame}>Nuevo juego</button>
			</div>
		</div>
	);
}
