export class Message {
  static latestId: number;
  public id;
  public text: string;
  public type: string;

  static incrementId() {
    if (!this.latestId) {
      this.latestId = 1;
    } else {
      this.latestId++;
    }
    return this.latestId;
  }

  constructor(text: string, type: string = 'danger') {
    this.id = Message.incrementId();
    this.text = text;
    this.type = type;
  }
}
