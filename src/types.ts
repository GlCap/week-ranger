export interface TimeSerializable {
  hours: number;
  minutes: number;
}

export interface RangeSerializable {
  start: TimeSerializable;
  end: TimeSerializable;
}

export type WeekNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DaySerializable {
  number: WeekNumbers | -1;
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
