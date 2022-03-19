import { TimeRange, RangeSerie } from '../primitives';
import { DayParsable, DaySerializable, DaySlottableOptions, WeekDays } from '../types';
import { WeekRangerError } from '../errors';
import { WEEK_DAYS } from '../utils';

export class Day extends RangeSerie {
  private readonly _number: WeekDays;

  get number(): WeekDays {
    return this._number;
  }

  constructor(value: WeekDays);
  constructor(value: string, number?: WeekDays);
  constructor(value: TimeRange[], number: WeekDays);
  constructor(value: string[], number: WeekDays);
  constructor(value: Array<string | TimeRange>, number: WeekDays);
  constructor(value: DayParsable, number?: WeekDays);
  constructor(value: Day, number?: WeekDays);
  constructor(
    value:
      | string
      | DayParsable
      | Day
      | TimeRange[]
      | string[]
      | Array<string | TimeRange>
      | WeekDays,
    number?: WeekDays,
  ) {
    if (typeof value === 'number') {
      super(new RangeSerie());
      this._number = value;
      return;
    }

    if (value instanceof Day) {
      super(value);
      this._number = number ?? value._number;

      return;
    }

    if (Array.isArray(value)) {
      super(new RangeSerie(value));
      this._number = number ?? 0;

      return;
    }

    const parsed = typeof value === 'string' ? Day.parse(value, number ?? undefined) : value;

    const ranges =
      parsed.ranges != null
        ? new RangeSerie(parsed.ranges.map((r) => new TimeRange(r)))
        : new RangeSerie();

    super(ranges);
    this._number = number ?? parsed.number ?? 0;
  }

  /**
   * Create a `Day` with constant `Range`s duration
   * @param timeSlot the constant `Range` duration
   * @param range the time `Range`
   * @param options extra optional options
   */
  static slottable(
    timeSlot: number,
    range: string | TimeRange,
    options: DaySlottableOptions = {},
  ): Day {
    const { number = WeekDays.monday } = options;
    const timeRangeChain = new RangeSerie(RangeSerie.slottable(timeSlot, range, options));
    return new Day(timeRangeChain.serie, number);
  }

  static parse(value: string, number?: WeekDays | null): DaySerializable {
    if (
      (!value.includes(SEPARATOR) && value.length === 0) ||
      (number != null && !WEEK_DAYS.includes(number))
    ) {
      throw new WeekRangerError(value, 'Day');
    }

    const splitValue = value.split(SEPARATOR);

    const [rawDayNumber, rawRanges] = splitValue;

    let dayNumber = Number.parseInt(rawDayNumber, 10);
    if (number != null) dayNumber = number;

    if (!WEEK_DAYS.includes(dayNumber)) throw new WeekRangerError(value, 'Day');

    const rangeSerie = new RangeSerie(rawRanges).toJSON();

    return { ...rangeSerie, number: dayNumber };
  }

  private formatString(day: string | number, ranges: string): string {
    return `${day}${SEPARATOR}${ranges}`;
  }

  toString(): string {
    return this.formatString(this._number, super.toString());
  }

  toLocaleString(): string {
    return this.formatString(this._number, super.toLocaleString());
  }

  toDate(date?: Date): Array<[Date, Date]> {
    return this.serie.map((r) => r.toDate(date));
  }

  toJSON(): DaySerializable {
    return {
      ...super.toJSON(),
      number: this._number,
    };
  }

  compareTo(that: Day): number {
    if (this._number != null && that._number != null) return this._number - that._number;
    return this.size - this.size;
  }

  isAfter(that: Day): boolean {
    return this.compareTo(that) > 0;
  }

  equals(that: Day): boolean {
    return this.toString() === that.toString();
  }
}

const SEPARATOR = ';';
