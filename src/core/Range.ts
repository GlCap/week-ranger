import { Time } from './Time';
import { RangeSerializable } from '../types';
import { InvalidFormatError } from '../errors';

export class Range {
  static readonly separator = '-' as const;

  private readonly _start: Time;
  private readonly _end: Time;

  constructor(value: string);
  constructor(value: RangeSerializable);
  constructor(value: Range);
  constructor(value: string | RangeSerializable | Range) {
    if (value instanceof Range) {
      this._start = value._start;
      this._end = value._end;
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

  get start(): Time {
    return this._start;
  }

  get end(): Time {
    return this._end;
  }
}
