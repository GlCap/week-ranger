import { Day } from './Day';
import {
  TimeRangeSerializable,
  WeekDays,
  WeekParsable,
  WeekSerializable,
  WeekTuple,
} from '../types';
import { WeekRangerError } from '../errors';
import { WEEK_DAYS, WEEK_DAYS_LABEL } from '../utils';
import { RangeSerie } from '../primitives/RangeSerie';

export class Week extends Map<WeekDays, RangeSerie> {
  get today(): Day {
    const todayDate = new Date().getUTCDay();
    return this.getDay(todayDate);
  }

  get monday(): Day {
    return this.getDay(WeekDays.monday);
  }

  get tuesday(): Day {
    return this.getDay(WeekDays.tuesday);
  }

  get wednesday(): Day {
    return this.getDay(WeekDays.wednesday);
  }

  get thursday(): Day {
    return this.getDay(WeekDays.thursday);
  }

  get friday(): Day {
    return this.getDay(WeekDays.friday);
  }

  get saturday(): Day {
    return this.getDay(WeekDays.saturday);
  }

  get sunday(): Day {
    return this.getDay(WeekDays.sunday);
  }

  constructor(value: string);
  constructor(value: RangeSerie);
  constructor(value: WeekParsable);
  constructor(value: Week);
  constructor(value: string | RangeSerie | WeekParsable | Week) {
    if (value instanceof RangeSerie) {
      const map = new Map(WEEK_DAYS.map((d) => [d, new RangeSerie(value)]));
      super(map);
      return;
    }

    if (value instanceof Week) {
      super(new Map(value));
      return;
    }

    const parsed = typeof value === 'string' ? Week.parse(value) : value;

    const temp = WEEK_DAYS_LABEL.map<[WeekDays, RangeSerie]>((l) => {
      const number = WeekDays[l];
      const parsableDay = parsed[l] ?? new RangeSerie([]).toJSON().ranges;
      return [number, new RangeSerie(parsableDay)];
    });

    super(new Map(temp));
  }

  static parse(value: string): WeekSerializable {
    if (value.length === 0) {
      throw new WeekRangerError(value, 'Week');
    }

    const rawWeek = value.split(SEPARATOR);

    if (rawWeek.length > 7 || rawWeek.length < 1) {
      throw new WeekRangerError(value, 'Week');
    }

    return rawWeek.reduce(
      (acc, curr, index) => {
        const isNotEmpty = curr.length !== 0;
        if (index === WeekDays.sunday && isNotEmpty) acc.sunday = RangeSerie.parse(curr).ranges;
        if (index === WeekDays.monday && isNotEmpty) acc.monday = RangeSerie.parse(curr).ranges;
        if (index === WeekDays.tuesday && isNotEmpty) acc.tuesday = RangeSerie.parse(curr).ranges;
        if (index === WeekDays.wednesday && isNotEmpty)
          acc.wednesday = RangeSerie.parse(curr).ranges;
        if (index === WeekDays.thursday && isNotEmpty) acc.thursday = RangeSerie.parse(curr).ranges;
        if (index === WeekDays.friday && isNotEmpty) acc.friday = RangeSerie.parse(curr).ranges;
        if (index === WeekDays.saturday && isNotEmpty) acc.saturday = RangeSerie.parse(curr).ranges;

        return acc;
      },
      { ...initialWeek },
    );
  }

  toTuple(): WeekTuple {
    return [
      this.get(WeekDays.sunday) ?? null,
      this.get(WeekDays.monday) ?? null,
      this.get(WeekDays.tuesday) ?? null,
      this.get(WeekDays.wednesday) ?? null,
      this.get(WeekDays.thursday) ?? null,
      this.get(WeekDays.friday) ?? null,
      this.get(WeekDays.saturday) ?? null,
    ];
  }

  toString(): string {
    return this.toTuple()
      .map((d) => d?.toString() ?? '')
      .join(SEPARATOR);
  }

  toLocaleString(): string {
    return this.toTuple()
      .map((d) => d?.toLocaleString() ?? '')
      .join(SEPARATOR);
  }

  toJSON(): WeekSerializable {
    return {
      sunday: this.getDay(WeekDays.sunday).toJSON().ranges,
      monday: this.getDay(WeekDays.monday).toJSON().ranges,
      tuesday: this.getDay(WeekDays.tuesday).toJSON().ranges,
      wednesday: this.getDay(WeekDays.wednesday).toJSON().ranges,
      thursday: this.getDay(WeekDays.thursday).toJSON().ranges,
      friday: this.getDay(WeekDays.friday).toJSON().ranges,
      saturday: this.getDay(WeekDays.saturday).toJSON().ranges,
    };
  }

  equals(that: Week): boolean {
    return this.toString() === that.toString();
  }

  getDay(number: WeekDays): Day {
    const rangeSerie = this.get(number);

    if (rangeSerie == null) {
      const temp = new RangeSerie([]);
      this.set(number, temp);
      return new Day(temp, number);
    }

    return new Day(rangeSerie, number);
  }

  setDay(number: WeekDays, value: Day | RangeSerie): this {
    return this.set(number, value);
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
