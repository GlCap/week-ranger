import { TimeRange, RangeSerie } from '../primitives';
import { DatedDaySerializable } from '../types';
import { WeekRangerError } from '../errors';

const SEPARATOR = ';';

export class DatedDay {
  private readonly _ranges: RangeSerie;
  private readonly _date: Date;

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
   * @param number the 0 indexed day of week
   */
  static slottable(timeSlot: number, range: string | TimeRange, date: Date): string {
    const timeRangeChain = new RangeSerie(RangeSerie.slottable(timeSlot, range));
    return new DatedDay(timeRangeChain.serie, date).toString();
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

  toString(): string {
    const rangesString = this._ranges.toString();

    return `${this._date.toString()}${SEPARATOR}${rangesString}`;
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
    const start = this._date.setHours(0, 0, 0, 0);
    return new Date(start);
  }

  endOfDay(): Date {
    const end = this._date.setHours(23, 59, 59, 999);
    return new Date(end);
  }

  get date(): Date {
    return this._date;
  }

  get ranges(): RangeSerie {
    return this._ranges;
  }
}
