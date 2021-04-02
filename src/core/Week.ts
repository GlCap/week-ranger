import { Day } from './Day';
import { DaySerializable, WeekSerializable } from '../types';
import { InvalidFormatError } from '../errors';

const initialDay: DaySerializable = { ranges: [], number: -1 };

const initialValues: WeekSerializable = {
  monday: initialDay,
  tuesday: initialDay,
  wednesday: initialDay,
  thursday: initialDay,
  friday: initialDay,
  saturday: initialDay,
  sunday: initialDay,
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

  constructor(value: string);
  constructor(value: WeekSerializable);
  constructor(value: Week);
  constructor(value: string | WeekSerializable | Week) {
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

  static parse(value: string): WeekSerializable {
    if (value.length === 0) {
      throw new InvalidFormatError(value, 'Week');
    }

    const rawWeek = value.split(this.separator);

    if (rawWeek.length > 7 || rawWeek.length < 1) {
      throw new InvalidFormatError(value, 'Week');
    }

    return rawWeek.reduce(
      (acc, curr, index) => {
        if (index === 0) acc.monday = Day.parse(curr, index);
        if (index === 1) acc.tuesday = Day.parse(curr, index);
        if (index === 2) acc.wednesday = Day.parse(curr, index);
        if (index === 3) acc.thursday = Day.parse(curr, index);
        if (index === 4) acc.friday = Day.parse(curr, index);
        if (index === 5) acc.saturday = Day.parse(curr, index);
        if (index === 6) acc.sunday = Day.parse(curr, index);

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

  toJSON(): WeekSerializable {
    return {
      monday: this._monday.toJSON(),
      tuesday: this._tuesday.toJSON(),
      wednesday: this._wednesday.toJSON(),
      thursday: this._thursday.toJSON(),
      friday: this._friday.toJSON(),
      saturday: this._saturday.toJSON(),
      sunday: this._sunday.toJSON(),
    };
  }

  equals(that: Week): boolean {
    return this.toString() === that.toString();
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
