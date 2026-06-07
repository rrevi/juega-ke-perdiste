import PouchDB from 'pouchdb';

export default class HandModel {
  constructor(dbName) {
    this.dbName = dbName;
    this.hands = [];
    this.onChanges = [];

    this.localDB = new PouchDB(this.dbName);
    this.localDB.changes({
      since: 'now',
      live: true
    }).on('change', () => {
      this.draw();
    }).on('error', (err) => {
      console.log('localDB.error: ', err);
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
  }

  inform() {
    this.onChanges.forEach( cb => cb() );
  }

  async add(themScore, usScore) {
    const hand = {
      "_id": Date.now().toString(),
      "themScore": themScore,
      "usScore": usScore
    };

    await this.localDB.put(hand);
    console.log('Successfully saved hand!');
  }

  destroy(hand) {
    this.localDB.remove(hand);
    this.hands = this.hands.filter( h => h !== hand);
  }

  destroyAll() {
    this.deleted_hands = this.hands.filter( hand => { 
      hand._deleted = true;
      return hand;
    });
    this.localDB.bulkDocs(this.deleted_hands);
    this.hands = [];
  }

  totalScores() {
    let themTotalScore = 0;
		let usTotalScore = 0;
    this.hands.forEach(hand => { themTotalScore += hand.themScore; usTotalScore += hand.usScore });
    return [themTotalScore, usTotalScore];
  }
}