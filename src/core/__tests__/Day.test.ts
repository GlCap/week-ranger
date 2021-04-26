import { TimeRange } from '../../primitives';
import { Day } from '../Day';

const dayString = '0;08:30-10:30,06:30-07:30,07:30-10:30';
const dayDateString = `${0};08:30-10:30,06:30-07:30,07:30-10:30`;
const day = new Day(dayString, 0);
const monday = new Day(dayString, 0);
const tuesday = new Day(dayString, 1);

describe('Day class', () => {
  describe('constructor', () => {
    it('should instance without params', () => {
      expect(new Day(0)).toBeDefined();
      expect(new Day(0).equals(new Day(0))).toBeTruthy();
    });

    it('should instance from another Day instance', () => {
      expect(new Day(day).equals(day)).toBeTruthy();
      expect(new Day(Day.parse(dayString)).equals(day)).toBeTruthy();
    });

    it('should instance from a Range array', () => {
      expect(new Day([], 0)).toBeDefined();
      expect(
        new Day([new TimeRange('07:30-08:30'), new TimeRange('08:30-10:30')], 0),
      ).toBeDefined();
      expect(new Day(['07:30-08:30', '08:30-10:30'], 0)).toBeDefined();
      expect(new Day(['07:30-08:30', new TimeRange('08:30-10:30')], 0)).toBeDefined();
    });
  });
  describe('parse', () => {
    it('can parse a formatted string', () => {
      expect(Day.parse(dayDateString)).toBeDefined();
      expect(Day.parse(dayString)).toBeDefined();
      expect(Day.parse(dayString, 0)).toBeDefined();
      expect(() => Day.parse('', -1)).toThrow();
      expect(() => Day.parse('')).toThrow();
    });
  });

  describe('toString', () => {
    it('should serialize to a formatted string', () => {
      expect(day.toString()).toBeDefined();
      expect(day.equals(new Day(day.toString()))).toBeTruthy();
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      expect(day.toJSON()).toStrictEqual(JSON.parse(JSON.stringify(day)));
      expect(new Day(0).toJSON()).toStrictEqual({ number: 0, ranges: [] });
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
      expect(day.number).toBeGreaterThanOrEqual(0);
      expect(day.number).toBeLessThanOrEqual(6);
    });
  });
});
