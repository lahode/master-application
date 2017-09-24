export class Alert {
  static latestId: number;
  public id;
  public message: string;
  public type: string;

  static incrementId() {
    if (!this.latestId) this.latestId = 1
    else this.latestId++
    return this.latestId
  }

  constructor(message: string, type: string = 'danger') {
    this.id = Alert.incrementId();
    this.message = message;
    this.type = type;
  }
}
