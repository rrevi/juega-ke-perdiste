import { h, Component } from 'preact';
import HandModel from '../../models/HandModel'
import Hand from '../../components/Hand'
import './style.css';

export default class Home extends Component {

	constructor() {
		super();
		this.model = new HandModel('jkp-hands', () => this.setState({}));
	};
	
	addHand = (them, us) => {
		this.model.add(parseInt(them), parseInt(us));

		document.getElementById("themHandScore")["value"] = "";
		document.getElementById("usHandScore")["value"] = "";
	};

	removeHand = (hand) => {
		this.model.destroy(hand);
	}

	addHandButtonClick = () => {
		let themHandScore = this.getThemHandScore() ? this.getThemHandScore() : 0;
		let usHandScore = this.getUsHandScore() ? this.getUsHandScore() : 0;

		if(themHandScore > 0 || usHandScore > 0) {
			this.addHand(themHandScore, usHandScore);
		}
	}

	newGameButtonClick = () => {
		this.model.destroyAll();
	}

	getThemHandScore = () => {
		return document.getElementById("themHandScore")["value"];
	}

	getUsHandScore = () => {
		return document.getElementById("usHandScore")["value"];
	}

	render(props, state) {
		let { hands}  = this.model;
		let [themTotalScore, usTotalScore] = this.model.totalScores();
		return (
			<div class="home">
				<section>
					<table class="gameHands">
						<thead>
							<tr>
								<th class="teamEmoji">&#x1F985;</th>
								<th class="teamEmoji">&#x1F405;</th>
								<th>
									<button
										type="submit"
										id="newGameButton"
										class="newGameButton"
										onClick={this.newGameButtonClick}
										title="New Game">
											&#8635;
									</button>
								</th>
							</tr>
						</thead>
						<tbody>
							{hands.map( hand => (
								<Hand
									hand={hand}
									onRemove={() => this.removeHand(hand)}
								/>
							))}
							<tr>
								<td>
									<input
										id="themHandScore"
										name="themHandScore"
										placeholder="0"
										type="number"
										inputmode="numeric"
										pattern="[0-9]*"
										min="0"
										max="168"
										title="&#x1F985; Hand Score" />
								</td>
								<td>
									<input
										id="usHandScore"
										name="usHandScore"
										placeholder="0"
										type="number"
										inputmode="numeric"
										pattern="[0-9]*"
										min="0"
										max="168"
										title="&#x1F405; Hand Score" />
								</td>
								<td>
									<button
										type="submit"
										id="addHandButton"
										class="addHandButton"
										onClick={this.addHandButtonClick}
										title="Add Hand">
											+
									</button>
								</td>
							</tr>
						</tbody>
						<tfoot>
						<tr>
							<th id="themTotalScore" title="&#x1F985; Total Score">{themTotalScore}</th>
							<th id="usTotalScore" title="&#x1F405; Total Score">{usTotalScore}</th>
							<th></th>
						</tr>
						</tfoot>
					</table>
				</section>
			</div>
		);
	}
}
