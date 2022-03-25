import { DateTime } from 'luxon';

import { Day } from './Day';
import { WeekRangerError } from './errors';
import { WEEK_DAYS_LABEL } from './utils';
import { RangeSerie } from './RangeSerie';
import { WeekDays } from './enums';
import type {
  TimeRangeSerializable,
  WeekFromStringOptions,
  WeekParsable,
  WeekSerializable,
  WeekToStringOptions,
  WeekTuple,
  WeekTupleDate,
  WeekTupleDateTime,
} from './types';

export class Week extends Map<WeekDays, Day> {
  get today(): Day {
    const todayDate = new Date().getUTCDay();
    return this.get(todayDate);
  }

  get monday(): Day {
    return this.get(WeekDays.monday);
  }

  get tuesday(): Day {
    return this.get(WeekDays.tuesday);
  }

  get wednesday(): Day {
    return this.get(WeekDays.wednesday);
  }

  get thursday(): Day {
    return this.get(WeekDays.thursday);
  }

  get friday(): Day {
    return this.get(WeekDays.friday);
  }

  get saturday(): Day {
    return this.get(WeekDays.saturday);
  }

  get sunday(): Day {
    return this.get(WeekDays.sunday);
  }

  constructor(value: Week);
  constructor(value: WeekParsable);
  constructor(value: WeekParsable | Week) {
    if (value instanceof Week) {
      super(new Map(value));
      return;
    }

    const temp = WEEK_DAYS_LABEL.map((item) => {
      const dayOfWeek = WeekDays[item];
      const ranges = value[item] ?? [];
      const day = Day.fromRange(new RangeSerie({ ranges }), dayOfWeek);

      return [dayOfWeek, day] as const;
    });

    super(new Map(temp));
  }

  static fromDay(value: Day): Week {
    return new Week({
      sunday: value.toJSON().ranges,
      monday: value.toJSON().ranges,
      tuesday: value.toJSON().ranges,
      wednesday: value.toJSON().ranges,
      thursday: value.toJSON().ranges,
      friday: value.toJSON().ranges,
      saturday: value.toJSON().ranges,
    });
  }

  static fromRange(value: RangeSerie): Week {
    return new Week({
      sunday: value.toJSON().ranges,
      monday: value.toJSON().ranges,
      tuesday: value.toJSON().ranges,
      wednesday: value.toJSON().ranges,
      thursday: value.toJSON().ranges,
      friday: value.toJSON().ranges,
      saturday: value.toJSON().ranges,
    });
  }

  static fromString(value: string, options?: WeekFromStringOptions): Week {
    if (value.length === 0) {
      throw new WeekRangerError(value, 'Week');
    }

    const rawWeek = value.split(SEPARATOR);

    if (rawWeek.length > 7 || rawWeek.length < 1) {
      throw new WeekRangerError(value, 'Week');
    }

    return new Week(this.createWeekFromString(rawWeek, options));
  }

  private static createWeekFromString(
    rawWeek: string[],
    options?: WeekFromStringOptions,
  ): WeekSerializable {
    const weekDaysKeys = Object.keys(WeekDays) as Array<keyof typeof WeekDays>;

    const raw = rawWeek.reduce(
      (acc, curr, index) => {
        const weekDay = weekDaysKeys.find((item) => index === WeekDays[item]);

        if (curr.length > 0 && weekDay != null) {
          const day = Day.fromString(curr, {
            ...options,
            dayOfWeek: index,
            requireDayOfWeekPrefix: false,
          });

          acc[weekDay] = day.toArray();
        }

        return acc;
      },
      { ...initialWeek },
    );

    return raw;
  }

  toTuple(): WeekTuple {
    return [
      this.get(WeekDays.sunday),
      this.get(WeekDays.monday),
      this.get(WeekDays.tuesday),
      this.get(WeekDays.wednesday),
      this.get(WeekDays.thursday),
      this.get(WeekDays.friday),
      this.get(WeekDays.saturday),
    ];
  }

  toDateTuple(from = new Date()): WeekTupleDate {
    return [
      this.get(WeekDays.sunday).toDate(from),
      this.get(WeekDays.monday).toDate(from),
      this.get(WeekDays.tuesday).toDate(from),
      this.get(WeekDays.wednesday).toDate(from),
      this.get(WeekDays.thursday).toDate(from),
      this.get(WeekDays.friday).toDate(from),
      this.get(WeekDays.saturday).toDate(from),
    ];
  }

  toDateTimeTuple(from = DateTime.utc()): WeekTupleDateTime {
    return [
      this.get(WeekDays.sunday).toDateTime(from),
      this.get(WeekDays.monday).toDateTime(from),
      this.get(WeekDays.tuesday).toDateTime(from),
      this.get(WeekDays.wednesday).toDateTime(from),
      this.get(WeekDays.thursday).toDateTime(from),
      this.get(WeekDays.friday).toDateTime(from),
      this.get(WeekDays.saturday).toDateTime(from),
    ];
  }

  toString(options?: WeekToStringOptions): string {
    return this.toTuple()
      .map((day) => day.toString({ ...options, includeDay: false }))
      .join(SEPARATOR);
  }

  toLocaleString(options?: WeekToStringOptions): string {
    return this.toTuple()
      .map((day) => day.toLocaleString({ ...options, includeDay: false }))
      .join(SEPARATOR);
  }

  toJSON(): WeekSerializable {
    return {
      sunday: this.get(WeekDays.sunday).toJSON().ranges,
      monday: this.get(WeekDays.monday).toJSON().ranges,
      tuesday: this.get(WeekDays.tuesday).toJSON().ranges,
      wednesday: this.get(WeekDays.wednesday).toJSON().ranges,
      thursday: this.get(WeekDays.thursday).toJSON().ranges,
      friday: this.get(WeekDays.friday).toJSON().ranges,
      saturday: this.get(WeekDays.saturday).toJSON().ranges,
    };
  }

  equals(that: Week): boolean {
    return this.toString() === that.toString();
  }

  get(key: WeekDays): Day {
    const value = super.get(key);

    if (value == null) {
      const day = Day.fromRange(new RangeSerie(), key);

      super.set(key, day);

      return day;
    }

    return value;
  }

  set(key: WeekDays, day: Day): this {
    const d = new Day({ ranges: day.toArray(), dayOfWeek: key });

    return super.set(key, d);
  }
}

const SEPARATOR = '\n';

const initialDay: TimeRangeSerializable[] = [];

const initialWeek: WeekSerializable = Object.freeze({
  monday: initialDay,
  tuesday: initialDay,
  wednesday: initialDay,
  thursday: initialDay,
  friday: initialDay,
  saturday: initialDay,
  sunday: initialDay,
});
