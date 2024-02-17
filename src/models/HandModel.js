import PouchDB from 'pouchdb';

export default class HandModel {
  constructor(dbName) {
    let self = this;

    this.dbName = dbName;
    this.hands = [];
    this.onChanges = [];

    this.localDB = new PouchDB(this.dbName);
    this.localDB.changes({
      since: 'now',
      live: true
    }).on('change', function () {
      self.draw();
    }).on('error', function (err) {
      console.log('localDB.error: ', err);
    });

    this.draw();
  }

  draw() {
    let self = this;
    // @ts-ignore
    this.localDB.allDocs({ include_docs: true }, function (err, doc) {
      let next_hands = doc.rows.map(hand => hand.doc);
      self.hands = next_hands;
      self.inform();
    });
  }

  subscribe(fn) {
    this.onChanges.push(fn);
  }

  inform() {
    this.onChanges.forEach( cb => cb() );
  }

  add(themScore, usScore) {
    let hand = {
      "_id": Date.now().toString(),
      "themScore": themScore,
      "usScore": usScore
    };
    
    // @ts-ignore
    this.localDB.put(hand, function callback(err, result){
      if(!err) {
        console.log('Succesfully saved hand!');
      }
    });
  }

  destroy(hand) {
    this.localDB.remove(hand);
  }

  destroyAll() {
    this.deleted_hands = this.hands.filter( hand => { 
      hand._deleted = true;
      return hand;
    });
    this.localDB.bulkDocs(this.deleted_hands);
  }

  totalScores() {
    let themTotalScore = 0;
		let usTotalScore = 0;
    this.hands.forEach(hand => { themTotalScore += hand.themScore; usTotalScore += hand.usScore });
    return [themTotalScore, usTotalScore];
  }
}