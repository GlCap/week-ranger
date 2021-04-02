import { InvalidFormatError } from '../errors';
import { TimeSerializable } from '../types';

/**
 * 24 hours based Hours and Minutes time (HH:MM) separated by a `:`
 *
 * Examples:
 *
 * 09:30
 *
 * 14:35
 *
 */
export class Time {
  static readonly separator = ':' as const;

  private readonly _hours: number;
  private readonly _minutes: number;

  constructor();
  constructor(value: string);
  constructor(hours: number, minutes?: number);
  constructor(value: TimeSerializable);
  constructor(value: Time);
  constructor(value: Date);
  constructor(
    valueOrHours?: string | number | TimeSerializable | Time | Date,
    minutes?: number,
  ) {
    if (valueOrHours == null) {
      const now = new Date();
      this._hours = now.getHours();
      this._minutes = now.getMinutes();
      return;
    }

    if (valueOrHours instanceof Date) {
      this._hours = valueOrHours.getHours();
      this._minutes = valueOrHours.getMinutes();
      return;
    }

    if (valueOrHours instanceof Time) {
      this._hours = valueOrHours._hours;
      this._minutes = valueOrHours._minutes;
      return;
    }
    if (typeof valueOrHours === 'string') {
      const parsed = Time.parse(valueOrHours);
      this._hours = parsed.hours;
      this._minutes = parsed.minutes;
      return;
    }

    if (typeof valueOrHours === 'number') {
      this._hours = valueOrHours;
      this._minutes = minutes ?? 0;
      return;
    }

    this._hours = valueOrHours.hours;
    this._minutes = valueOrHours.minutes;
  }

  static parse(value: string): TimeSerializable {
    const splitRawTime = value.split(Time.separator);
    if (splitRawTime.length !== 2) {
      throw new InvalidFormatError(value, 'Time');
    }
    const [rawHours, rawMinutes] = splitRawTime;

    if (rawHours.length !== 2 || rawMinutes.length !== 2) {
      throw new InvalidFormatError(value, 'Time');
    }

    const hours = Number.parseInt(rawHours);
    const minutes = Number.parseInt(rawMinutes);

    return { hours, minutes };
  }

  toString(): string {
    return `${this._hours}${Time.separator}${this._minutes}`;
  }

  toDate(from?: Date): Date {
    if (from == null) {
      return new Date(0, 0, 0, this._hours, this._minutes);
    }
    return new Date(from.setHours(this._hours, this._minutes));
  }

  toJSON(): TimeSerializable {
    return { hours: this._hours, minutes: this._minutes };
  }

  equals(that: Time): boolean {
    return this._hours === that._hours && this.minutes === that._minutes;
  }

  compareTo(that: Time): number {
    if (this._hours === that._hours) return this._minutes - that._minutes;
    return this._hours - that._hours;
  }

  isAfter(that: Time): boolean {
    return this.compareTo(that) > 0;
  }

  get hours(): number {
    return this._hours;
  }

  get minutes(): number {
    return this._minutes;
  }
}
