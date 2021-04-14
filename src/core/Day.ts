import { Range } from './Range';
import { Time } from './Time';
import { DayParsable, DaySerializable, WeekDays } from '../types';
import { WeekRangerError } from '../errors';
import { WEEK_DAYS } from '../utils';

const compareRanges = (a: Range, b: Range): number => a.compareTo(b);

const SEPARATOR = ',';
const SEPARATOR_OPTIONAL = ';';

export class Day {
  private readonly _ranges: Map<string, Range>;
  private readonly _number: WeekDays | null;
  private readonly _date: Date | null;

  constructor();
  constructor(value: string, numberOrDate?: WeekDays | Date);
  constructor(value: Array<string | Range>, numberOrDate?: WeekDays | Date);
  constructor(value: Range[], numberOrDate?: WeekDays | Date);
  constructor(value: DayParsable | null, numberOrDate?: WeekDays | Date);
  constructor(value: Day, numberOrDate?: WeekDays | Date);
  constructor(
    value?: string | DayParsable | Day | Array<string | Range> | null,
    numberOrDate?: WeekDays | Date,
  ) {
    const date = numberOrDate instanceof Date ? new Date(numberOrDate.setHours(0, 0, 0, 0)) : null;
    const number = numberOrDate instanceof Date ? numberOrDate.getDay() : numberOrDate ?? null;

    if (value == null) {
      this._number = number;
      this._date = date;
      this._ranges = new Map();
      return;
    }

    if (value instanceof Day) {
      this._number = number ?? value._number;
      this._date = date ?? value._date;
      this._ranges = value._ranges;
      return;
    }

    if (Array.isArray(value)) {
      this._number = number;
      this._date = date;
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

    const parsed = typeof value === 'string' ? Day.parse(value, number ?? undefined) : value;

    this._number = number ?? parsed.number ?? null;
    this._date = date ?? parsed.date ?? null;
    this._ranges = new Map(
      parsed.ranges?.map((r) => {
        const range = new Range(r);
        return [range.toString(), range];
      }) ?? [],
    );
  }

  private sortRanges(): Range[] {
    const array = [...this._ranges.values()];

    return array.sort(compareRanges);
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
      throw new WeekRangerError('Time slot cannot be greater than range duration.', 'Day', true);
    }
    if (end.minutes % timeSlot !== 0) {
      throw new WeekRangerError('Time slot must be able to divide range-end minutes.', 'Day', true);
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

  static parse(value: string, index?: WeekDays | null): DaySerializable {
    if (value.length === 0 || (index != null && !WEEK_DAYS.includes(index))) {
      throw new WeekRangerError(value, 'Day');
    }

    const splitValue = value.split(SEPARATOR_OPTIONAL);

    const [isoDateOrRanges, rawRangesOrUndefined] = splitValue;

    let date = null;
    let rawRanges = isoDateOrRanges;

    if (rawRangesOrUndefined != null) {
      date = new Date(new Date(isoDateOrRanges).setHours(0, 0, 0, 0));
      rawRanges = rawRangesOrUndefined;
    }

    const dayRangesRaw = rawRanges.split(SEPARATOR);

    const ranges = dayRangesRaw
      .map((rangeRaw) => new Range(rangeRaw))
      .sort(compareRanges)
      .map((r) => r.toJSON());

    return {
      date,
      ranges,
      number: date?.getDay() ?? index ?? null,
    };
  }

  toString(): string {
    const rangesString = this.sortRanges()
      .map((range) => range.toString())
      .join(SEPARATOR);

    if (this._date != null) {
      return `${this._date.toISOString()}${SEPARATOR_OPTIONAL}${rangesString}`;
    }

    return rangesString;
  }

  toDate(): Array<[Date, Date]> {
    return this.sortRanges().map((r) => r.toDate(this._date ?? undefined));
  }

  toJSON(): DaySerializable | null {
    if (this._ranges.size === 0) return null;

    return {
      date: this._date,
      number: this._number,
      ranges: this.sortRanges().map((range) => range.toJSON()),
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

  /**
   * Checks if provided `Range` or `Time` is contained within any of the `Range`s in this `Day`
   *
   * @param value `Range` or `Time`
   * @param extract if true, return the `Range`
   */
  contains(value: Time | Range): boolean;
  contains(value: Time | Range, extract: true): Range | null;
  contains(value: Time | Range, extract: false): boolean;
  contains(value: Time | Range, extract = false): boolean | Range | null {
    if (extract) return this.ranges.find((r) => r.contains(value)) ?? null;
    return this.ranges.some((r) => r.contains(value));
  }

  getDayStartDate(): Date | null {
    const start = this._date?.setHours(0, 0, 0, 0);
    if (start == null) return null;
    return new Date(start);
  }

  getDayEndDate(): Date | null {
    const end = this._date?.setHours(23, 59, 59, 999);
    if (end == null) return null;
    return new Date(end);
  }

  get number(): WeekDays | null {
    return this._date?.getDay() ?? this._number;
  }

  get ranges(): Range[] {
    return this.sortRanges();
  }

  get first(): Range {
    return this.ranges[0];
  }

  get last(): Range {
    const ranges = this.ranges;
    return ranges[ranges.length - 1];
  }

  get size(): number {
    return this._ranges.size;
  }
}
