import { Range } from './Range';
import { DaySerializable } from '../types';

export class Day {
  static readonly separator = ',';

  private readonly _ranges: Range[];

  constructor(value: string | Day | DaySerializable) {
    if (value instanceof Day) {
      this._ranges = value._ranges;
      return;
    }

    const parsed = typeof value === 'string' ? Day.parse(value) : value;

    this._ranges = parsed.ranges.map((range) => new Range(range));
  }

  static parse(day: string): DaySerializable {
    const dayRangesRaw = day.split(Day.separator);

    return {
      ranges: dayRangesRaw.map((rangeRaw) => Range.parse(rangeRaw)),
    };
  }

  toString(): string {
    return this._ranges.map((range) => range.toString()).join(Day.separator);
  }

  toJSON(): DaySerializable {
    return { ranges: this._ranges.map((range) => range.toJSON()) };
  }

  get ranges(): Range[] {
    return this._ranges;
  }
}
