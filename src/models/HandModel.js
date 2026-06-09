import PouchDB from 'pouchdb';

export default class HandModel {
  constructor(dbName) {
    this.dbName = dbName;
    this.hands = [];
    this.onChanges = [];

    this.localDB = new PouchDB(this.dbName);
    this.changesFeed = this.localDB.changes({
      since: 'now',
      live: true
    }).on('change', () => {
      this.draw();
    }).on('error', () => {
    });

    this.draw();
  }

  async draw() {
    const { rows } = await this.localDB.allDocs({ include_docs: true });
    this.hands = rows.map(row => row.doc);
    this.inform();
  }

  subscribe(fn) {
    this.onChanges.push(fn);
    return () => {
      this.onChanges = this.onChanges.filter(f => f !== fn);
    };
  }

  inform() {
    this.onChanges.forEach( cb => cb() );
  }

  async add(themScore, usScore) {
    const hand = {
      _id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      "themScore": themScore,
      "usScore": usScore
    };

    await this.localDB.put(hand);
  }

  async destroy(hand) {
    await this.localDB.remove(hand);
    this.hands = this.hands.filter( h => h !== hand);
  }

  async destroyAll() {
    const deleted_hands = this.hands.map(hand => {
      return Object.assign({}, hand, { _deleted: true });
    });
    await this.localDB.bulkDocs(deleted_hands);
    this.hands = [];
  }

  dispose() {
    if (this.changesFeed) {
      this.changesFeed.cancel();
      this.changesFeed = null;
    }
    this.onChanges = [];
  }

  totalScores() {
    let themTotalScore = 0;
		let usTotalScore = 0;
    this.hands.forEach(hand => { themTotalScore += hand.themScore; usTotalScore += hand.usScore });
    return [themTotalScore, usTotalScore];
  }
}