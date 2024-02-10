import { h, Component } from "preact";

export default class Hand extends Component {

	render(props) {
    return (
      <tr class="handRow">
        <td>{props.hand.themScore}</td>
        <td>{props.hand.usScore}</td>
        <td>
          <button
            type="submit"
            id="removeHandButton"
            class="removeHandButton"
            onClick={props.onRemove}
            title="Add Hand">
              -
          </button>
        </td>
      </tr>
    );
  }
}
