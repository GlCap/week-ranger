import { Range } from './Range';
import { DaySerializable, WeekDays } from '../types';
import { InvalidFormatError } from '../errors';

const WEEK_DAYS: WeekDays[] = [0, 1, 2, 3, 4, 5, 6];

export class Day {
  static readonly separator = ',';

  private readonly _ranges: Map<string, Range>;
  private readonly _number: WeekDays | null;

  constructor();
  constructor(value: string, number?: WeekDays);
  constructor(value: Range[], number?: WeekDays);
  constructor(value: DaySerializable | null);
  constructor(value: Day);
  constructor(
    value?: string | DaySerializable | Day | Range[] | null,
    number?: WeekDays,
  ) {
    if (value == null) {
      this._number = null;
      this._ranges = new Map();
      return;
    }

    if (value instanceof Day) {
      this._number = value._number;
      this._ranges = value._ranges;
      return;
    }

    if (Array.isArray(value)) {
      this._number = number ?? null;
      this._ranges = new Map(value.map((r) => [r.toString(), r]));
      return;
    }

    const parsed = typeof value === 'string' ? Day.parse(value, number) : value;

    this._number = parsed.number;
    this._ranges = new Map(
      parsed.ranges.map((range) => {
        const r = new Range(range);
        return [r.toString(), r];
      }),
    );
  }

  private getRangesArray(): Range[] {
    const array = [...this._ranges.values()];
    const compareFn = (a: Range, b: Range): number => a.compareTo(b);

    return array.sort(compareFn);
  }

  static parse(value: string, index?: WeekDays): DaySerializable {
    if (value.length === 0 || (index != null && !WEEK_DAYS.includes(index))) {
      throw new InvalidFormatError(value, 'Day');
    }

    const dayRangesRaw = value.split(Day.separator);

    const ranges = dayRangesRaw
      .map((rangeRaw) => new Range(rangeRaw))
      .sort((a, b) => b.compareTo(a))
      .map((r) => r.toJSON());

    return {
      ranges,
      number: index ?? null,
    };
  }

  toString(): string {
    return this.getRangesArray()
      .map((range) => range.toString())
      .join(Day.separator);
  }

  toJSON(): DaySerializable | null {
    if (this._ranges.size === 0) return null;

    return {
      number: this._number,
      ranges: this.getRangesArray().map((range) => range.toJSON()),
    };
  }

  compareTo(that: Day): number {
    if (this._number == null || that._number == null) return 0;
    return this._number - that._number;
  }

  isAfter(that: Day): boolean {
    return this.compareTo(that) > 0;
  }

  equals(that: Day): boolean {
    return this.toString() === that.toString();
  }

  set(range: Range): void {
    this._ranges.set(range.toString(), range);
  }

  delete(range: string): void {
    this._ranges.delete(range);
  }

  get ranges(): Range[] {
    return this.getRangesArray();
  }

  get number(): WeekDays | null {
    return this._number;
  }
}
