import { TimeRange, RangeSerie } from '../primitives';
import { DatedDaySerializable, DatedDaySlottableOptions } from '../types';
import { WeekRangerError } from '../errors';

export class DatedDay extends RangeSerie {
  private readonly _date: Date;

  get date(): Date {
    return this._date;
  }

  constructor(value: Date);
  constructor(value: string, date?: Date);
  constructor(value: TimeRange[], date: Date);
  constructor(value: string[], date: Date);
  constructor(value: Array<string | TimeRange>, date: Date);
  constructor(value: DatedDaySerializable, date?: Date);
  constructor(value: DatedDay, date?: Date);
  constructor(
    value:
      | string
      | DatedDaySerializable
      | DatedDay
      | TimeRange[]
      | string[]
      | Array<string | TimeRange>
      | Date,
    date?: Date,
  ) {
    if (value instanceof Date) {
      super(new RangeSerie());
      this._date = value;
      return;
    }

    if (value instanceof DatedDay) {
      super(value);
      this._date = date ?? value._date;

      return;
    }

    if (Array.isArray(value)) {
      super(new RangeSerie(value));
      this._date = date = new Date();

      return;
    }

    const parsed = typeof value === 'string' ? DatedDay.parse(value, date ?? undefined) : value;
    const ranges =
      parsed.ranges != null
        ? new RangeSerie(parsed.ranges.map((r) => new TimeRange(r)))
        : new RangeSerie();

    super(ranges);
    this._date = date ?? parsed.date ?? new Date();
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
    options: DatedDaySlottableOptions = {},
  ): DatedDay {
    const { date = new Date() } = options;
    const timeRangeChain = new RangeSerie(RangeSerie.slottable(timeSlot, range, options));
    return new DatedDay(timeRangeChain.serie, date);
  }

  static parse(value: string, date?: Date | null): DatedDaySerializable {
    if (!value.includes(SEPARATOR) && value.length === 0) {
      throw new WeekRangerError(value, 'Day');
    }

    const splitValue = value.split(SEPARATOR);

    const [isoDate, rawRanges] = splitValue;

    let dayDate = new Date(isoDate);
    if (date != null) dayDate = date;

    const ranges = new RangeSerie(rawRanges).toJSON();

    return { ...ranges, date: dayDate };
  }

  private formatString(date: string, ranges: string): string {
    return `${date}${SEPARATOR}${ranges}`;
  }

  toString(): string {
    return this.formatString(this._date.toString(), super.toString());
  }

  toLocaleString(): string {
    return this.formatString(this._date.toLocaleString(), this.toLocaleString());
  }

  toDate(date?: Date): Array<[Date, Date]> {
    return this.serie.map((r) => r.toDate(date));
  }

  toJSON(): DatedDaySerializable {
    return {
      ...super.toJSON(),
      date: this._date,
    };
  }

  compareTo(that: DatedDay): number {
    return this._date.getUTCDay() - that._date.getUTCDay();
  }

  isAfter(that: DatedDay): boolean {
    return this.compareTo(that) > 0;
  }

  equals(that: DatedDay): boolean {
    return this.toString() === that.toString();
  }

  startOfDay(): Date {
    const start = this._date.setUTCHours(0, 0, 0, 0);
    return new Date(start);
  }

  endOfDay(): Date {
    const end = this._date.setUTCHours(23, 59, 59, 999);
    return new Date(end);
  }
}

const SEPARATOR = ';';
