import { WeekRangerError } from '../errors';
import { TimeSerializable } from '../types';

const HOUR_MINUTES = 60;
const DAY_HOURS = 24;
const MINUTES_DAY = 60 * 24;

const computeMinutes = (hours: number, minutes: number): number => hours * HOUR_MINUTES + minutes;

const totalMinutesToTimeHours = (num: number): number => {
  const hours = Math.floor(num / HOUR_MINUTES);
  return hours > DAY_HOURS ? hours % DAY_HOURS : hours;
};

const totalMinutesToTimeMinutes = (num: number): number => {
  return num % HOUR_MINUTES;
};

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
  private readonly globalMinutes: number;

  constructor();
  constructor(value: string);
  constructor(hours: number, minutes?: number);
  constructor(value: TimeSerializable);
  constructor(value: Time);
  constructor(value: Date);
  constructor(valueOrHours?: string | number | TimeSerializable | Time | Date, minutes?: number) {
    if (valueOrHours == null) {
      const now = new Date();

      this.globalMinutes = computeMinutes(now.getHours(), now.getMinutes());
      return;
    }

    if (valueOrHours instanceof Date) {
      this.globalMinutes = computeMinutes(valueOrHours.getHours(), valueOrHours.getMinutes());
      return;
    }

    if (valueOrHours instanceof Time) {
      this.globalMinutes = valueOrHours.globalMinutes;
      return;
    }

    if (typeof valueOrHours === 'string') {
      const parsed = Time.parse(valueOrHours);
      this.globalMinutes = computeMinutes(parsed.hours, parsed.minutes);
      return;
    }

    if (typeof valueOrHours === 'number') {
      this.globalMinutes = computeMinutes(valueOrHours, minutes ?? 0);
      return;
    }

    this.globalMinutes = computeMinutes(valueOrHours.hours, valueOrHours.minutes);
  }

  static now(): string {
    return new Time().toString();
  }

  static fromMinutes(totalMinutes: number): Time {
    const hours = totalMinutesToTimeHours(totalMinutes);
    const minutes = totalMinutesToTimeMinutes(totalMinutes);

    return new Time(hours, minutes);
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
    let hours = `${this.hours}`;
    let minutes = `${this.minutes}`;

    if (this.hours < 10) hours = `0${hours}`;
    if (this.minutes < 10) minutes = `0${minutes}`;

    return `${hours}${SEPARATOR}${minutes}`;
  }

  toDate(from = new Date()): Date {
    return new Date(from.setHours(this.hours, this.minutes, 0, 0));
  }

  toJSON(): TimeSerializable {
    return { hours: this.hours, minutes: this.minutes };
  }

  /**
   * Compare Time instances
   * @param that Time to compare
   * @returns positive if `this` is greater, negative if `this` is lesser, 0 if equals
   */
  compareTo(that: Time): number {
    return this.globalMinutes - that.globalMinutes;
  }

  /**
   * Compares the instance with another Time and returns true if they are equals
   * @param that Time to compare
   */
  equals(that: Time): boolean {
    return this.compareTo(that) === 0;
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
   */
  add(minutes: number): Time {
    const { globalMinutes } = this;

    const minutesSum = globalMinutes + minutes;

    return Time.fromMinutes(minutesSum);
  }

  /**
   * Subtract minutes to a time
   * @param minutes minutes to subtract
   */
  sub(minutes: number): Time {
    const { globalMinutes } = this;

    const diff = globalMinutes - minutes;

    const nextMinutes = diff > 0 ? diff : MINUTES_DAY + diff;

    return Time.fromMinutes(nextMinutes);
  }

  get hours(): number {
    return totalMinutesToTimeHours(this.globalMinutes);
  }

  get minutes(): number {
    return totalMinutesToTimeMinutes(this.globalMinutes);
  }
}
