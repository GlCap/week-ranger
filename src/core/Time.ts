import { WeekRangerError } from '../errors';
import { TimeSerializable } from '../types';

const HOUR_MINUTES = 60;
const DAY_HOURS = 24;
const SEPARATOR = ':';

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
  private readonly _hours: number;
  private readonly _minutes: number;

  constructor();
  constructor(value: string);
  constructor(hours: number, minutes?: number);
  constructor(value: TimeSerializable);
  constructor(value: Time);
  constructor(value: Date);
  constructor(valueOrHours?: string | number | TimeSerializable | Time | Date, minutes?: number) {
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

  static now(): string {
    return new Time().toString();
  }

  static parse(value: string): TimeSerializable {
    const splitRawTime = value.split(SEPARATOR);
    if (splitRawTime.length !== 2) throw new WeekRangerError(value, 'Time');

    const [rawHours, rawMinutes] = splitRawTime;

    if (rawHours.length !== 2 || rawMinutes.length !== 2) {
      throw new WeekRangerError(value, 'Time');
    }

    const hours = Number.parseInt(rawHours);
    const minutes = Number.parseInt(rawMinutes);

    if (hours >= 24 || minutes >= 60) {
      throw new WeekRangerError(value, 'Time');
    }

    return { hours, minutes };
  }

  toString(): string {
    let hours = `${this._hours}`;
    let minutes = `${this._minutes}`;

    if (this._hours < 10) hours = `0${this._hours}`;
    if (this._minutes < 10) minutes = `0${this._minutes}`;

    return `${hours}${SEPARATOR}${minutes}`;
  }

  toDate(from = new Date()): Date {
    return new Date(from.setHours(this._hours, this._minutes, 0, 0));
  }

  toJSON(): TimeSerializable {
    return { hours: this._hours, minutes: this._minutes };
  }

  equals(that: Time): boolean {
    return this._hours === that._hours && this.minutes === that._minutes;
  }

  /**
   * Compare Time instances
   * @param that Time to compare
   * @returns positive if `this` is greater, negative if `this` is lesser, 0 if equals
   */
  compareTo(that: Time): number {
    if (this._hours === that._hours) return this._minutes - that._minutes;
    return this._hours - that._hours;
  }

  /**
   * Check if `this` is after `that`
   * @param that Time to compare
   * @returns true if `this` is after `that`
   */
  isAfter(that: Time): boolean {
    return this.compareTo(that) > 0;
  }

  /**
   * Add minutes to a time
   * @param minutes minutes to add
   * @returns new Time instance with added minutes
   */
  add(minutes: number): Time {
    const { _hours, _minutes } = this;

    const minutesSum = minutes + _minutes;
    const minutesToHours = minutesSum >= HOUR_MINUTES ? Math.floor(minutesSum / HOUR_MINUTES) : 0;

    const hoursSum = _hours + minutesToHours;

    const nextHours = hoursSum >= DAY_HOURS ? hoursSum % DAY_HOURS : hoursSum;
    const nextMinutes = minutesSum >= HOUR_MINUTES ? minutesSum % HOUR_MINUTES : minutesSum;

    return new Time(nextHours, nextMinutes);
  }

  get hours(): number {
    return this._hours;
  }

  get minutes(): number {
    return this._minutes;
  }
}
