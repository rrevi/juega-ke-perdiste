import { h } from "preact";

export default function Hand({ hand, onRemove }) {
	return (
		<tr class="handRow">
			<td>{hand.themScore}</td>
			<td>{hand.usScore}</td>
			<td>
				<button
					type="button"
					class="removeHandButton"
					onClick={onRemove}
					title="Remove Hand"
					aria-label="Remove Hand">
					-
				</button>
			</td>
		</tr>
	);
}
