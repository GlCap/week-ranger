import { Time } from './Time';
import { RangeSerializable } from '../types';
import { InvalidFormatError } from '../errors';

export class Range {
  static readonly separator = '-' as const;

  private readonly _start: Time;
  private readonly _end: Time;

  constructor(value: string);
  constructor(value: [Time, Time]);
  constructor(start: Time, end: Time);
  constructor(value: RangeSerializable);
  constructor(value: Range);
  constructor(value: string | [Time, Time] | RangeSerializable | Range | Time, valueEnd?: Time) {
    if (value instanceof Range) {
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
      if (start.isAfter(end)) throw new Error('Invalid Range tuple, start cannot be after end.');

      this._start = start;
      this._end = end;
      return;
    }

    const { start, end } = typeof value === 'string' ? Range.parse(value) : value;

    this._start = new Time(start.hours, start.minutes);
    this._end = new Time(end.hours, end.minutes);
  }

  static parse(value: string): RangeSerializable {
    const rawTime = value.split(Range.separator);
    if (rawTime.length !== 2) {
      throw new InvalidFormatError(value, 'Range');
    }
    const [startRaw, endRaw] = rawTime;

    const start = new Time(startRaw);
    const end = new Time(endRaw);

    if (start.isAfter(end)) throw new InvalidFormatError(value, 'Range');

    return { start: start.toJSON(), end: end.toJSON() };
  }

  toString(): string {
    return `${this._start.toString()}${Range.separator}${this._end.toString()}`;
  }

  toDate(from?: Date): [Date, Date] {
    if (from == null) {
      return [this._start.toDate(), this._end.toDate()];
    }
    return [this._start.toDate(from), this._end.toDate(from)];
  }

  toJSON(): RangeSerializable {
    return { end: this._end.toJSON(), start: this._start.toJSON() };
  }

  equals(that: Range): boolean {
    return this.compareTo(that) === 0;
  }

  /**
   * Compares `Range` instances
   * @param that `Range` to compare
   * @returns positive if `this` is greater, negative if `this` is lesser, 0 if equals
   */
  compareTo(that: Range): number {
    const start = this._start.compareTo(that._start);
    const end = this._end.compareTo(that._end);

    if (start > 0) return 1;
    if (start < 0) return -1;

    if (end > 0) return 1;
    if (end < 0) return -1;

    return 0;
  }

  isAfter(that: Range): boolean {
    return this.compareTo(that) > 0;
  }

  /**
   * Checks if provided `Range` or `Time` is within this `Range`
   * @param value `Range` or `Time`
   */
  isWithin(value: Range): boolean;
  isWithin(value: Time): boolean;
  isWithin(value: Time | Range): boolean {
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
