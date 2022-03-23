import {
  DayParsable,
  DaySerializable,
  DaySlottableOptions,
  RangeSerieSerializable,
  TimeRangeSerializable,
  WeekDays,
} from './types';
import { WeekRangerError } from './errors';
import { WEEK_DAYS } from './utils';
import { DateTime } from 'luxon';
import { RangeSerie } from './RangeSerie';
import { TimeRange } from './TimeRange';

export class Day extends RangeSerie {
  private readonly _dayOfWeek: WeekDays;

  get dayOfWeek(): WeekDays {
    return this._dayOfWeek;
  }

  constructor(dayOfWeek?: WeekDays);
  constructor(value: Day, dayOfWeek?: WeekDays);
  constructor(value: DayParsable, dayOfWeek?: WeekDays);
  constructor(value?: Day | DayParsable | WeekDays | null, dayOfWeek?: WeekDays) {
    if (value == null) {
      super();
      this._dayOfWeek = 0;
      return;
    }

    if (typeof value === 'number') {
      super();
      this._dayOfWeek = value;
      return;
    }

    if (value instanceof Day) {
      super(value);
      this._dayOfWeek = dayOfWeek ?? value._dayOfWeek;
      return;
    }

    const ranges =
      value.ranges != null ? RangeSerie.fromArray(value.ranges.map((r) => new TimeRange(r))) : null;

    super(ranges);
    this._dayOfWeek = value.dayOfWeek ?? dayOfWeek ?? 0;
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
    const { dayOfWeek = WeekDays.monday } = options;
    const rangeSerie = new RangeSerie(RangeSerie.slottable(timeSlot, range, options));
    return Day.fromRange(rangeSerie, dayOfWeek);
  }

  static fromArray(
    value:
      | string[]
      | TimeRange[]
      | TimeRangeSerializable[]
      | RangeSerieSerializable
      | Array<string | TimeRange | TimeRangeSerializable>,
  ): Day {
    return Day.fromRange(RangeSerie.fromArray(value), 0);
  }

  static fromRange(value: RangeSerie, dayOfWeek: WeekDays): Day {
    return new Day({
      ranges: value.toJSON().ranges,
      dayOfWeek,
    });
  }

  static fromString(value: string, number?: WeekDays | null): Day {
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

    const rangeSerie = RangeSerie.fromString(rawRanges).toJSON();

    return new Day({ ...rangeSerie, dayOfWeek: dayNumber });
  }

  private formatString(day: string | number, ranges: string): string {
    return `${day}${SEPARATOR}${ranges}`;
  }

  toString(includeDay: boolean = true): string {
    if (!includeDay) return super.toString();
    return this.formatString(this._dayOfWeek, super.toString());
  }

  toLocaleString(includeDay: boolean = true): string {
    if (!includeDay) return super.toString();
    return this.formatString(this._dayOfWeek, super.toLocaleString());
  }

  toDate(date = new Date()): Array<[Date, Date]> {
    return this.toArray().map((r) => r.toDate(date));
  }

  toDateTime(from = DateTime.now()): Array<[DateTime, DateTime]> {
    return this.toArray().map((r) => r.toDateTime(from));
  }

  toJSON(): DaySerializable {
    return {
      ...super.toJSON(),
      dayOfWeek: this._dayOfWeek,
    };
  }

  compareTo(that: Day): number {
    if (this._dayOfWeek != null && that._dayOfWeek != null)
      return this._dayOfWeek - that._dayOfWeek;
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
