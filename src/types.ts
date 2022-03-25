import type { DateTime } from 'luxon';

import type { Day } from './Day';
import type { WeekDays } from './enums';

export interface TimeSerializable {
  hours: number;
  minutes: number;
}

export interface TimeRangeSerializable {
  start: TimeSerializable;
  end: TimeSerializable;
}

export interface RangeSerieSerializable {
  ranges: TimeRangeSerializable[];
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

export type WeekTupleDateTime = [
  sunday: Array<[DateTime, DateTime]>,
  monday: Array<[DateTime, DateTime]>,
  tuesday: Array<[DateTime, DateTime]>,
  wednesday: Array<[DateTime, DateTime]>,
  thursday: Array<[DateTime, DateTime]>,
  friday: Array<[DateTime, DateTime]>,
  saturday: Array<[DateTime, DateTime]>,
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

export interface ToStringOptions {
  dateOfParsing?: Date;
}

export interface TimeToStringOptions extends ToStringOptions {}

export interface TimeRangeToStringOptions extends ToStringOptions {}

export interface RangeSerieToStringOptions extends ToStringOptions {}

export interface DayToStringOptions extends ToStringOptions {
  dayOfWeek?: WeekDays;
  includeDay?: boolean;
}

export interface WeekToStringOptions extends ToStringOptions {}

export interface FromStringOptions {
  dateOfFormatting?: Date;
}

export interface TimeFromStringOptions extends FromStringOptions {}

export interface TimeRangeFromStringOptions extends FromStringOptions {}

export interface RangeSerieFromStringOptions extends FromStringOptions {}

export interface DayFromStringOptions extends FromStringOptions {
  dayOfWeek?: WeekDays;
  requireDayOfWeekPrefix?: boolean;
}

export interface WeekFromStringOptions extends FromStringOptions {}
