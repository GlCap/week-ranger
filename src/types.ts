import type { RangeSerie } from './primitives/RangeSerie';

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
  number: WeekDays;
}

export interface DatedDaySerializable extends RangeSerieSerializable {
  date: Date;
}

export type DayParsable = Partial<DaySerializable>;

export type WeekSerializable = Record<keyof typeof WeekDays, TimeRangeSerializable[]>;
export type WeekParsable = Partial<Record<keyof typeof WeekDays, TimeRangeSerializable[]>>;
export type WeekTuple = [
  sunday: RangeSerie | null,
  monday: RangeSerie | null,
  tuesday: RangeSerie | null,
  wednesday: RangeSerie | null,
  thursday: RangeSerie | null,
  friday: RangeSerie | null,
  saturday: RangeSerie | null,
];

export interface RangeSerieSlottableOptions {
  timeRequired?: number;
  allowedMinutesOverflow?: number;
}

export interface DatedDaySlottableOptions extends RangeSerieSlottableOptions {
  date?: Date;
}

export interface DaySlottableOptions extends RangeSerieSlottableOptions {
  number?: WeekDays;
}
