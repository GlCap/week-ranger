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
  constructor(value: Array<string | Range>, number?: WeekDays);
  constructor(value: Range[], number?: WeekDays);
  constructor(value: DaySerializable | null);
  constructor(value: Day, number?: WeekDays);
  constructor(
    value?: string | DaySerializable | Day | Array<string | Range> | null,
    number?: WeekDays,
  ) {
    if (value == null) {
      this._number = null;
      this._ranges = new Map();
      return;
    }

    if (value instanceof Day) {
      this._number = number ?? value._number;
      this._ranges = value._ranges;
      return;
    }

    if (Array.isArray(value)) {
      this._number = number ?? null;
      this._ranges = new Map(
        value.map((r: Range | string) => {
          let range;

          if (typeof r === 'string') range = new Range(r);
          else range = r;

          return [range.toString(), range] as const;
        }),
      );
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

  private rangeOrString(range: string | Range): string {
    return typeof range === 'string' ? range : range.toString();
  }

  /**
   * Create a `Day` with constant `Range`s duration
   * @param timeSlot the constant `Range` duration
   * @param range the time `Range`
   */
  static slottable(timeSlot: number, range: string | Range): string {
    const { start, end, duration } = typeof range === 'string' ? new Range(range) : range;
    if (timeSlot > duration) {
      throw new Error('Time slot cannot be greater than range duration.');
    }
    if (end.minutes % timeSlot !== 0) {
      throw new Error('Time slot must be able to divide range-end minutes.');
    }

    let currentStart = start;
    let currentEnd = start.add(timeSlot);
    let current = new Range({ start: currentStart, end: currentEnd });
    const ranges = [current];

    while (!current.end.equals(end)) {
      currentStart = currentEnd;
      currentEnd = currentEnd.add(timeSlot);
      current = new Range(currentStart, currentEnd);
      ranges.push(current);
    }

    return new Day(ranges).toString();
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

  set(range: Range): this {
    this._ranges.set(range.toString(), range);
    return this;
  }

  delete(range: string | Range): this {
    this._ranges.delete(this.rangeOrString(range));
    return this;
  }

  replace(replace: string | Range, range: Range): this {
    const replaceString = this.rangeOrString(replace);
    if (!this._ranges.has(replaceString) || this._ranges.has(range.toString())) return this;
    this.delete(replaceString);
    return this.set(range);
  }

  has(range: Range | string): boolean {
    return this._ranges.has(this.rangeOrString(range));
  }

  get ranges(): Range[] {
    return this.getRangesArray();
  }

  get number(): WeekDays | null {
    return this._number;
  }
}
