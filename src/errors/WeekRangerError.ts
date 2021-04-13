export type ErrorType = 'Week' | 'Day' | 'Range' | 'Time';

export class WeekRangerError extends Error {
  private readonly TIME_FORMAT = `[0 <= HH < 24, 0 <= MM < 60]\nHH:MM`;
  private readonly RANGE_FORMAT = `${this.TIME_FORMAT}-${this.TIME_FORMAT}`;
  private readonly DAY_FORMAT = `${this.RANGE_FORMAT},${this.RANGE_FORMAT},${this.RANGE_FORMAT},...`;
  private readonly WEEK_FORMAT = `[0 < LINES < 7]\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n${this.DAY_FORMAT}\n`;

  constructor(message: string);
  constructor(value: string, type: ErrorType, asMessage?: boolean);
  constructor(messageOrValue: string, type?: ErrorType, asMessage = false) {
    super(messageOrValue);

    if (asMessage) return;

    switch (type) {
      case 'Time':
        this.message = this.parseMessage(type, this.TIME_FORMAT, messageOrValue);
        break;
      case 'Range':
        this.message = this.parseMessage(type, this.RANGE_FORMAT, messageOrValue);
        break;
      case 'Day':
        this.message = this.parseMessage(type, this.DAY_FORMAT, messageOrValue);
        break;
      case 'Week':
        this.message = this.parseMessage(type, this.WEEK_FORMAT, messageOrValue);
        break;
    }
  }

  private parseMessage(type: ErrorType, format: string, provided?: string): string {
    const prov = provided != null ? `\n[Provided]: ${provided}` : '';
    return `[${type}]: Provided string does not meet the required format.\n[Format]: ${format}${prov}`;
  }
}
