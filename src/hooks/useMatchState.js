import { useLayoutEffect, useRef, useCallback } from 'preact/hooks';
import { useSignal, useComputed, useSignalEffect, batch } from '@preact/signals';
import HandModel from '../models/HandModel';
import { getShareWinningSentence } from '../utils/dominoText';
import {
	requestWakeLock,
	releaseWakeLock,
	toggleWakeLock,
	isWakeLockActive,
	isWakeLockSupported,
	onWakeLockChange,
	triggerHaptic
} from '../utils/hardware';

const DEFAULT_WIN_SCORE = 200;
const DEFAULT_TEAM_1 = { name: 'Ellos', emoji: '🦅' };
const DEFAULT_TEAM_2 = { name: 'Nosotros', emoji: '🐅' };

/**
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
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

function loadStoredWinScore() {
	try {
		const raw = localStorage.getItem('jkp-win-score');
		const parsed = raw ? parseInt(raw, 10) : NaN;
		return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_WIN_SCORE;
	} catch {
		return DEFAULT_WIN_SCORE;
	}
}

/**
 * Reactive domino match state powered by Preact Signals and HandModel persistence.
 */
export function useMatchState() {
	const modelRef = useRef(/** @type {HandModel | null} */ (null));

	// The prerender and first client render share these defaults.
	const hands = useSignal(/** @type {HandModel['hands']} */ ([]));
	const winScore = useSignal(DEFAULT_WIN_SCORE);
	const team1 = useSignal(DEFAULT_TEAM_1);
	const team2 = useSignal(DEFAULT_TEAM_2);
	const winner = useSignal(/** @type {'them' | 'us' | null} */ (null));
	const wakeLockAvailable = useSignal(false);
	const wakeLockActive = useSignal(false);
	const undoState = useSignal(/** @type {{ hand: any, index: number } | null} */ (null));
	const copiedToast = useSignal(false);

	const undoTimeoutRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null));
	const copiedToastTimeoutRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null));

	const themTotalScore = useComputed(() =>
		hands.value.reduce((total, hand) => total + hand.themScore, 0)
	);
	const usTotalScore = useComputed(() =>
		hands.value.reduce((total, hand) => total + hand.usScore, 0)
	);
	const matchStats = useComputed(() => {
		const list = hands.value;
		const totalRounds = list.length;
		const maxHand = totalRounds > 0 ? Math.max(...list.map(h => Math.max(h.themScore, h.usScore))) : 0;
		return { totalRounds, maxHand };
	});

	const clearUndo = useCallback(() => {
		if (undoTimeoutRef.current) {
			clearTimeout(undoTimeoutRef.current);
			undoTimeoutRef.current = null;
		}
		undoState.value = null;
	}, [undoState]);

	const resetMatch = useCallback(() => {
		batch(() => {
			clearUndo();
			if (copiedToastTimeoutRef.current) {
				clearTimeout(copiedToastTimeoutRef.current);
				copiedToastTimeoutRef.current = null;
			}
			copiedToast.value = false;
			winner.value = null;
		});
		modelRef.current.destroyAll();
	}, [clearUndo, copiedToast, winner]);

	useLayoutEffect(() => {
		const model = new HandModel('jkp-hands');
		modelRef.current = model;
		batch(() => {
			hands.value = [...model.hands];
			winScore.value = loadStoredWinScore();
			team1.value = loadStoredTeam('jkp-team1', DEFAULT_TEAM_1);
			team2.value = loadStoredTeam('jkp-team2', DEFAULT_TEAM_2);
			wakeLockAvailable.value = isWakeLockSupported();
			wakeLockActive.value = isWakeLockActive();
		});

		const unsubscribeWakeLock = onWakeLockChange((active) => {
			wakeLockActive.value = active;
		});
		requestWakeLock();
		const unsubscribeModel = model.subscribe(() => {
			hands.value = [...model.hands];
		});

		return () => {
			unsubscribeWakeLock();
			unsubscribeModel();
			model.dispose();
			releaseWakeLock();
			if (undoTimeoutRef.current) {
				clearTimeout(undoTimeoutRef.current);
			}
			if (copiedToastTimeoutRef.current) {
				clearTimeout(copiedToastTimeoutRef.current);
			}
		};
	}, [hands, winScore, team1, team2, wakeLockAvailable, wakeLockActive]);

	useSignalEffect(() => {
		const target = winScore.value;
		const them = themTotalScore.value;
		const us = usTotalScore.value;

		if (them >= target) {
			if (winner.peek() === null) winner.value = 'them';
		} else if (us >= target) {
			if (winner.peek() === null) winner.value = 'us';
		} else {
			winner.value = null;
		}
	});

	const addHand = useCallback((team, score) => {
		if (team === 'them') {
			modelRef.current.add(score, 0);
		} else {
			modelRef.current.add(0, score);
		}
	}, []);

	const removeHand = useCallback((hand, index) => {
		triggerHaptic('remove');
		if (undoTimeoutRef.current) {
			clearTimeout(undoTimeoutRef.current);
		}
		modelRef.current.destroy(hand);
		undoState.value = { hand, index };

		undoTimeoutRef.current = setTimeout(() => {
			undoState.value = null;
			undoTimeoutRef.current = null;
		}, 5000);
	}, [undoState]);

	const undoDeleteHand = useCallback(() => {
		const pending = undoState.value;
		if (!pending) return;
		triggerHaptic('success');
		clearUndo();
		const model = modelRef.current;
		const restored = [...model.hands];
		const targetIndex = typeof pending.index === 'number'
			? Math.min(pending.index, restored.length)
			: restored.length;
		restored.splice(targetIndex, 0, pending.hand);
		model.hands = restored;
		model.persist();
		model.inform();
	}, [undoState, clearUndo]);

	const saveSettings = useCallback((newSettings) => {
		batch(() => {
			winScore.value = newSettings.winScore;
			team1.value = newSettings.team1;
			team2.value = newSettings.team2;
		});
		try {
			localStorage.setItem('jkp-win-score', String(newSettings.winScore));
			localStorage.setItem('jkp-team1', JSON.stringify(newSettings.team1));
			localStorage.setItem('jkp-team2', JSON.stringify(newSettings.team2));
		} catch {
			// ignore storage errors
		}
	}, [winScore, team1, team2]);

	const handleToggleWakeLock = useCallback(async () => {
		triggerHaptic('tap');
		await toggleWakeLock();
	}, []);

	const dismissWinner = useCallback(() => {
		winner.value = null;
	}, [winner]);

	const shareScorecard = useCallback(() => {
		triggerHaptic('tap');
		const currentWinner = winner.value;
		const winnerTeam = currentWinner === 'them' ? team1.value : team2.value;
		const winnerScore = currentWinner === 'them' ? themTotalScore.value : usTotalScore.value;
		const loserScore = currentWinner === 'them' ? usTotalScore.value : themTotalScore.value;
		const stats = matchStats.value;
		const target = winScore.value;

		const winnerSentence = getShareWinningSentence(winnerTeam, winnerScore, loserScore);
		const shareText = `${winnerSentence}\n\n` +
			`📊 Manos: ${stats.totalRounds}\n` +
			`🔥 Mano más alta: ${stats.maxHand} pts\n` +
			`🎯 Meta: ${target} pts\n\n` +
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
				copiedToast.value = true;
				copiedToastTimeoutRef.current = setTimeout(() => {
					copiedToast.value = false;
					copiedToastTimeoutRef.current = null;
				}, 2500);
			}).catch(() => {});
		}
	}, [winner, team1, team2, themTotalScore, usTotalScore, matchStats, winScore, copiedToast]);

	return {
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
	};
}
