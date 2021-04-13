import { Day } from './Day';
import { DaySerializable, WeekDays, WeekSerializable } from '../types';
import { WeekRangerError } from '../errors';
import { WEEK_DAYS, WEEK_DAYS_LABEL } from '../utils';

const SEPARATOR = '\n';

export type WeekTuple = [
  sunday: Day | null,
  monday: Day | null,
  tuesday: Day | null,
  wednesday: Day | null,
  thursday: Day | null,
  friday: Day | null,
  saturday: Day | null,
];

const initialDay: DaySerializable = { date: null, ranges: [], number: null };

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
  private readonly _weekMap: ReadonlyMap<WeekDays, Day>;

  constructor(value: string);
  constructor(value: Day);
  constructor(value: WeekSerializable);
  constructor(value: Week);
  constructor(value: string | Day | WeekSerializable | Week) {
    if (value instanceof Day) {
      this._weekMap = new Map(WEEK_DAYS.map((d) => [d, new Day(value, d)]));
      return;
    }

    if (value instanceof Week) {
      this._weekMap = new Map(value._weekMap);
      return;
    }

    const parsed = typeof value === 'string' ? Week.parse(value) : value;

    const temp = WEEK_DAYS_LABEL.map(
      (l) => [WeekDays[l], new Day(parsed[l], WeekDays[l])] as const,
    );

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
        if (index === WeekDays.sunday && isNotEmpty) acc.sunday = Day.parse(curr, index);
        if (index === WeekDays.monday && isNotEmpty) acc.monday = Day.parse(curr, index);
        if (index === WeekDays.tuesday && isNotEmpty) acc.tuesday = Day.parse(curr, index);
        if (index === WeekDays.wednesday && isNotEmpty) acc.wednesday = Day.parse(curr, index);
        if (index === WeekDays.thursday && isNotEmpty) acc.thursday = Day.parse(curr, index);
        if (index === WeekDays.friday && isNotEmpty) acc.friday = Day.parse(curr, index);
        if (index === WeekDays.saturday && isNotEmpty) acc.saturday = Day.parse(curr, index);

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
      sunday: this._weekMap.get(WeekDays.sunday)?.toJSON() ?? null,
      monday: this._weekMap.get(WeekDays.monday)?.toJSON() ?? null,
      tuesday: this._weekMap.get(WeekDays.tuesday)?.toJSON() ?? null,
      wednesday: this._weekMap.get(WeekDays.wednesday)?.toJSON() ?? null,
      thursday: this._weekMap.get(WeekDays.thursday)?.toJSON() ?? null,
      friday: this._weekMap.get(WeekDays.friday)?.toJSON() ?? null,
      saturday: this._weekMap.get(WeekDays.saturday)?.toJSON() ?? null,
    };
  }

  equals(that: Week): boolean {
    return this.toString() === that.toString();
  }

  getDay(number: WeekDays): Day | null {
    const day = this._weekMap.get(number);
    if (day == null || day.size === 0) return null;
    return day;
  }

  get today(): Day | null {
    const todayDate = new Date().getDay();
    return this.getDay(todayDate);
  }

  get monday(): Day | null {
    return this.getDay(WeekDays.monday);
  }

  get tuesday(): Day | null {
    return this.getDay(WeekDays.tuesday);
  }

  get wednesday(): Day | null {
    return this.getDay(WeekDays.wednesday);
  }

  get thursday(): Day | null {
    return this.getDay(WeekDays.thursday);
  }

  get friday(): Day | null {
    return this.getDay(WeekDays.friday);
  }

  get saturday(): Day | null {
    return this.getDay(WeekDays.saturday);
  }

  get sunday(): Day | null {
    return this.getDay(WeekDays.sunday);
  }
}
