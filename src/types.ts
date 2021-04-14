export interface TimeSerializable {
  hours: number;
  minutes: number;
}

export interface RangeSerializable {
  start: TimeSerializable;
  end: TimeSerializable;
}

export enum WeekDays {
  sunday = 0,
  monday = 1,
  tuesday = 2,
  wednesday = 3,
  thursday = 4,
  friday = 5,
  saturday = 6,
}

export interface DaySerializable {
  date: Date | null;
  number: WeekDays | null;
  ranges: RangeSerializable[];
}

export type DayParsable = Partial<DaySerializable>;

export type WeekSerializable = Record<keyof typeof WeekDays, DaySerializable | null>;
export type WeekParsable = Partial<Record<keyof typeof WeekDays, DayParsable | null>>;
