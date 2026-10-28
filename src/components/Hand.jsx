import { h } from "preact";

export default function Hand({ hand, index, onRemove }) {
	const themWon = hand.themScore > 0;
	const usWon = hand.usScore > 0;

	return (
		<tr class="handRow">
			<td class="roundNumberCell">
				<span class="roundBadge">#{index !== undefined ? index + 1 : 1}</span>
			</td>
			<td class={`handCell ${themWon ? 'scoringHand' : 'zeroHand'}`}>
				<span class="handScoreValue" aria-label={`${hand.themScore} puntos`}>
					{themWon ? hand.themScore : '—'}
				</span>
			</td>
			<td class={`handCell ${usWon ? 'scoringHand' : 'zeroHand'}`}>
				<span class="handScoreValue" aria-label={`${hand.usScore} puntos`}>
					{usWon ? hand.usScore : '—'}
				</span>
			</td>
			<td class="actionCell">
				<button
					type="button"
					class="removeHandButton"
					onClick={onRemove}
					title="Eliminar Mano"
					aria-label={`Eliminar mano #${(index !== undefined ? index + 1 : 1)}: ${hand.themScore} a ${hand.usScore}`}>
					-
				</button>
			</td>
		</tr>
	);
}
