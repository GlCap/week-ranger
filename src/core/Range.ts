import { Time } from './Time';
import { RangeSerializable } from '../types';

export class Range {
  static readonly separator = '-' as const;

  private readonly _start: Time;
  private readonly _end: Time;

  constructor(value: string | Range | RangeSerializable) {
    if (value instanceof Range) {
      this._start = value._start;
      this._end = value._end;
      return;
    }

    const parsed = typeof value === 'string' ? Range.parse(value) : value;

    this._start = new Time(parsed.start);
    this._end = new Time(parsed.end);
  }

  static parse(value: string): RangeSerializable {
    const rawTime = value.split(Range.separator);
    if (rawTime.length !== 2) throw new Error('');
    const [startRaw, endRaw] = rawTime;

    const start = Time.parse(startRaw);
    const end = Time.parse(endRaw);

    return { start, end };
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
    return { end: this._end, start: this._start };
  }

  get start(): Time {
    return this._start;
  }

  get end(): Time {
    return this._end;
  }
}
