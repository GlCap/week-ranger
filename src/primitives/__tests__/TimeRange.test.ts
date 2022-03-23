import { Time } from '../Time';
import { TimeRange } from '../TimeRange';

describe('TimeRange class', () => {
  const rangeString = '08:30-10:05';

  const rangeAfterString = '10:05-11:55';
  const rangeBeforeString = '05:00-08:30';
  const rangeSameStartString = '08:30-10:00';

  const range = TimeRange.fromString(rangeString);
  const rangeAfter = TimeRange.fromString(rangeAfterString);
  const rangeBefore = TimeRange.fromString(rangeBeforeString);
  const rangeSameStart = TimeRange.fromString(rangeSameStartString);

  describe('getters', () => {
    test('start should be before end', () => {
      expect(range.end.isAfter(range.start)).toBe(true);
      expect(range.start.isAfter(range.end)).toBe(false);
    });
  });

  describe('constructor', () => {
    it('can be created from another Range', () => {
      expect(new TimeRange(range)).toBeDefined();
      expect(range).toStrictEqual(new TimeRange(range));
    });
  });

  describe('parse', () => {
    it.each([rangeString, rangeAfterString, rangeBeforeString, rangeSameStartString])(
      'should parse a formatted string',
      (range) => {
        expect(TimeRange.fromString(range)).toBeDefined();
      },
    );

    it('should throw on invalid string', () => {
      const rangeError = '08:30-07:30';
      const rangeErrorShort = '08:3007:30';

      expect(() => TimeRange.fromString(rangeErrorShort)).toThrow();
      expect(() => TimeRange.fromString(rangeError)).toThrow();
    });
  });

  describe('numberOfSlotsInRange', () => {
    it('should return the max number of slots in a time range', () => {
      expect(TimeRange.numberOfSlotsInRange(TimeRange.fromString('09:00-12:00'), 30)).toBe(6);
      expect(TimeRange.numberOfSlotsInRange(TimeRange.fromString('09:00-09:00'), 30)).toBe(0);
      expect(TimeRange.numberOfSlotsInRange(TimeRange.fromString('09:00-09:30'), 50)).toBe(0);
      expect(TimeRange.numberOfSlotsInRange(TimeRange.fromString('09:00-09:33'), 30)).toBe(0);
      expect(TimeRange.numberOfSlotsInRange(TimeRange.fromString('09:00-09:30'), 27)).toBe(0);
    });
  });

  describe('toString', () => {
    it('should serialize to a parsable string', () => {
      expect(range.toString()).toStrictEqual(rangeString);
      expect(TimeRange.fromString(range.toString())).toStrictEqual(range);
    });
  });

  describe('toDate', () => {
    it('should serialize to a tuple of dates', () => {
      const [start, end] = range.toDate();
      const [startFrom, endFrom] = range.toDate(new Date(0));
      expect(range.toDate()).toBeDefined();
      expect(start instanceof Date && end instanceof Date).toBeTruthy();
      expect(startFrom instanceof Date && endFrom instanceof Date).toBeTruthy();
      expect(start.getTime() <= end.getTime()).toBeTruthy();
      expect(startFrom.getTime() <= endFrom.getTime()).toBeTruthy();
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      expect(JSON.parse(JSON.stringify(range))).toStrictEqual(range.toJSON());
      expect(new TimeRange(range.toJSON())).toStrictEqual(range);
    });
  });

  describe('compareTo', () => {
    expect(range.compareTo(range)).toBe(0);
    expect(range.compareTo(rangeAfter)).toBeLessThan(0);
    expect(rangeAfter.compareTo(range)).toBeGreaterThan(0);

    expect(range.compareTo(rangeBefore)).toBeGreaterThan(0);
    expect(rangeBefore.compareTo(range)).toBeLessThan(0);

    expect(range.compareTo(rangeSameStart)).toBeGreaterThan(0);
    expect(rangeSameStart.compareTo(range)).toBeLessThan(0);
  });

  describe('equals', () => {
    it('should be true', () => {
      expect(range.equals(range)).toBeTruthy();
      expect(rangeAfter.equals(rangeAfter)).toBeTruthy();
      expect(rangeBefore.equals(rangeBefore)).toBeTruthy();
      expect(rangeSameStart.equals(rangeSameStart)).toBeTruthy();
    });

    it('should be false', () => {
      expect(range.equals(rangeAfter)).toBeFalsy();
      expect(range.equals(rangeBefore)).toBeFalsy();
      expect(range.equals(rangeSameStart)).toBeFalsy();
    });
  });

  describe('isAfter', () => {
    it('should be after', () => {
      expect(rangeAfter.isAfter(range)).toBeTruthy();
      expect(range.isAfter(rangeBefore)).toBeTruthy();
    });

    it('should not be after', () => {
      expect(range.isAfter(rangeAfter)).toBeFalsy();
      expect(rangeBefore.isAfter(range)).toBeFalsy();
    });
  });

  describe('contains', () => {
    it('should check if another Range or Time is contained', () => {
      expect(TimeRange.fromString('09:00-11:00').contains(Time.fromString('09:00'))).toBe(true);
      expect(TimeRange.fromString('09:00-11:00').contains(Time.fromString('11:00'))).toBe(true);
      expect(TimeRange.fromString('09:00-11:00').contains(Time.fromString('10:00'))).toBe(true);
      expect(TimeRange.fromString('08:30-18:30').contains(Time.fromString('09:00'))).toBe(true);
      expect(TimeRange.fromString('09:00-11:00').contains(Time.fromString('08:00'))).toBe(false);

      expect(
        TimeRange.fromString('09:00-11:00').contains(TimeRange.fromString('09:00-11:00')),
      ).toBe(true);
      expect(
        TimeRange.fromString('09:00-11:00').contains(TimeRange.fromString('08:00-10:00')),
      ).toBe(false);
      expect(
        TimeRange.fromString('09:00-11:00').contains(TimeRange.fromString('10:00-12:00')),
      ).toBe(false);
      expect(
        TimeRange.fromString('09:00-11:00').contains(TimeRange.fromString('09:00-13:00')),
      ).toBe(false);
    });
  });

  describe('overlaps', () => {
    it('should check if another TimeRange overlaps', () => {
      expect(
        TimeRange.fromString('09:00-11:00').overlaps(TimeRange.fromString('09:00-11:00')),
      ).toBe(true);
      expect(
        TimeRange.fromString('09:00-11:00').overlaps(TimeRange.fromString('09:00-12:00')),
      ).toBe(true);
      expect(
        TimeRange.fromString('09:00-11:00').overlaps(TimeRange.fromString('08:00-12:00')),
      ).toBe(true);
      expect(
        TimeRange.fromString('09:00-11:00').overlaps(TimeRange.fromString('08:00-10:00')),
      ).toBe(true);

      expect(
        TimeRange.fromString('09:00-11:00').overlaps(TimeRange.fromString('08:00-09:00')),
      ).toBe(false);
      expect(
        TimeRange.fromString('09:00-11:00').overlaps(TimeRange.fromString('11:00-12:00')),
      ).toBe(false);
    });
  });
});
