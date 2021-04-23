import { TimeRange, TimeRangeChain } from '../primitives';
import { DayParsable, DaySerializable, WeekDays } from '../types';
import { WeekRangerError } from '../errors';
import { WEEK_DAYS } from '../utils';

const compareRanges = (a: TimeRange, b: TimeRange): number => a.compareTo(b);

const SEPARATOR = ',';
const SEPARATOR_OPTIONAL = ';';

export class Day {
  private readonly _ranges: TimeRangeChain;
  private readonly _number: WeekDays | null;
  private readonly _date: Date | null;

  constructor();
  constructor(value: string, numberOrDate?: WeekDays | Date);
  constructor(value: TimeRange[], numberOrDate?: WeekDays | Date);
  constructor(value: string[], numberOrDate?: WeekDays | Date);
  constructor(value: Array<string | TimeRange>, numberOrDate?: WeekDays | Date);
  constructor(value: DayParsable | null, numberOrDate?: WeekDays | Date);
  constructor(value: Day, numberOrDate?: WeekDays | Date);
  constructor(
    value?: string | DayParsable | Day | TimeRange[] | string[] | Array<string | TimeRange> | null,
    numberOrDate?: WeekDays | Date,
  ) {
    const date = numberOrDate instanceof Date ? new Date(numberOrDate.setHours(0, 0, 0, 0)) : null;
    const number = numberOrDate instanceof Date ? numberOrDate.getDay() : numberOrDate ?? null;

    if (value == null) {
      this._number = number;
      this._date = date;
      this._ranges = new TimeRangeChain();
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
      this._ranges = new TimeRangeChain(value);

      return;
    }

    const parsed = typeof value === 'string' ? Day.parse(value, number ?? undefined) : value;

    this._number = number ?? parsed.number ?? null;
    this._date = date ?? parsed.date ?? null;
    this._ranges =
      parsed.ranges != null
        ? new TimeRangeChain(parsed.ranges.map((r) => new TimeRange(r)))
        : new TimeRangeChain();
  }

  /**
   * Create a `Day` with constant `Range`s duration
   * @param timeSlot the constant `Range` duration
   * @param range the time `Range`
   */
  static slottable(timeSlot: number, range: string | TimeRange): string {
    const timeRangeChain = new TimeRangeChain(TimeRangeChain.slottable(timeSlot, range));
    return new Day(timeRangeChain.chain).toString();
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
      .map((rangeRaw) => new TimeRange(rangeRaw))
      .sort(compareRanges)
      .map((r) => r.toJSON());

    return {
      date,
      ranges,
      number: date?.getDay() ?? index ?? null,
    };
  }

  toString(): string {
    const rangesString = this._ranges.toString();

    if (this._date != null) {
      return `${this._date.toISOString()}${SEPARATOR_OPTIONAL}${rangesString}`;
    }

    return rangesString;
  }

  toDate(): Array<[Date, Date]> {
    return this._ranges.chain.map((r) => r.toDate(this._date ?? undefined));
  }

  toJSON(): DaySerializable {
    return {
      date: this._date,
      number: this._number,
      ranges: this._ranges.toJSON(),
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

  get ranges(): TimeRangeChain {
    return this._ranges;
  }
}
