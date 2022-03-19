export interface TimeSerializable {
  hours: number;
  minutes: number;
  isDST: boolean;
}

export interface TimeRangeSerializable {
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
  number: WeekDays;
  ranges: TimeRangeSerializable[];
}

export interface DatedDaySerializable {
  date: Date;
  ranges: TimeRangeSerializable[];
}

export type DayParsable = Partial<DaySerializable>;

export type WeekSerializable = Record<keyof typeof WeekDays, TimeRangeSerializable[]>;
export type WeekParsable = Partial<Record<keyof typeof WeekDays, TimeRangeSerializable[]>>;

export interface RangeSerieSlottableOptions {
  timeRequired?: number;
  allowedMinutesOverflow?: number;
}
