import { Range } from '../src/core/Range';

describe('Range class', () => {
  const rangeString = '08:30-10:05';

  const rangeAfterString = '10:05-11:55';
  const rangeBeforeString = '05:00-08:30';
  const rangeSameStartString = '08:30-10:00';

  const range = new Range(rangeString);
  const rangeAfter = new Range(rangeAfterString);
  const rangeBefore = new Range(rangeBeforeString);
  const rangeSameEnd = new Range(rangeSameStartString);

  describe('getters', () => {
    test('start should be before end', () => {
      expect(range.end.isAfter(range.start)).toBe(true);
      expect(range.start.isAfter(range.end)).toBe(false);
    });
  });

  describe('constructor', () => {
    it('can be created from another Range', () => {
      expect(new Range(range)).toBeDefined();
      expect(range).toStrictEqual(new Range(range));
    });
  });

  describe('parse', () => {
    it.each([rangeString, rangeAfterString, rangeBeforeString, rangeSameStartString])(
      'should parse a formatted string',
      (range) => {
        expect(Range.parse(range)).toBeDefined();
      },
    );

    it('should throw on invalid string', () => {
      const rangeError = '08:30-07:30';
      const rangeErrorShort = '08:3007:30';

      expect(() => Range.parse(rangeErrorShort)).toThrow();
      expect(() => Range.parse(rangeError)).toThrow();
    });
  });

  describe('toString', () => {
    it('should serialize to a parsable string', () => {
      expect(range.toString()).toStrictEqual(rangeString);
      expect(new Range(range.toString())).toStrictEqual(range);
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
      expect(new Range(range.toJSON())).toStrictEqual(range);
    });
  });

  describe('compareTo', () => {
    expect(range.compareTo(range)).toBe(0);
    expect(range.compareTo(rangeAfter)).toBeLessThan(0);
    expect(rangeAfter.compareTo(range)).toBeGreaterThan(0);

    expect(range.compareTo(rangeBefore)).toBeGreaterThan(0);
    expect(rangeBefore.compareTo(range)).toBeLessThan(0);

    expect(range.compareTo(rangeSameEnd)).toBeGreaterThan(0);
    expect(rangeSameEnd.compareTo(range)).toBeLessThan(0);
  });

  describe('equals', () => {
    it('should be true', () => {
      expect(range.equals(range)).toBeTruthy();
      expect(rangeAfter.equals(rangeAfter)).toBeTruthy();
      expect(rangeBefore.equals(rangeBefore)).toBeTruthy();
      expect(rangeSameEnd.equals(rangeSameEnd)).toBeTruthy();
    });

    it('should be false', () => {
      expect(range.equals(rangeAfter)).toBeFalsy();
      expect(range.equals(rangeBefore)).toBeFalsy();
      expect(range.equals(rangeSameEnd)).toBeFalsy();
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
});
