import type { Day } from './core';

export interface TimeSerializable {
  hours: number;
  minutes: number;
  isDST: boolean;
}

export interface TimeRangeSerializable {
  start: TimeSerializable;
  end: TimeSerializable;
}

export interface RangeSerieSerializable {
  ranges: TimeRangeSerializable[];
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

export interface DaySerializable extends RangeSerieSerializable {
  dayOfWeek: WeekDays;
}

export interface DatedDaySerializable extends RangeSerieSerializable {
  date: Date;
}

export type DayParsable = Partial<DaySerializable>;

export type WeekSerializable = Record<keyof typeof WeekDays, TimeRangeSerializable[]>;
export type WeekParsable = Partial<Record<keyof typeof WeekDays, TimeRangeSerializable[]>>;
export type WeekTuple = [
  sunday: Day,
  monday: Day,
  tuesday: Day,
  wednesday: Day,
  thursday: Day,
  friday: Day,
  saturday: Day,
];

export type WeekTupleDate = [
  sunday: Array<[Date, Date]>,
  monday: Array<[Date, Date]>,
  tuesday: Array<[Date, Date]>,
  wednesday: Array<[Date, Date]>,
  thursday: Array<[Date, Date]>,
  friday: Array<[Date, Date]>,
  saturday: Array<[Date, Date]>,
];

export interface RangeSerieSlottableOptions {
  timeRequired?: number;
  allowedMinutesOverflow?: number;
}

export interface DatedDaySlottableOptions extends RangeSerieSlottableOptions {
  date?: Date;
}

export interface DaySlottableOptions extends RangeSerieSlottableOptions {
  dayOfWeek?: WeekDays;
}
