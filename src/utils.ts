import { WeekDays } from './enums';

export const WEEK_DAYS: WeekDays[] = [0, 1, 2, 3, 4, 5, 6];
export const WEEK_DAYS_LABEL: Array<keyof typeof WeekDays> = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export const stdTimezoneOffset = (value: Date): number => {
  const jan = new Date(value.getFullYear(), 0, 1);
  const jul = new Date(value.getFullYear(), 6, 1);

  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

export const isDstObserved = (value: Date): boolean => {
  return value.getTimezoneOffset() !== stdTimezoneOffset(value);
};
