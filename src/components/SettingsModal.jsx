import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { triggerHaptic } from '../utils/hardware';
import './SettingsModal.css';

const WIN_SCORE_OPTIONS = [100, 150, 200, 250, 500];
const EMOJI_OPTIONS_TEAM1 = ['🦅', '🦁', '🐺', '🦈', '⚡', '👑'];
const EMOJI_OPTIONS_TEAM2 = ['🐅', '🐉', '🐻', '🐂', '🔥', '🏆'];

export default function SettingsModal({
	isOpen,
	currentWinScore = 200,
	team1 = { name: 'Ellos', emoji: '🦅' },
	team2 = { name: 'Nosotros', emoji: '🐅' },
	onClose,
	onSave
}) {
	const [winScore, setWinScore] = useState(currentWinScore);
	const [team1Name, setTeam1Name] = useState(team1.name);
	const [team1Emoji, setTeam1Emoji] = useState(team1.emoji);
	const [team2Name, setTeam2Name] = useState(team2.name);
	const [team2Emoji, setTeam2Emoji] = useState(team2.emoji);

	useEffect(() => {
		if (isOpen) {
			setWinScore(currentWinScore);
			setTeam1Name(team1.name);
			setTeam1Emoji(team1.emoji);
			setTeam2Name(team2.name);
			setTeam2Emoji(team2.emoji);
		}
	}, [isOpen, currentWinScore, team1, team2]);

	if (!isOpen) return null;

	const handleSave = () => {
		triggerHaptic('success');
		onSave({
			winScore,
			team1: { name: team1Name.trim() || 'Ellos', emoji: team1Emoji },
			team2: { name: team2Name.trim() || 'Nosotros', emoji: team2Emoji }
		});
		onClose();
	};

	return (
		<div class="settingsBackdrop" onClick={onClose} role="dialog" aria-modal="true">
			<div class="settingsContainer" onClick={(e) => e.stopPropagation()}>
				<div class="settingsHeader">
					<h3 class="settingsTitle">⚙️ Ajustes del Juego</h3>
					<button type="button" class="settingsCloseBtn" onClick={onClose} aria-label="Cerrar">
						✕
					</button>
				</div>

				<div class="settingsBody">
					{/* Win Target Score */}
					<div class="settingsGroup">
						<label class="settingsGroupTitle">Puntaje para ganar:</label>
						<div class="scoreOptionsGrid">
							{WIN_SCORE_OPTIONS.map((score) => (
								<button
									key={score}
									type="button"
									class={`scoreOptionChip ${winScore === score ? 'isSelected' : ''}`}
									onClick={() => {
										triggerHaptic('tap');
										setWinScore(score);
									}}
								>
									{score} pts
								</button>
							))}
						</div>
					</div>

					{/* Team 1 Config */}
					<div class="settingsGroup">
						<label class="settingsGroupTitle">Equipo 1:</label>
						<div class="teamEditRow">
							<input
								type="text"
								class="teamNameInput"
								value={team1Name}
								onChange={(e) => setTeam1Name(e.target.value)}
								placeholder="Nombre Equipo 1"
								maxLength={20}
							/>
							<div class="emojiSelector">
								{EMOJI_OPTIONS_TEAM1.map((em) => (
									<button
										key={em}
										type="button"
										class={`emojiChip ${team1Emoji === em ? 'isSelected' : ''}`}
										onClick={() => {
											triggerHaptic('tap');
											setTeam1Emoji(em);
										}}
									>
										{em}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Team 2 Config */}
					<div class="settingsGroup">
						<label class="settingsGroupTitle">Equipo 2:</label>
						<div class="teamEditRow">
							<input
								type="text"
								class="teamNameInput"
								value={team2Name}
								onChange={(e) => setTeam2Name(e.target.value)}
								placeholder="Nombre Equipo 2"
								maxLength={20}
							/>
							<div class="emojiSelector">
								{EMOJI_OPTIONS_TEAM2.map((em) => (
									<button
										key={em}
										type="button"
										class={`emojiChip ${team2Emoji === em ? 'isSelected' : ''}`}
										onClick={() => {
											triggerHaptic('tap');
											setTeam2Emoji(em);
										}}
									>
										{em}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				<div class="settingsActions">
					<button type="button" class="settingsSaveBtn" onClick={handleSave}>
						Guardar Cambios
					</button>
				</div>
			</div>
		</div>
	);
}
