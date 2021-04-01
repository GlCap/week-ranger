export interface TimeSerializable {
  hours: number;
  minutes: number;
}

export interface RangeSerializable {
  start: TimeSerializable;
  end: TimeSerializable;
}

export interface DaySerializable {
  ranges: RangeSerializable[];
}

export interface WeekSerializable {
  monday: DaySerializable;
  tuesday: DaySerializable;
  wednesday: DaySerializable;
  thursday: DaySerializable;
  friday: DaySerializable;
  saturday: DaySerializable;
  sunday: DaySerializable;
}
