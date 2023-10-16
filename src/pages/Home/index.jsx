import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import './style.css';

export function Home() {

	const [gameHands, setGameHands] = useState([])
	const [themTotalScore, setThemTotalScore] = useState(0)
	const [usTotalScore, setUsTotalScore] = useState(0)
	
	const addHand = useCallback((them, us) => {
		gameHands.push({them: parseInt(them), us: parseInt(us)})
		setGameHands(gameHands)
		setGameScore();
		document.getElementById("themHandScore")["value"] = ""
		document.getElementById("usHandScore")["value"] = ""
	}, [])

	function setGameScore() {
		let themScore = 0
		let usScore = 0
		gameHands.forEach(hand => { themScore += hand.them; usScore += hand.us })
		setThemTotalScore(themScore)
		setUsTotalScore(usScore)
	}

	function addHandButtonClick(e) {
		let themHandScore = getThemHandScore() ? getThemHandScore() : 0
		let usHandScore = getUsHandScore() ? getUsHandScore() : 0

		if(themHandScore > 0 || usHandScore > 0) {
			addHand(themHandScore, usHandScore)
		}
	}

	function newGameButtonClick(e) {
		gameHands.length = 0
		setThemTotalScore(0)
		setUsTotalScore(0)
	}

	function getThemHandScore() {
		return document.getElementById("themHandScore")["value"]
	}

	function getUsHandScore() {
		return document.getElementById("usHandScore")["value"]
	}

	return (
		<div class="home">
			<section>
				<table class="gameHands">
					<thead>
						<tr>
							<th>Them</th>
							<th>Us</th>
							<th>
								<button
									type="submit"
									id="newGameButton"
									class="newGameButton"
									onClick={newGameButtonClick}
									title="New Game">
										&#8635;
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{gameHands.map(hand => (
						<tr class="handRow">
							<td>{hand.them}</td>
							<td>{hand.us}</td>
							<td></td>
						</tr>
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
									title="Them Hand Score" />
							</td>
							<td>
								<input
									type="number"
									id="usHandScore"
									name="usHandScore"
									placeholder="0"
									min="0"
									max="168"
									title="Us Hand Score" />
							</td>
							<td>
								<button
									type="submit"
									id="addHandButton"
									class="addHandButton"
									onClick={addHandButtonClick}
									title="Add Hand">
										+
								</button>
							</td>
						</tr>
					</tbody>
					<tfoot>
					<tr>
						<th id="themTotalScore" title="Them Total Score">{themTotalScore}</th>
						<th id="usTotalScore" title="Us Total Score">{usTotalScore}</th>
						<th></th>
					</tr>
					</tfoot>
				</table>
			</section>
		</div>
	);
}
