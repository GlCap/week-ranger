import { DateTime } from 'luxon';

import { WeekRangerError } from './errors';
import type { FromStringOptions, TimeSerializable, ToStringOptions } from './types';
import { isDstObserved } from './utils';

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
  constructor(hours: number, minutes?: number);
  constructor(value: TimeSerializable);
  constructor(value: Time);
  constructor(value: Date);
  constructor(valueOrHours?: number | TimeSerializable | Time | Date, minutes?: number) {
    if (valueOrHours == null) {
      const now = new Date();

      this.globalMinutes = computeMinutes(now.getUTCHours(), now.getUTCMinutes());
      return;
    }

    if (valueOrHours instanceof Date) {
      this.globalMinutes = computeMinutes(valueOrHours.getUTCHours(), valueOrHours.getUTCMinutes());
      return;
    }

    if (valueOrHours instanceof Time) {
      this.globalMinutes = valueOrHours.globalMinutes;
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

  static fromString(value: string, options?: FromStringOptions): Time {
    const splitRawTime = value.split(SEPARATOR);
    if (splitRawTime.length !== 2) throw new WeekRangerError(value, 'Time');

    const [rawHours, rawMinutes] = splitRawTime;

    if (rawHours.length !== 2 || rawMinutes.length !== 2) {
      throw new WeekRangerError(value, 'Time');
    }

    const hours = Time.parseHoursDST(rawHours, options);
    const minutes = Number.parseInt(rawMinutes);

    if (hours >= 24 || minutes >= 60) {
      throw new WeekRangerError(value, 'Time');
    }

    return new Time({ hours, minutes });
  }

  private static parseHoursDST(rawHours: string, options: FromStringOptions = {}): number {
    const { dateOfFormatting = new Date() } = options;

    const isDST = isDstObserved(dateOfFormatting);

    let hours = Number.parseInt(rawHours);
    hours = isDST ? hours + 1 : hours;
    hours = isDST && hours >= 24 ? 0 : hours;

    return hours;
  }

  private formatHoursAndMinutes(
    hours: number,
    minutes: number,
    options: ToStringOptions = {},
  ): { hours: string; minutes: string } {
    const { dateOfParsing = new Date() } = options;

    const isDST = isDstObserved(dateOfParsing);

    const hoursDST = isDST ? hours - 1 : hours;

    let hoursString = `${hoursDST}`;
    let minutesString = `${minutes}`;

    if (hoursDST < 10) hoursString = `0${hoursDST}`;
    if (minutes < 10) minutesString = `0${minutes}`;

    return { hours: hoursString, minutes: minutesString };
  }

  toLocaleString(options?: ToStringOptions): string {
    const date = new Date(new Date().setUTCHours(this.hours, this.minutes));

    const { hours, minutes } = this.formatHoursAndMinutes(
      date.getHours(),
      date.getMinutes(),
      options,
    );

    return `${hours}${SEPARATOR}${minutes}`;
  }

  toString(options?: ToStringOptions): string {
    const { hours, minutes } = this.formatHoursAndMinutes(this.hours, this.minutes, options);

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

  toDateTime(from = DateTime.utc()): DateTime {
    const offset = Math.floor(from.offset / 60);
    return from.set({ minute: this.minutes, hour: this.hours + offset });
  }

  toJSON(from = new Date()): TimeSerializable {
    const isDST = isDstObserved(from);

    const hoursDST = isDST ? this.hours - 1 : this.hours;

    return { hours: hoursDST, minutes: this.minutes };
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
