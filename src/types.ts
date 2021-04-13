export interface TimeSerializable {
  hours: number;
  minutes: number;
}

export interface RangeSerializable {
  start: TimeSerializable;
  end: TimeSerializable;
}

export enum WeekDays {
  'sunday' = 0,
  'monday' = 1,
  'tuesday' = 2,
  'wednesday' = 3,
  'thursday' = 4,
  'friday' = 5,
  'saturday' = 6,
}

export interface DaySerializable {
  date: Date | null;
  number: WeekDays | null;
  ranges: RangeSerializable[];
}

export type WeekDaysMap = Record<keyof typeof WeekDays, DaySerializable | null>;

export interface WeekSerializable extends WeekDaysMap {
  sunday: DaySerializable | null;
  monday: DaySerializable | null;
  tuesday: DaySerializable | null;
  wednesday: DaySerializable | null;
  thursday: DaySerializable | null;
  friday: DaySerializable | null;
  saturday: DaySerializable | null;
}
