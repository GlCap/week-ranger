import { WeekRangerError } from '../errors';
import { TimeRangeSerializable } from '../types';
import { Time } from './Time';
import { TimeRange } from './TimeRange';

const SEPARATOR = ',';

const compareRanges = (a: TimeRange, b: TimeRange): number => a.compareTo(b);

export class RangeSerie {
  private readonly _ranges: Map<string, TimeRange>;

  constructor();
  constructor(value: string);
  constructor(value: string[]);
  constructor(value: TimeRange[]);
  constructor(value: Array<string | TimeRange>);
  constructor(value: TimeRangeSerializable[]);
  constructor(value: RangeSerie);

  constructor(
    value?:
      | string
      | TimeRange[]
      | string[]
      | TimeRangeSerializable[]
      | Array<string | TimeRange>
      | RangeSerie
      | null,
  ) {
    if (value == null) {
      this._ranges = new Map();
      return;
    }

    if (value instanceof RangeSerie) {
      this._ranges = value._ranges;
      return;
    }

    if (Array.isArray(value)) {
      this._ranges = new Map(
        value.map((r: string | TimeRange | TimeRangeSerializable) => {
          let range: TimeRange;

          if (r instanceof TimeRange) range = r;
          else if (typeof r === 'string') range = new TimeRange(r);
          else range = new TimeRange(r);

          return [range.toString(), range] as const;
        }),
      );
      return;
    }

    const parsed = typeof value === 'string' ? RangeSerie.parse(value) : value;

    this._ranges = new Map(
      parsed.map((r) => {
        const range = new TimeRange(r);
        return [range.toString(), range];
      }) ?? [],
    );
  }

  static slottable(timeSlot: number, range: string | TimeRange): string {
    const { start, end, duration } = typeof range === 'string' ? new TimeRange(range) : range;
    if (timeSlot > duration) {
      throw new WeekRangerError(
        'Time slot cannot be greater than range duration.',
        'TimeRangeChain',
        true,
      );
    }
    if (end.minutes % timeSlot !== 0) {
      throw new WeekRangerError(
        'Time slot must be able to divide range-end minutes.',
        'TimeRangeChain',
        true,
      );
    }

    let currentStart = start;
    let currentEnd = start.add(timeSlot);
    let current = new TimeRange({ start: currentStart, end: currentEnd });
    const ranges = [current];

    while (!current.end.equals(end)) {
      currentStart = currentEnd;
      currentEnd = currentEnd.add(timeSlot);
      current = new TimeRange(currentStart, currentEnd);
      ranges.push(current);
    }

    return new RangeSerie(ranges).toString();
  }

  static parse(value: string): TimeRangeSerializable[] {
    if (value.length === 0) {
      throw new WeekRangerError(value, 'Day');
    }

    const dayRangesRaw = value.split(SEPARATOR);

    const ranges = dayRangesRaw
      .map((rangeRaw) => new TimeRange(rangeRaw))
      .sort(compareRanges)
      .map((r) => r.toJSON());

    return ranges;
  }

  private sortRanges(): TimeRange[] {
    const array = [...this._ranges.values()];

    return array.sort(compareRanges);
  }

  private rangeOrString(range: string | TimeRange): string {
    return typeof range === 'string' ? range : range.toString();
  }

  toString(): string {
    const rangesString = this.sortRanges()
      .map((range) => range.toString())
      .join(SEPARATOR);

    return rangesString;
  }

  toDate(): Array<[Date, Date]> {
    return this.sortRanges().map((r) => r.toDate());
  }

  toJSON(): TimeRangeSerializable[] {
    return this.sortRanges().map((range) => range.toJSON());
  }

  equals(that: RangeSerie): boolean {
    return this.toString() === that.toString();
  }

  set(range: TimeRange): this {
    this._ranges.set(range.toString(), range);
    return this;
  }

  delete(range: string | TimeRange): this {
    this._ranges.delete(this.rangeOrString(range));
    return this;
  }

  replace(replace: string | TimeRange, range: TimeRange): this {
    const replaceString = this.rangeOrString(replace);
    if (!this._ranges.has(replaceString) || this._ranges.has(range.toString())) return this;
    this.delete(replaceString);
    return this.set(range);
  }

  has(range: TimeRange | string): boolean {
    return this._ranges.has(this.rangeOrString(range));
  }

  /**
   * Checks if provided `Range` or `Time` is contained within any of the `Range`s in this `Day`
   *
   * @param value `Range` or `Time`
   * @param extract if true, return the `Range`
   */
  contains(value: Time | TimeRange): boolean;
  contains(value: Time | TimeRange, extract: true): TimeRange | null;
  contains(value: Time | TimeRange, extract: false): boolean;
  contains(value: Time | TimeRange, extract = false): boolean | TimeRange | null {
    if (extract) return this.serie.find((r) => r.contains(value)) ?? null;
    return this.serie.some((r) => r.contains(value));
  }

  get serie(): TimeRange[] {
    return this.sortRanges();
  }

  get first(): TimeRange {
    return this.serie[0];
  }

  get last(): TimeRange {
    const ranges = this.serie;
    return ranges[ranges.length - 1];
  }

  get size(): number {
    return this._ranges.size;
  }
}
