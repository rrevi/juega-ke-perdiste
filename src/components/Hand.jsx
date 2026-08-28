import { h } from "preact";

export default function Hand({ hand, index, onRemove }) {
	const themWon = hand.themScore > 0;
	const usWon = hand.usScore > 0;

	return (
		<tr class="handRow">
			<td class={`handCell ${themWon ? 'scoringHand' : ''}`}>
				{index !== undefined && <span class="roundBadge">#{index + 1}</span>}
				<span class="handScoreValue">{hand.themScore}</span>
			</td>
			<td class={`handCell ${usWon ? 'scoringHand' : ''}`}>
				<span class="handScoreValue">{hand.usScore}</span>
			</td>
			<td>
				<button
					type="button"
					class="removeHandButton"
					onClick={onRemove}
					title="Eliminar Mano"
					aria-label={`Eliminar mano: 🦅 ${hand.themScore}, 🐅 ${hand.usScore}`}>
					-
				</button>
			</td>
		</tr>
	);
}
