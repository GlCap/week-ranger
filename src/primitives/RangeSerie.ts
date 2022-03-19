import { WeekRangerError } from '../errors';
import { RangeSerieSlottableOptions, TimeRangeSerializable } from '../types';
import { Time } from './Time';
import { TimeRange } from './TimeRange';

export class RangeSerie extends Map<string, TimeRange> {
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

  constructor(
    value?:
      | string
      | TimeRange[]
      | string[]
      | TimeRangeSerializable[]
      | Array<string | TimeRange | TimeRangeSerializable>
      | Map<string, TimeRange>
      | RangeSerie
      | null,
  ) {
    if (value == null) {
      super();
      return;
    }

    if (value instanceof RangeSerie) {
      super(value);
      return;
    }

    if (value instanceof Map) {
      super(value);
      return;
    }

    if (Array.isArray(value)) {
      super(RangeSerie.fromArray(value));
      return;
    }

    const parsed = typeof value === 'string' ? RangeSerie.parse(value) : value;

    super(new Map(parsed.map(mapToTimeRangeTuple)));
  }

  static fromArray(value: string[]): RangeSerie;
  static fromArray(value: TimeRange[]): RangeSerie;
  static fromArray(value: TimeRangeSerializable[]): RangeSerie;
  static fromArray(value: Array<string | TimeRange | TimeRangeSerializable>): RangeSerie;
  static fromArray(
    value: TimeRange[] | string[] | TimeRangeSerializable[] | Array<string | TimeRange>,
  ): RangeSerie {
    const mappedValues = value.map(mapToTimeRangeTuple);

    return new RangeSerie(new Map(mappedValues));
  }

  /**
   * Split a `TimeRange` in a `RangeSerie` using provided settings
   *
   * @param timeSlot time slot duration in minutes, must be a multiple of 5
   * @param range the `TimeRange` to split
   * @param options extra optional options
   * @returns
   */
  static slottable(
    timeSlot: number,
    range: string | TimeRange,
    options: RangeSerieSlottableOptions = {},
  ): RangeSerie {
    const timeRange = typeof range === 'string' ? new TimeRange(range) : range;
    const { timeRequired = timeSlot, allowedMinutesOverflow = 0 } = options;

    const maxSlots = TimeRange.numberOfSlotsInRange(timeRange, timeSlot);

    if (maxSlots === 0) {
      throw new WeekRangerError(
        `The provided timeSlot and timeRange will not produce any serie.
        Check that both timeSlot and range duration are a multiple of 5
        or that time slot is not greater than or equal to timeRange duration.`,
        'RangeSerie',
        true,
      );
    }

    const ranges: TimeRange[] = [];

    let currentStart = timeRange.start;

    for (let index = 0; index <= maxSlots; index++) {
      // create a TimeRange of the required duration
      const slot = new TimeRange(currentStart, currentStart.add(timeRequired));

      // check if the slot is contained in the range
      // add the slot to the ranges array if it satisfies the required conditions
      if (isSlotAvailable(slot, timeRange, allowedMinutesOverflow)) ranges.push(slot);

      // set the next start at a timeSlot duration from the current start
      currentStart = currentStart.add(timeSlot);
    }

    return new RangeSerie(ranges);
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
    const array = [...this.values()];

    return array.sort(compareRanges);
  }

  private rangeOrString(range: string | TimeRange): string {
    return typeof range === 'string' ? range : range.toString();
  }

  equals(that: RangeSerie): boolean {
    return this.toString() === that.toString();
  }

  set(key: TimeRange | string): this {
    const range = new TimeRange(key);

    if (typeof key === 'string') {
      return super.set(key, range);
    }

    return super.set(key.toString(), range);
  }

  delete(range: string | TimeRange): boolean {
    return super.delete(this.rangeOrString(range));
  }

  replace(replace: string | TimeRange, range: string | TimeRange): this {
    const replaceString = this.rangeOrString(replace);
    if (!this.has(replaceString) || this.has(range.toString())) return this;
    this.delete(replaceString);
    return this.set(range);
  }

  has(range: TimeRange | string): boolean {
    return super.has(this.rangeOrString(range));
  }

  /**
   * Checks if provided `Range` or `Time` is contained within any of the `Range`s in this `Day`
   *
   * @param value `Range` or `Time`
   */
  contains(value: Time | TimeRange): boolean;
  /**
   * Checks if provided `Range` or `Time` is contained within any of the `Range`s in this `Day`
   *
   * @param value `Range` or `Time`
   * @param extract if true, return the `Range`
   */
  contains(value: Time | TimeRange, extract: true): TimeRange | null;
  contains(value: Time | TimeRange, extract: false): boolean;
  contains(value: Time | TimeRange, extract = false): boolean | TimeRange | null {
    if (extract) return this.serie.find((r) => r.contains(value)) ?? null;
    return this.serie.some((r) => r.contains(value));
  }

  toString(): string {
    const rangesString = this.sortRanges()
      .map((range) => range.toString())
      .join(SEPARATOR);

    return rangesString;
  }

  toLocaleString(): string {
    const rangesString = this.sortRanges()
      .map((range) => range.toLocaleString())
      .join(SEPARATOR);

    return rangesString;
  }

  toDate(): Array<[Date, Date]> {
    return this.sortRanges().map((r) => r.toDate());
  }

  toJSON(): TimeRangeSerializable[] {
    return this.sortRanges().map((range) => range.toJSON());
  }
}

const SEPARATOR = ',';

const compareRanges = (a: TimeRange, b: TimeRange): number => a.compareTo(b);

function isSlotAvailable(
  slot: TimeRange,
  range: TimeRange,
  allowedMinutesOverflow: number,
): boolean {
  return range.end.add(allowedMinutesOverflow).compareTo(slot.end) >= 0;
}

function mapToTimeRangeTuple(
  item: string | TimeRange | TimeRangeSerializable,
): readonly [string, TimeRange] {
  const range = new TimeRange(item);

  return [range.toString(), range] as const;
}
