import { Range } from '../src/core/Range';

describe('Range class', () => {
  const rangeString = '08:30-10:05';

  const range = new Range(rangeString);

  it('can be parsed from a string', () => {
    const rangeError = '08:30-07:30';
    const rangeErrorShort = '08:3007:30';

    expect(Range.parse(rangeString)).toBeDefined();
    expect(() => Range.parse(rangeErrorShort)).toThrow();
    expect(() => Range.parse(rangeError)).toThrow();
  });

  it('can be created from another Range', () => {
    expect(new Range(range)).toBeDefined();
    expect(range).toStrictEqual(new Range(range));
  });

  it('start must be before end', () => {
    expect(range.end.isAfter(range.start)).toBeTruthy();
    expect(range.start.isAfter(range.end)).toBeFalsy();
  });

  it('can be serialized to a parsable string', () => {
    expect(range.toString()).toStrictEqual(rangeString);
    expect(new Range(range.toString())).toStrictEqual(range);
  });

  it('can be serialized to a tuple of dates', () => {
    const [start, end] = range.toDate();
    const [startFrom, endFrom] = range.toDate(new Date(0));
    expect(range.toDate()).toBeDefined();
    expect(start instanceof Date && end instanceof Date).toBeTruthy();
    expect(startFrom instanceof Date && endFrom instanceof Date).toBeTruthy();
    expect(start.getTime() <= end.getTime()).toBeTruthy();
    expect(startFrom.getTime() <= endFrom.getTime()).toBeTruthy();
  });

  it('can be serialized to JSON', () => {
    expect(JSON.parse(JSON.stringify(range))).toStrictEqual(range.toJSON());
    expect(new Range(range.toJSON())).toStrictEqual(range);
  });

  it('can be compared', () => {
    const rangeAfterString = '10:05-11:55';
    const rangeBeforeString = '05:00-08:30';
    const rangeSameStartString = '08:30-10:00';

    const rangeAfter = new Range(rangeAfterString);
    const rangeBefore = new Range(rangeBeforeString);
    const rangeSameEnd = new Range(rangeSameStartString);

    expect(range.compareTo(range)).toBe(0);
    expect(range.compareTo(rangeAfter)).toBeLessThan(0);
    expect(rangeAfter.compareTo(range)).toBeGreaterThan(0);

    expect(range.compareTo(rangeBefore)).toBeGreaterThan(0);
    expect(rangeBefore.compareTo(range)).toBeLessThan(0);

    expect(range.compareTo(rangeSameEnd)).toBeGreaterThan(0);
    expect(rangeSameEnd.compareTo(range)).toBeLessThan(0);

    expect(range.equals(range)).toBeTruthy();
    expect(range.equals(rangeAfter)).toBeFalsy();
    expect(range.equals(rangeBefore)).toBeFalsy();
    expect(range.equals(rangeSameEnd)).toBeFalsy();

    expect(rangeAfter.isAfter(range)).toBeTruthy();
    expect(range.isAfter(rangeAfter)).toBeFalsy();

    expect(range.isAfter(rangeBefore)).toBeTruthy();
    expect(rangeBefore.isAfter(range)).toBeFalsy();
  });
});
