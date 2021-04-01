import { TimeSerializable } from '../types';

/**
 * Format HH:MM 24 hours separated by a `:`
 *
 *
 * Examples:
 * 09:30
 */
export class Time {
  static readonly separator = ':' as const;

  private readonly _hours: number;
  private readonly _minutes: number;

  constructor(value?: string | Date | Time | TimeSerializable) {
    if (value == null) {
      const now = new Date();
      this._hours = now.getHours();
      this._minutes = now.getMinutes();
      return;
    }

    if (value instanceof Date) {
      this._hours = value.getHours();
      this._minutes = value.getMinutes();
      return;
    }

    if (value instanceof Time) {
      this._hours = value._hours;
      this._minutes = value._minutes;
      return;
    }

    const parsed = typeof value === 'string' ? Time.parse(value) : value;
    this._hours = parsed.hours;
    this._minutes = parsed.minutes;
  }

  static parse(rawTime: string): TimeSerializable {
    const splitRawTime = rawTime.split(Time.separator);
    if (splitRawTime.length !== 2) throw new Error(''); // TODO error handling
    const [rawHours, rawMinutes] = splitRawTime;

    const hours = Number.parseInt(rawHours);
    const minutes = Number.parseInt(rawMinutes);

    return { hours, minutes };
  }

  toString(): string {
    return `${this._hours}${Time.separator}${this._minutes}`;
  }

  toDate(from?: Date): Date {
    if (from == null) {
      return new Date(new Date().setHours(this._hours, this._minutes));
    }
    return new Date(from.setHours(this._hours, this._minutes));
  }

  toJSON(): TimeSerializable {
    return { hours: this._hours, minutes: this._minutes };
  }

  get hours(): number {
    return this._hours;
  }

  get minutes(): number {
    return this._minutes;
  }
}
