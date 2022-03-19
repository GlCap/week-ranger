import { TimeRange, RangeSerie } from '../primitives';
import { DatedDaySerializable } from '../types';
import { WeekRangerError } from '../errors';

export class DatedDay {
  private readonly _ranges: RangeSerie;
  private readonly _date: Date;

  get date(): Date {
    return this._date;
  }

  get ranges(): RangeSerie {
    return this._ranges;
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
      this._date = value;
      this._ranges = new RangeSerie();
      return;
    }

    if (value instanceof DatedDay) {
      this._date = date ?? value._date;
      this._ranges = value._ranges;
      return;
    }

    if (Array.isArray(value)) {
      this._date = date = new Date();
      this._ranges = new RangeSerie(value);

      return;
    }

    const parsed = typeof value === 'string' ? DatedDay.parse(value, date ?? undefined) : value;

    this._date = date ?? parsed.date ?? new Date();
    this._ranges =
      parsed.ranges != null
        ? new RangeSerie(parsed.ranges.map((r) => new TimeRange(r)))
        : new RangeSerie();
  }

  /**
   * Create a `Day` with constant `Range`s duration
   * @param timeSlot the constant `Range` duration
   * @param range the time `Range`
   * @param date the date if the day
   */
  static slottable(timeSlot: number, range: string | TimeRange, date: Date): DatedDay {
    const timeRangeChain = new RangeSerie(RangeSerie.slottable(timeSlot, range));
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

    return { ranges, date: dayDate };
  }

  private formatString(date: string, ranges: string): string {
    return `${date}${SEPARATOR}${ranges}`;
  }

  toString(): string {
    return this.formatString(this._date.toString(), this._ranges.toString());
  }

  toLocaleString(): string {
    return this.formatString(this._date.toLocaleString(), this._ranges.toLocaleString());
  }

  toDate(date?: Date): Array<[Date, Date]> {
    return this._ranges.serie.map((r) => r.toDate(date));
  }

  toJSON(): DatedDaySerializable {
    return {
      date: this._date,
      ranges: this._ranges.toJSON(),
    };
  }

  compareTo(that: DatedDay): number {
    return this._date.getDay() - that._date.getDay();
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
