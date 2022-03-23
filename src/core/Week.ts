import { Day } from './Day';
import {
  TimeRangeSerializable,
  WeekDays,
  WeekParsable,
  WeekSerializable,
  WeekTuple,
  WeekTupleDate,
} from '../types';
import { WeekRangerError } from '../errors';
import { WEEK_DAYS_LABEL } from '../utils';
import { RangeSerie } from '../primitives/RangeSerie';

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

  static fromString(value: string): Week {
    if (value.length === 0) {
      throw new WeekRangerError(value, 'Week');
    }

    const rawWeek = value.split(SEPARATOR);

    if (rawWeek.length > 7 || rawWeek.length < 1) {
      throw new WeekRangerError(value, 'Week');
    }

    const weekDaysKeys = Object.keys(WeekDays) as Array<keyof typeof WeekDays>;
    const raw = rawWeek.reduce(
      (acc, curr, index) => {
        const day = weekDaysKeys.find((item) => index === WeekDays[item]);

        if (curr.length > 0 && day != null) {
          const rangeSerie = RangeSerie.fromString(curr);

          acc[day] = rangeSerie.toArray();
        }

        return acc;
      },
      { ...initialWeek },
    );

    return new Week(raw);
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

  toDateTuple(date = new Date()): WeekTupleDate {
    return [
      this.get(WeekDays.sunday).toDate(date),
      this.get(WeekDays.monday).toDate(date),
      this.get(WeekDays.tuesday).toDate(date),
      this.get(WeekDays.wednesday).toDate(date),
      this.get(WeekDays.thursday).toDate(date),
      this.get(WeekDays.friday).toDate(date),
      this.get(WeekDays.saturday).toDate(date),
    ];
  }

  toString(): string {
    return this.toTuple()
      .map((day) => day.toString(false))
      .join(SEPARATOR);
  }

  toLocaleString(): string {
    return this.toTuple()
      .map((day) => day.toLocaleString(false))
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

      this.set(key, day);

      return day;
    }

    return value;
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
