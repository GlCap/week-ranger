import { Range } from '../src/core/Range';
import { Day } from '../src/core/Day';

describe('Day class', () => {
  const dayString = '08:30-10:30,06:30-07:30,07:30-10:30';
  const day = new Day(dayString, 0);

  it('can parse a formatted string', () => {
    expect(Day.parse(dayString)).toBeDefined();
    expect(Day.parse(dayString, 0)).toBeDefined();
    expect(() => Day.parse('', -1)).toThrow();
    expect(() => Day.parse('')).toThrow();
  });

  it('can instance himself', () => {
    expect(new Day(day).equals(day)).toBeTruthy();
    expect(new Day(Day.parse(dayString)).equals(day)).toBeTruthy();
  });

  it('can instance an empty Day', () => {
    expect(new Day()).toBeDefined();
    expect(new Day().equals(new Day())).toBeTruthy();
  });

  it('can be created from a Range array', () => {
    expect(new Day([])).toBeDefined();
    expect(new Day([new Range('07:30-08:30'), new Range('08:30-10:30')])).toBeDefined();
    expect(new Day(['07:30-08:30', '08:30-10:30'])).toBeDefined();
    expect(new Day(['07:30-08:30', new Range('08:30-10:30')])).toBeDefined();
  });

  it('can be serialized to a string', () => {
    expect(day.toString()).toBeDefined();
    expect(day.equals(new Day(day.toString()))).toBeTruthy();
  });

  it('can be serialized to JSON', () => {
    expect(day.toJSON()).toStrictEqual(JSON.parse(JSON.stringify(day)));
    expect(new Day().toJSON()).toBe(null);
  });

  it('can be compared', () => {
    const monday = new Day(dayString, 0);
    const tuesday = new Day(dayString, 1);

    expect(new Day().compareTo(new Day())).toBe(0);
    expect(monday.compareTo(monday)).toBe(0);
    expect(monday.compareTo(tuesday)).toBeLessThan(0);
    expect(tuesday.compareTo(monday)).toBeGreaterThan(0);

    expect(monday.isAfter(tuesday)).toBeFalsy();
    expect(tuesday.isAfter(monday)).toBeTruthy();
  });

  it('can set ranges', () => {
    const rangeSet = new Range('14:30-15:30');
    const daySet = new Day(day).set(rangeSet);
    expect(daySet.has(rangeSet)).toBeTruthy();
  });

  it('can delete ranges', () => {
    const rangeSet = new Range('14:30-15:30');
    const daySet = new Day(day).set(rangeSet).delete(rangeSet.toString());
    expect(daySet.has(rangeSet)).toBeFalsy();
  });

  it('can replace ranges', () => {
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

  it('should convert ranges to a sorted array', () => {
    const ranges = day.ranges;

    expect([...ranges].sort((a, b) => a.compareTo(b))).toStrictEqual(ranges);
  });

  it('should track the day of the week as a number', () => {
    expect(day.number).toBeGreaterThanOrEqual(0);
    expect(day.number).toBeLessThanOrEqual(6);
  });
});
