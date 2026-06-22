export default class HandModel {
  constructor(dbName) {
    this.dbName = dbName;
    this.hands = [];
    this.onChanges = [];
    this.draw();
  }

  draw() {
    try {
      const stored = localStorage.getItem(this.dbName);
      this.hands = stored ? JSON.parse(stored) : [];
    } catch {
      this.hands = [];
    }
    this.inform();
  }

  subscribe(fn) {
    this.onChanges.push(fn);
    return () => {
      this.onChanges = this.onChanges.filter(f => f !== fn);
    };
  }

  inform() {
    this.onChanges.forEach(cb => cb());
  }

  add(themScore, usScore) {
    const hand = {
      _id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      themScore,
      usScore
    };
    this.hands.push(hand);
    this.persist();
    this.inform();
  }

  destroy(hand) {
    this.hands = this.hands.filter(h => h._id !== hand._id);
    this.persist();
    this.inform();
  }

  destroyAll() {
    this.hands = [];
    this.persist();
    this.inform();
  }

  persist() {
    localStorage.setItem(this.dbName, JSON.stringify(this.hands));
  }

  dispose() {
    this.onChanges = [];
  }

  totalScores() {
    let themTotalScore = 0;
    let usTotalScore = 0;
    this.hands.forEach(hand => {
      themTotalScore += hand.themScore;
      usTotalScore += hand.usScore;
    });
    return [themTotalScore, usTotalScore];
  }
}