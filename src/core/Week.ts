import { Day } from './Day';
import { TimeRangeSerializable, WeekDays, WeekParsable, WeekSerializable } from '../types';
import { WeekRangerError } from '../errors';
import { WEEK_DAYS, WEEK_DAYS_LABEL } from '../utils';
import { RangeSerie } from '../primitives/RangeSerie';

const SEPARATOR = '\n';

export type WeekTuple = [
  sunday: RangeSerie | null,
  monday: RangeSerie | null,
  tuesday: RangeSerie | null,
  wednesday: RangeSerie | null,
  thursday: RangeSerie | null,
  friday: RangeSerie | null,
  saturday: RangeSerie | null,
];

const initialDay: TimeRangeSerializable[] = [];

const initialWeek: WeekSerializable = {
  monday: initialDay,
  tuesday: initialDay,
  wednesday: initialDay,
  thursday: initialDay,
  friday: initialDay,
  saturday: initialDay,
  sunday: initialDay,
};

export class Week {
  private readonly _weekMap: Map<WeekDays, RangeSerie>;

  constructor(value: string);
  constructor(value: RangeSerie);
  constructor(value: WeekParsable);
  constructor(value: Week);
  constructor(value: string | RangeSerie | WeekParsable | Week) {
    if (value instanceof RangeSerie) {
      this._weekMap = new Map(WEEK_DAYS.map((d) => [d, new RangeSerie(value)]));
      return;
    }

    if (value instanceof Week) {
      this._weekMap = new Map(value._weekMap);
      return;
    }

    const parsed = typeof value === 'string' ? Week.parse(value) : value;

    const temp = WEEK_DAYS_LABEL.map<[WeekDays, RangeSerie]>((l) => {
      const number = WeekDays[l];
      const parsableDay = parsed[l] ?? new RangeSerie([]).toJSON();
      return [number, new RangeSerie(parsableDay)];
    });

    this._weekMap = new Map(temp);
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
        if (index === WeekDays.sunday && isNotEmpty) acc.sunday = RangeSerie.parse(curr);
        if (index === WeekDays.monday && isNotEmpty) acc.monday = RangeSerie.parse(curr);
        if (index === WeekDays.tuesday && isNotEmpty) acc.tuesday = RangeSerie.parse(curr);
        if (index === WeekDays.wednesday && isNotEmpty) acc.wednesday = RangeSerie.parse(curr);
        if (index === WeekDays.thursday && isNotEmpty) acc.thursday = RangeSerie.parse(curr);
        if (index === WeekDays.friday && isNotEmpty) acc.friday = RangeSerie.parse(curr);
        if (index === WeekDays.saturday && isNotEmpty) acc.saturday = RangeSerie.parse(curr);

        return acc;
      },
      { ...initialWeek },
    );
  }

  toTuple(): WeekTuple {
    return [
      this._weekMap.get(WeekDays.sunday) ?? null,
      this._weekMap.get(WeekDays.monday) ?? null,
      this._weekMap.get(WeekDays.tuesday) ?? null,
      this._weekMap.get(WeekDays.wednesday) ?? null,
      this._weekMap.get(WeekDays.thursday) ?? null,
      this._weekMap.get(WeekDays.friday) ?? null,
      this._weekMap.get(WeekDays.saturday) ?? null,
    ];
  }

  toString(): string {
    return this.toTuple()
      .map((d) => d?.toString() ?? '')
      .join(SEPARATOR);
  }

  toJSON(): WeekSerializable {
    return {
      sunday: this.getDay(WeekDays.sunday).ranges.toJSON(),
      monday: this.getDay(WeekDays.monday).ranges.toJSON(),
      tuesday: this.getDay(WeekDays.tuesday).ranges.toJSON(),
      wednesday: this.getDay(WeekDays.wednesday).ranges.toJSON(),
      thursday: this.getDay(WeekDays.thursday).ranges.toJSON(),
      friday: this.getDay(WeekDays.friday).ranges.toJSON(),
      saturday: this.getDay(WeekDays.saturday).ranges.toJSON(),
    };
  }

  equals(that: Week): boolean {
    return this.toString() === that.toString();
  }

  getDay(number: WeekDays): Day {
    const rangeSerie = this._weekMap.get(number);

    if (rangeSerie == null) {
      const temp = new RangeSerie([]);
      this._weekMap.set(number, temp);
      return new Day(temp.serie, number);
    }

    return new Day(rangeSerie.serie, number);
  }

  setDay(serie: RangeSerie, number: WeekDays): RangeSerie {
    this._weekMap.set(number, serie);

    return serie;
  }

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
}
