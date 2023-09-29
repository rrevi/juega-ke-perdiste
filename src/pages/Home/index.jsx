import { useCallback, useState } from 'preact/hooks';
import './style.css';

export function Home() {

	const [gameHands, setGameHands] = useState([])
	const [themScore, setThemScore] = useState(0)
	const [usScore, setUsScore] = useState(0)
	
	const addHand = useCallback((them, us) => {
		gameHands.push({them: parseInt(them), us: parseInt(us)})
		setGameHands(gameHands)
		setGameScore();
	}, [])

	function setGameScore() {
		let themScore = 0
		let usScore = 0
		gameHands.forEach(hand => { themScore += hand.them; usScore += hand.us })
		setThemScore(themScore)
		setUsScore(usScore)
	}

	function addHandButtonClick(e) {
		let themInputScore = document.getElementById("them").value
		let usInputScore = document.getElementById("us").value
		if(themInputScore > 0 || usInputScore > 0) {
			addHand(themInputScore, usInputScore)
		}
	}

	function newGameButtonClick(e) {
		setGameHands([])
		setThemScore(0)
		setUsScore(0)
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
								<button type="submit" class="newGameButton" onClick={newGameButtonClick}>New Game!</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{gameHands.map(hand => (
						<tr>
							<td>{hand.them}</td>
							<td>{hand.us}</td>
							<td></td>
						</tr>
						))}
						<tr>
							<td>
								<input type="number" id="them" name="them" value="0" min="0" max="168" />
							</td>
							<td>
								<input type="number" id="us" name="us" value="0" min="0" max="168" />
							</td>
							<td>
								<button type="submit" class="addHandButton" onClick={addHandButtonClick}>Add</button>
							</td>
						</tr>
					</tbody>
					<tfoot>
					<tr>
						<th>{themScore}</th>
						<th>{usScore}</th>
						<th></th>
					</tr>
					</tfoot>
				</table>
			</section>
		</div>
	);
}
