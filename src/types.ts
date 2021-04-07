export interface TimeSerializable {
  hours: number;
  minutes: number;
}

export interface RangeSerializable {
  start: TimeSerializable;
  end: TimeSerializable;
}

export enum WeekDays {
  'monday' = 0,
  'tuesday' = 1,
  'wednesday' = 2,
  'thursday' = 3,
  'friday' = 4,
  'saturday' = 5,
  'sunday' = 6,
}

export interface DaySerializable {
  number: WeekDays | null;
  ranges: RangeSerializable[];
}

export interface WeekSerializable {
  monday: DaySerializable | null;
  tuesday: DaySerializable | null;
  wednesday: DaySerializable | null;
  thursday: DaySerializable | null;
  friday: DaySerializable | null;
  saturday: DaySerializable | null;
  sunday: DaySerializable | null;
}
