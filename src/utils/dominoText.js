/**
 * Formats a team name with the natural Spanish past-tense verb for winning.
 * @param {{ name: string, emoji: string }} team
 */
export function formatWinningAction(team) {
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

/**
 * @param {{ name: string, emoji: string }} team
 */
export function getWinningTitle(team) {
	return `¡${formatWinningAction(team)}!`;
}

/**
 * @param {{ name: string, emoji: string }} team
 * @param {number} winnerScore
 * @param {number} loserScore
 */
export function getShareWinningSentence(team, winnerScore, loserScore) {
	return `🏆 ¡${team.emoji} ${formatWinningAction(team)}! (${winnerScore} a ${loserScore} pts)`;
}
