import { DateTime } from 'luxon';
import { WeekRangerError } from '../errors';
import { TimeSerializable } from '../types';
import { isDstObserved } from '../utils';

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
  readonly isDST: boolean;

  constructor();
  constructor(hours: number, minutes?: number);
  constructor(value: TimeSerializable);
  constructor(value: Time);
  constructor(value: Date);
  constructor(valueOrHours?: number | TimeSerializable | Time | Date, minutes?: number) {
    this.isDST = false;
    if (valueOrHours == null) {
      const now = new Date();
      this.isDST = isDstObserved(now);

      this.globalMinutes = computeMinutes(now.getUTCHours(), now.getUTCMinutes());
      return;
    }

    if (valueOrHours instanceof Date) {
      this.isDST = isDstObserved(valueOrHours);
      this.globalMinutes = computeMinutes(valueOrHours.getUTCHours(), valueOrHours.getUTCMinutes());
      return;
    }

    if (valueOrHours instanceof Time) {
      this.isDST = valueOrHours.isDST;
      this.globalMinutes = valueOrHours.globalMinutes;
      return;
    }

    if (typeof valueOrHours === 'number') {
      this.globalMinutes = computeMinutes(valueOrHours, minutes ?? 0);
      return;
    }

    this.isDST = valueOrHours.isDST;
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

  static fromString(value: string): Time {
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

    return new Time({ hours, minutes, isDST: false });
  }

  private formatHoursAndMinutes(
    hours: number,
    minutes: number,
  ): { hours: string; minutes: string } {
    let hoursString = `${hours}`;
    let minutesString = `${minutes}`;

    if (hours < 10) hoursString = `0${hours}`;
    if (minutes < 10) minutesString = `0${minutes}`;

    return { hours: hoursString, minutes: minutesString };
  }

  toLocaleString(): string {
    const date = new Date(new Date().setUTCHours(this.hours, this.minutes));

    const { hours, minutes } = this.formatHoursAndMinutes(date.getHours(), date.getMinutes());

    return `${hours}${SEPARATOR}${minutes}`;
  }

  toString(): string {
    const { hours, minutes } = this.formatHoursAndMinutes(this.hours, this.minutes);

    return `${hours}${SEPARATOR}${minutes}`;
  }

  toDate(from = new Date()): Date {
    return new Date(
      Date.UTC(
        from.getUTCFullYear(),
        from.getUTCMonth(),
        from.getUTCDate(),
        this.hours,
        this.minutes,
      ),
    );
  }

  toDateTime(from = DateTime.now()): DateTime {
    return from.set({ minute: this.minutes, hour: this.hours });
  }

  toJSON(): TimeSerializable {
    return { hours: this.hours, minutes: this.minutes, isDST: this.isDST };
  }

  /**
   * Compare Time instances
   * @param that Time to compare
   * @returns positive if `this` is greater, negative if `this` is lesser, 0 if equals
   */
  compareTo(that: Time): number {
    if (this.isDST && !that.isDST) return this.globalMinutes - that.globalMinutes + 60;
    if (!this.isDST && that.isDST) return this.globalMinutes - that.globalMinutes - 60;

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

const HOUR_MINUTES = 60;
const DAY_HOURS = 24;
const MINUTES_DAY = 60 * 24;

const computeMinutes = (hours: number, minutes: number): number => hours * HOUR_MINUTES + minutes;

export const totalMinutesToTimeHours = (num: number): number => {
  const hours = Math.floor(num / HOUR_MINUTES);
  return hours > DAY_HOURS ? hours % DAY_HOURS : hours;
};

const totalMinutesToTimeMinutes = (num: number): number => {
  return num % HOUR_MINUTES;
};

const SEPARATOR = ':';
