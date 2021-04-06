import { Day } from '../src/core/Day';

describe('Day class', () => {
  const dayString = '08:30-10:30,06:30-07:30,07:30-10:30';
  const day = new Day(dayString);

  it('can parse a formatted string', () => {
    expect(Day.parse(dayString)).toBeDefined();
    expect(Day.parse(dayString, 0)).toBeDefined();
  });

  it('can be parsed from a Day instance', () => {
    expect(new Day(day).equals(day)).toBeTruthy();
  });

  it('can be serialized to a string', () => {
    expect(day.toString()).toBeDefined();
    expect(day.equals(new Day(day.toString()))).toBeTruthy();
  });

  it('can be serialized to JSON', () => {
    expect(day.toJSON()).toStrictEqual(JSON.parse(JSON.stringify(day)));
  });

  it('can be compared', () => {
    const monday = new Day(dayString, 0);
    const tuesday = new Day(dayString, 1);

    expect(monday.compareTo(monday)).toBe(0);
    expect(monday.compareTo(tuesday)).toBeLessThan(0);
    expect(tuesday.compareTo(monday)).toBeGreaterThan(0);

    expect(monday.isAfter(tuesday)).toBeFalsy();
    expect(tuesday.isAfter(monday)).toBeTruthy();
  });
});
