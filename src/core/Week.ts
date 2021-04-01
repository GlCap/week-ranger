import { Day } from './Day';
import { WeekSerializable } from '../types';

const initialValues: WeekSerializable = {
  monday: { ranges: [] },
  tuesday: { ranges: [] },
  wednesday: { ranges: [] },
  thursday: { ranges: [] },
  friday: { ranges: [] },
  saturday: { ranges: [] },
  sunday: { ranges: [] },
};

export class Week {
  static readonly separator = '\n' as const;

  private readonly _monday: Day;
  private readonly _tuesday: Day;
  private readonly _wednesday: Day;
  private readonly _thursday: Day;
  private readonly _friday: Day;
  private readonly _saturday: Day;
  private readonly _sunday: Day;

  constructor(value: string | Week | WeekSerializable) {
    if (value instanceof Week) {
      this._monday = value._monday;
      this._tuesday = value._tuesday;
      this._wednesday = value._wednesday;
      this._thursday = value._thursday;
      this._friday = value._friday;
      this._saturday = value._saturday;
      this._sunday = value._sunday;
      return;
    }

    const parsed = typeof value === 'string' ? Week.parse(value) : value;

    this._monday = new Day(parsed.monday);
    this._tuesday = new Day(parsed.tuesday);
    this._wednesday = new Day(parsed.wednesday);
    this._thursday = new Day(parsed.thursday);
    this._friday = new Day(parsed.friday);
    this._saturday = new Day(parsed.saturday);
    this._sunday = new Day(parsed.sunday);
  }

  static parse(base: string): WeekSerializable {
    const rawWeek = base.split(this.separator);
    if (rawWeek.length > 7) {
      throw new Error(`Invalid number of days: ${rawWeek.length}`);
    }

    return rawWeek.reduce(
      (acc, curr, index) => {
        if (index === 0) acc.monday = Day.parse(curr);
        if (index === 1) acc.tuesday = Day.parse(curr);
        if (index === 2) acc.wednesday = Day.parse(curr);
        if (index === 3) acc.thursday = Day.parse(curr);
        if (index === 4) acc.friday = Day.parse(curr);
        if (index === 5) acc.saturday = Day.parse(curr);
        if (index === 6) acc.sunday = Day.parse(curr);

        return acc;
      },
      { ...initialValues },
    );
  }

  toString(): string {
    const array = [
      this._monday.toString(),
      this._tuesday.toString(),
      this._wednesday.toString(),
      this._thursday.toString(),
      this._friday.toString(),
      this._saturday.toString(),
      this._sunday.toString(),
    ];

    return array.join(Week.separator);
  }

  private getDay(day: Day): Day | null {
    if (day.ranges.length === 0) return null;
    return day;
  }

  get monday(): Day | null {
    return this.getDay(this._monday);
  }

  get tuesday(): Day | null {
    return this.getDay(this._tuesday);
  }

  get wednesday(): Day | null {
    return this.getDay(this._wednesday);
  }

  get thursday(): Day | null {
    return this.getDay(this._thursday);
  }

  get friday(): Day | null {
    return this.getDay(this._friday);
  }

  get saturday(): Day | null {
    return this.getDay(this._saturday);
  }

  get sunday(): Day | null {
    return this.getDay(this._sunday);
  }
}
