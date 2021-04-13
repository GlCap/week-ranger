import { Range } from '../src/core/Range';
import { Day } from '../src/core/Day';

const dayString = '08:30-10:30,06:30-07:30,07:30-10:30';
const dayDateString = `${new Date(0).toISOString()};08:30-10:30,06:30-07:30,07:30-10:30`;
const day = new Day(dayString, 0);
const monday = new Day(dayString, 0);
const tuesday = new Day(dayString, 1);

describe('Day class', () => {
  describe('constructor', () => {
    it('should instance without params', () => {
      expect(new Day()).toBeDefined();
      expect(new Day().equals(new Day())).toBeTruthy();
    });

    it('should instance from another Day instance', () => {
      expect(new Day(day).equals(day)).toBeTruthy();
      expect(new Day(Day.parse(dayString)).equals(day)).toBeTruthy();
    });

    it('should instance from a Range array', () => {
      expect(new Day([])).toBeDefined();
      expect(new Day([new Range('07:30-08:30'), new Range('08:30-10:30')])).toBeDefined();
      expect(new Day(['07:30-08:30', '08:30-10:30'])).toBeDefined();
      expect(new Day(['07:30-08:30', new Range('08:30-10:30')])).toBeDefined();
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
      expect(new Day().toJSON()).toBe(null);
    });
  });

  describe('compareTo', () => {
    it('can be compared', () => {
      expect(new Day().compareTo(new Day())).toBe(0);
      expect(monday.compareTo(monday)).toBe(0);
      expect(monday.compareTo(tuesday)).toBeLessThan(0);
      expect(tuesday.compareTo(monday)).toBeGreaterThan(0);
    });
  });

  describe('isAfter', () => {
    expect(monday.isAfter(tuesday)).toBeFalsy();
    expect(tuesday.isAfter(monday)).toBeTruthy();
  });

  describe('has', () => {
    it('should return true if a Range is in a Day', () => {
      expect(day.has(new Range('08:30-10:30'))).toBe(true);
    });
    it('should return false if a Range is not in a Day', () => {
      expect(day.has(new Range('08:30-11:30'))).toBe(false);
    });
  });

  describe('set', () => {
    test('can set ranges', () => {
      const rangeSet = new Range('14:30-15:30');
      const daySet = new Day(day).set(rangeSet);
      expect(daySet.has(rangeSet)).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('can delete ranges', () => {
      const rangeSet = new Range('14:30-15:30');
      const daySet = new Day(day).set(rangeSet).delete(rangeSet.toString());
      expect(daySet.has(rangeSet)).toBeFalsy();
    });
  });

  describe('replace', () => {
    it('should replace a Range with another Range', () => {
      const rangeSet = new Range('14:30-15:30');
      const rangeReplace = new Range('15:30-16:30');
      const rangeReplaceSame = new Range('15:30-16:30');
      const daySet = new Day(day).set(rangeSet);

      expect(daySet.has(rangeSet)).toBeTruthy();
      expect(daySet.replace(rangeSet.toString(), rangeReplace).has(rangeReplace)).toBeTruthy();
      expect(
        daySet.replace(rangeReplaceSame.toString(), rangeReplace).has(rangeReplace),
      ).toBeTruthy();
    });
  });

  describe('getters', () => {
    it('should ranges should be a sorted Range array', () => {
      const ranges = day.ranges;

      expect([...ranges].sort((a, b) => a.compareTo(b))).toStrictEqual(ranges);
    });

    it('should track the day of the week as a number', () => {
      expect(day.number).toBeGreaterThanOrEqual(0);
      expect(day.number).toBeLessThanOrEqual(6);
    });
  });
});
