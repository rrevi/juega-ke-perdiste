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
					title="Eliminar Mano"
					aria-label={`Eliminar mano: 🦅 ${hand.themScore}, 🐅 ${hand.usScore}`}>
					-
				</button>
			</td>
		</tr>
	);
}
