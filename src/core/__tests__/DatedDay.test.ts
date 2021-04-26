import { TimeRange } from '../../primitives';
import { DatedDay } from '../DatedDay';

const testDate = new Date(0);
const dayString = '0;08:30-10:30,06:30-07:30,07:30-10:30';
const dayDateString = `${testDate.toISOString()};08:30-10:30,06:30-07:30,07:30-10:30`;
const day = new DatedDay(dayString, testDate);
const monday = new DatedDay(dayString, new Date(2021, 3, 21));
const tuesday = new DatedDay(dayString, new Date(2021, 3, 22));

describe('Day class', () => {
  describe('constructor', () => {
    it('should instance without params', () => {
      expect(new DatedDay(testDate)).toBeDefined();
      expect(new DatedDay(testDate).equals(new DatedDay(testDate))).toBeTruthy();
    });

    it('should instance from another DatedDay instance', () => {
      expect(new DatedDay(day)).toBeDefined();
    });

    it('should instance from a Range array', () => {
      expect(new DatedDay([], testDate)).toBeDefined();
      expect(
        new DatedDay([new TimeRange('07:30-08:30'), new TimeRange('08:30-10:30')], testDate),
      ).toBeDefined();
      expect(new DatedDay(['07:30-08:30', '08:30-10:30'], testDate)).toBeDefined();
      expect(new DatedDay(['07:30-08:30', new TimeRange('08:30-10:30')], testDate)).toBeDefined();
    });
  });
  describe('parse', () => {
    it('can parse a formatted string', () => {
      expect(DatedDay.parse(dayDateString)).toBeDefined();
      expect(DatedDay.parse(dayString)).toBeDefined();
      expect(DatedDay.parse(dayString, testDate)).toBeDefined();
      expect(() => DatedDay.parse('')).toThrow();
    });
  });

  describe('toString', () => {
    it('should serialize to a formatted string', () => {
      expect(day.toString()).toBeDefined();
      expect(day.equals(new DatedDay(day.toString()))).toBeTruthy();
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      expect(new DatedDay(testDate).toJSON()).toStrictEqual({
        date: testDate,
        ranges: [],
      });
    });
  });

  describe('compareTo', () => {
    it('can be compared', () => {
      expect(new DatedDay(testDate).compareTo(new DatedDay(testDate))).toBe(0);
      expect(monday.compareTo(monday)).toBe(0);
      expect(monday.compareTo(tuesday)).toBeLessThan(0);
      expect(tuesday.compareTo(monday)).toBeGreaterThan(0);
    });
  });

  describe('isAfter', () => {
    expect(monday.isAfter(tuesday)).toBeFalsy();
    expect(tuesday.isAfter(monday)).toBeTruthy();
  });
});
