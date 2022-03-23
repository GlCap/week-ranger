import { DaySerializable } from '../types';
import { Day } from '../Day';

const dayString = '0;08:30-10:30,06:30-07:30,07:30-10:30';
const dayDateString = `${0};08:30-10:30,06:30-07:30,07:30-10:30`;
const day = Day.fromString(dayString, 0);
const monday = Day.fromString(dayString, 0);
const tuesday = Day.fromString(dayString, 1);

describe('Day class', () => {
  describe('constructor', () => {
    it('should instance without params', () => {
      expect(new Day(0)).toBeDefined();
      expect(new Day(0).equals(new Day(0))).toBeTruthy();
    });

    it('should instance from another Day instance', () => {
      expect(new Day(day).equals(day)).toBeTruthy();
      expect(new Day(Day.fromString(dayString)).equals(day)).toBeTruthy();
    });
  });

  describe('fromString', () => {
    it('can parse a formatted string', () => {
      expect(Day.fromString(dayDateString)).toBeDefined();
      expect(Day.fromString(dayString)).toBeDefined();
      expect(Day.fromString(dayString, 0)).toBeDefined();
      expect(() => Day.fromString('', -1)).toThrow();
      expect(() => Day.fromString('')).toThrow();
    });
  });

  describe('toString', () => {
    it('should serialize to a formatted string', () => {
      expect(day.toString()).toBeDefined();
      expect(day.equals(Day.fromString(day.toString()))).toBeTruthy();
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      const json: DaySerializable = { dayOfWeek: 0, ranges: [] };
      expect(day.toJSON()).toStrictEqual(JSON.parse(JSON.stringify(day)));
      expect(new Day(0).toJSON()).toStrictEqual(json);
    });
  });

  describe('compareTo', () => {
    it('can be compared', () => {
      expect(new Day(0).compareTo(new Day(0))).toBe(0);
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
      expect(day.dayOfWeek).toBeGreaterThanOrEqual(0);
      expect(day.dayOfWeek).toBeLessThanOrEqual(6);
    });
  });
});
