type ErrorType = 'Week' | 'Day' | 'Range' | 'Time';

export class InvalidFormatError extends Error {
  private readonly TIME_FORMAT = `[0 <= HH < 24, 0 <= MM < 60]\nHH:MM`;
  private readonly RANGE_FORMAT = `${this.TIME_FORMAT}-${this.TIME_FORMAT}`;
  private readonly DAY_FORMAT = `${this.RANGE_FORMAT},${this.RANGE_FORMAT},${this.RANGE_FORMAT},...`;
  private readonly WEEK_FORMAT = `[0 < LINES < 7]\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n`;
  constructor(provided: string, type: ErrorType) {
    super();
    if (type === 'Time') {
      this.message = this.parseMessage(type, this.TIME_FORMAT, provided);
      return;
    }
    if (type === 'Range') {
      this.message = this.parseMessage(type, this.RANGE_FORMAT, provided);
      return;
    }
    if (type === 'Day') {
      this.message = this.parseMessage(type, this.DAY_FORMAT, provided);
      return;
    }
    if (type === 'Week') {
      this.message = this.parseMessage(type, this.WEEK_FORMAT, provided);
    }
  }

  private parseMessage(
    domain: ErrorType,
    format: string,
    provided: string,
  ): string {
    return `[${domain}]: Provided string does not meet the required format.\n[Format]: ${format}\n[Provided]: ${provided}`;
  }
}
