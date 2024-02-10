import { uuid, store } from './util';

export default class HandModel {
  constructor(key, sub) {
    this.key = key;
    this.hands = store(key) || [];
    this.onChanges = [sub];
  }

  inform() {
    store(this.key, this.hands);
    this.onChanges.forEach( cb => cb() );
  }

  add(themScore, usScore) {
    this.hands = this.hands.concat({
      id: uuid(),
      themScore,
      usScore
    });
    this.inform();
  }

  destroy(hand) {
    this.hands = this.hands.filter( h => h !== hand );
    this.inform();
  }

  destroyAll() {
    this.hands = this.hands.filter( h => false );
    this.inform();
  }

  totalScores() {
    let themTotalScore = 0;
		let usTotalScore = 0;
    this.hands.forEach(hand => { themTotalScore += hand.themScore; usTotalScore += hand.usScore });
    return [themTotalScore, usTotalScore];
  }
}