import { Time } from './Time';
import { TimeRangeSerializable } from '../types';
import { WeekRangerError } from '../errors';

const SEPARATOR = '-';

export class TimeRange {
  private readonly _start: Time;
  private readonly _end: Time;

  constructor(value: string);
  constructor(value: [Time, Time]);
  constructor(start: Time, end: Time);
  constructor(value: TimeRangeSerializable);
  constructor(value: TimeRange);
  constructor(
    value: string | [Time, Time] | TimeRangeSerializable | TimeRange | Time,
    valueEnd?: Time,
  ) {
    if (value instanceof TimeRange) {
      this._start = value._start;
      this._end = value._end;
      return;
    }

    if (value instanceof Time) {
      this._start = value;
      this._end = valueEnd ?? new Time(0);
      return;
    }

    if (Array.isArray(value)) {
      const [start, end] = value;
      if (start.isAfter(end)) {
        throw new WeekRangerError('Invalid Range tuple, start cannot be after end.', 'TimeRange');
      }

      this._start = start;
      this._end = end;
      return;
    }

    const { start, end } = typeof value === 'string' ? TimeRange.parse(value) : value;

    this._start = new Time(start.hours, start.minutes);
    this._end = new Time(end.hours, end.minutes);
  }

  static parse(value: string): TimeRangeSerializable {
    const rawTime = value.split(SEPARATOR);
    if (rawTime.length !== 2) {
      throw new WeekRangerError(value, 'TimeRange');
    }
    const [startRaw, endRaw] = rawTime;

    const start = new Time(startRaw);
    const end = new Time(endRaw);

    if (start.isAfter(end)) throw new WeekRangerError(value, 'TimeRange');

    return { start: start.toJSON(), end: end.toJSON() };
  }

  toString(): string {
    return `${this._start.toString()}${SEPARATOR}${this._end.toString()}`;
  }

  toDate(from: Date = new Date()): [Date, Date] {
    return [this._start.toDate(from), this._end.toDate(from)];
  }

  toJSON(): TimeRangeSerializable {
    return { end: this._end.toJSON(), start: this._start.toJSON() };
  }

  equals(that: TimeRange): boolean {
    return this.compareTo(that) === 0;
  }

  /**
   * Compares `Range` instances
   * @param that `Range` to compare
   * @returns positive if `this` is greater, negative if `this` is lesser, 0 if equals
   */
  compareTo(that: TimeRange): number {
    const start = this._start.compareTo(that._start);
    const end = this._end.compareTo(that._end);

    if (start > 0) return 1;
    if (start < 0) return -1;

    if (end > 0) return 1;
    if (end < 0) return -1;

    return 0;
  }

  isAfter(that: TimeRange): boolean {
    return this.compareTo(that) > 0;
  }

  /**
   * Checks if provided `Range` or `Time` is contained within this `Range`
   * @param value `Range` or `Time`
   */
  contains(value: Time | TimeRange): boolean {
    if (value instanceof Time) {
      return value.compareTo(this._start) >= 0 && value.compareTo(this._end) <= 0;
    }
    return value._start.compareTo(this._start) >= 0 && value._end.compareTo(this._end) <= 0;
  }

  get start(): Time {
    return this._start;
  }

  get end(): Time {
    return this._end;
  }

  get duration(): number {
    const hours = this._end.hours - this._start.hours;
    const minutes = this._end.minutes - this._start.minutes;

    const total = hours * 60 + minutes;

    return total;
  }
}
