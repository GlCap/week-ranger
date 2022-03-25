import { DateTime } from 'luxon';

import { WeekRangerError } from './errors';
import { WEEK_DAYS } from './utils';
import { RangeSerie } from './RangeSerie';
import { TimeRange } from './TimeRange';
import { WeekDays } from './enums';
import type {
  DayFromStringOptions,
  DayParsable,
  DaySerializable,
  DaySlottableOptions,
  DayToStringOptions,
  RangeSerieSerializable,
  TimeRangeSerializable,
} from './types';

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

  static fromString(
    value: string,
    options: DayFromStringOptions = { requireDayOfWeekPrefix: true },
  ): Day {
    if (!value.includes(SEPARATOR) && value.length === 0) {
      throw new WeekRangerError(value, 'Day');
    }
    let range;
    let dayOfWeek = options?.dayOfWeek;

    const splitValue = value.split(SEPARATOR);

    if (splitValue.length === 2) {
      const [rawDayOfWeek, rawRanges] = splitValue;

      dayOfWeek = dayOfWeek != null ? dayOfWeek : Number.parseInt(rawDayOfWeek, 10);

      if (!WEEK_DAYS.includes(dayOfWeek)) {
        throw new WeekRangerError(value, 'Day');
      }

      range = RangeSerie.fromString(rawRanges, options).toJSON();

      return new Day({ ...range, dayOfWeek });
    }

    if (options.requireDayOfWeekPrefix != null && options.requireDayOfWeekPrefix) {
      throw new WeekRangerError(value, 'Day');
    }

    range = RangeSerie.fromString(value, options).toJSON();

    return new Day({ ...range, dayOfWeek });
  }

  private formatString(day: string | number, ranges: string): string {
    return `${day}${SEPARATOR}${ranges}`;
  }

  toString(options: DayToStringOptions = {}): string {
    const { includeDay = true } = options;
    if (!includeDay) return super.toString();
    return this.formatString(this._dayOfWeek, super.toString(options));
  }

  toLocaleString(options: DayToStringOptions = {}): string {
    const { includeDay = true } = options;
    if (!includeDay) return super.toString();
    return this.formatString(this._dayOfWeek, super.toLocaleString(options));
  }

  toDate(date = new Date()): Array<[Date, Date]> {
    return this.toArray().map((r) => r.toDate(date));
  }

  toDateTime(from = DateTime.utc()): Array<[DateTime, DateTime]> {
    return this.toArray().map((r) => r.toDateTime(from));
  }

  toJSON(): DaySerializable {
    return {
      ...super.toJSON(),
      dayOfWeek: this._dayOfWeek,
    };
  }

  compareTo(that: Day): number {
    if (this._dayOfWeek != null && that._dayOfWeek != null) {
      return this._dayOfWeek - that._dayOfWeek;
    }

    return 0;
  }

  isAfter(that: Day): boolean {
    return this.compareTo(that) > 0;
  }

  equals(that: Day): boolean {
    return this.toString() === that.toString();
  }
}

const SEPARATOR = ';';
