import { DaySerializable } from '../types';
import { Day } from '../Day';
import { WeekDays } from '../enums';

const sundayString = '0;08:30-10:30,06:30-07:30,07:30-10:30';
const sunday = Day.fromString(sundayString);
const monday = Day.fromString(sundayString, { dayOfWeek: WeekDays.monday });
const tuesday = Day.fromString(sundayString, { dayOfWeek: WeekDays.tuesday });

describe('Day class', () => {
  describe('constructor', () => {
    it('should instance without params', () => {
      expect(new Day(0)).toBeDefined();
      expect(new Day(0).equals(new Day(0))).toBeTruthy();
    });

    it('should instance from another Day instance', () => {
      expect(new Day(sunday).equals(sunday)).toBeTruthy();
      expect(new Day(Day.fromString(sundayString)).equals(sunday)).toBeTruthy();
    });
  });

  describe('fromString', () => {
    it('can parse a formatted string', () => {
      expect(Day.fromString(sundayString)).toBeDefined();
      expect(Day.fromString(sundayString, { dayOfWeek: WeekDays.sunday })).toBeDefined();
      expect(() => Day.fromString('', { dayOfWeek: -1 })).toThrow();
      expect(() => Day.fromString('')).toThrow();
    });
  });

  describe('toString', () => {
    it('should serialize to a formatted string', () => {
      expect(sunday.toString()).toBeDefined();
      expect(sunday.equals(Day.fromString(sunday.toString()))).toBeTruthy();
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      const json: DaySerializable = { dayOfWeek: 0, ranges: [] };
      expect(sunday.toJSON()).toStrictEqual(JSON.parse(JSON.stringify(sunday)));
      expect(new Day(0).toJSON()).toStrictEqual(json);
    });
  });

  describe('compareTo', () => {
    it('can be compared', () => {
      expect(new Day(WeekDays.sunday).compareTo(new Day(WeekDays.sunday))).toBe(0);
      expect(monday.compareTo(monday)).toBe(0);
      expect(monday.compareTo(tuesday)).toBeLessThan(0);
      expect(tuesday.compareTo(monday)).toBeGreaterThan(0);
    });
  });

  describe('isAfter', () => {
    expect(monday.isAfter(tuesday)).toBeFalsy();
    expect(tuesday.isAfter(monday)).toBeTruthy();
  });

  describe('getters', () => {
    it('should track the day of the week as a number', () => {
      expect(sunday.dayOfWeek).toBeGreaterThanOrEqual(0);
      expect(sunday.dayOfWeek).toBeLessThanOrEqual(6);
    });
  });
});
