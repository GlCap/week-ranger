import { Range } from './Range';
import { DaySerializable, WeekNumbers } from '../types';
import { InvalidFormatError } from '../errors';

export class Day {
  static readonly separator = ',';

  private readonly _ranges: Range[];
  private readonly _number: WeekNumbers | -1;

  constructor();
  constructor(value: string | null, number?: WeekNumbers);
  constructor(value: DaySerializable | null);
  constructor(value: Day | null);
  constructor(
    value?: string | DaySerializable | Day | null,
    number?: WeekNumbers,
  ) {
    if (value == null) {
      this._number = -1;
      this._ranges = [];
      return;
    }

    if (value instanceof Day) {
      this._number = value._number;
      this._ranges = value._ranges;
      return;
    }

    const parsed = typeof value === 'string' ? Day.parse(value, number) : value;

    this._number = parsed.number;
    this._ranges = parsed.ranges.map((range) => new Range(range));
  }

  static parse(value: string, index?: WeekNumbers): DaySerializable {
    if (value.length === 0) {
      throw new InvalidFormatError(value, 'Day');
    }

    const dayRangesRaw = value.split(Day.separator);

    return {
      number: index ?? -1,
      ranges: dayRangesRaw.map((rangeRaw) => Range.parse(rangeRaw)),
    };
  }

  toString(): string {
    return this._ranges.map((range) => range.toString()).join(Day.separator);
  }

  toJSON(): DaySerializable | null {
    if (this._ranges.length === 0) return null;
    return {
      number: this._number,
      ranges: this._ranges.map((range) => range.toJSON()),
    };
  }

  compareTo(that: Day): number {
    return this._number - that._number;
  }

  isAfter(that: Day): boolean {
    return this.compareTo(that) < 0;
  }

  equals(that: Day): boolean {
    return this.toString() === that.toString();
  }

  get ranges(): Range[] {
    return this._ranges;
  }

  get number(): number {
    return this._number;
  }
}
