import { h, Component } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import Hand from '../../components/Hand'
import './style.css';

export default class Home extends Component {

	constructor() {
		super();
		this.state = { gameHands: [] };
	};
	
	addHand = (them, us) => {
		let { gameHands } = this.state;
		gameHands.push({them: parseInt(them), us: parseInt(us)});
		this.setState({ gameHands });
		document.getElementById("themHandScore")["value"] = ""
		document.getElementById("usHandScore")["value"] = ""
	};

	removeHand = (index) => {
		let { gameHands } = this.state;
		gameHands.splice(index, 1);
		this.setState({ gameHands });
	}

	addHandButtonClick = () => {
		let themHandScore = this.getThemHandScore() ? this.getThemHandScore() : 0
		let usHandScore = this.getUsHandScore() ? this.getUsHandScore() : 0

		if(themHandScore > 0 || usHandScore > 0) {
			this.addHand(themHandScore, usHandScore)
		}
	}

	newGameButtonClick = () => {
		let { gameHands } = this.state;
		gameHands.length = 0
		this.setState({ gameHands });

		// setThemTotalScore(0)
		// setUsTotalScore(0)
	}

	getThemHandScore = () => {
		return document.getElementById("themHandScore")["value"]
	}

	getUsHandScore = () => {
		return document.getElementById("usHandScore")["value"]
	}

	render(props, state) {
		let themTotalScore = 0
		let usTotalScore = 0
		let { gameHands } = state
		gameHands.forEach(hand => { themTotalScore += hand.them; usTotalScore += hand.us })
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
							{state.gameHands.map((hand, index) => (
								<Hand
									hand={hand}
									onRemove={() => this.removeHand(index)}
								/>
							))}
							<tr>
								<td>
									<input
										type="number"
										id="themHandScore"
										name="themHandScore"
										placeholder="0"
										min="0"
										max="168"
										title="&#x1F985; Hand Score" />
								</td>
								<td>
									<input
										type="number"
										id="usHandScore"
										name="usHandScore"
										placeholder="0"
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
