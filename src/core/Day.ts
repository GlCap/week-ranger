import { TimeRange, RangeSerie } from '../primitives';
import { DayParsable, DaySerializable, WeekDays } from '../types';
import { WeekRangerError } from '../errors';
import { WEEK_DAYS } from '../utils';

const SEPARATOR = ';';

export class Day {
  private readonly _ranges: RangeSerie;
  private readonly _number: WeekDays;

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
      this._number = value;
      this._ranges = new RangeSerie();
      return;
    }

    if (value instanceof Day) {
      this._number = number ?? value._number;
      this._ranges = value._ranges;
      return;
    }

    if (Array.isArray(value)) {
      this._number = number ?? 0;
      this._ranges = new RangeSerie(value);

      return;
    }

    const parsed = typeof value === 'string' ? Day.parse(value, number ?? undefined) : value;

    this._number = number ?? parsed.number ?? 0;
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
  static slottable(
    timeSlot: number,
    range: string | TimeRange,
    number: WeekDays = WeekDays.monday,
  ): string {
    const timeRangeChain = new RangeSerie(RangeSerie.slottable(timeSlot, range));
    return new Day(timeRangeChain.serie, number).toString();
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

    const ranges = new RangeSerie(rawRanges).toJSON();

    return { ranges, number: dayNumber };
  }

  toString(): string {
    const rangesString = this._ranges.toString();

    return `${this._number}${SEPARATOR}${rangesString}`;
  }

  toDate(date?: Date): Array<[Date, Date]> {
    return this._ranges.serie.map((r) => r.toDate(date));
  }

  toJSON(): DaySerializable {
    return {
      number: this._number,
      ranges: this._ranges.toJSON(),
    };
  }

  compareTo(that: Day): number {
    if (this._number != null && that._number != null) return this._number - that._number;
    return this._ranges.size - that._ranges.size;
  }

  isAfter(that: Day): boolean {
    return this.compareTo(that) > 0;
  }

  equals(that: Day): boolean {
    return this.toString() === that.toString();
  }

  get number(): WeekDays {
    return this._number;
  }

  get ranges(): RangeSerie {
    return this._ranges;
  }
}
