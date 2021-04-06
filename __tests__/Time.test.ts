import { Time } from '../src/core/Time';

const timeString = '12:30';
const timeAfterString = '14:30';
const timeBeforeString = '09:05';

describe('Time class', () => {
  const time = new Time(timeString);
  const timeAfter = new Time(timeAfterString);
  const timeBefore = new Time(timeBeforeString);

  it(`should be equal to ${timeString}`, () => {
    expect(time.toString()).toBe(timeString);
  });

  it('hours should be 12', () => {
    expect(time.hours).toBe(12);
  });

  it('minutes should be 30', () => {
    expect(time.minutes).toBe(30);
  });

  it('can be created without params', () => {
    expect(new Time()).toBeDefined();
    expect(new Time().equals(new Time())).toBeTruthy();
  });

  it('can be created with numbers', () => {
    expect(new Time(14)).toBeDefined();
    expect(new Time(14).equals(new Time(14))).toBeTruthy();
  });

  it('can be created from a Date', () => {
    const now = new Date();
    const time = new Time(now);
    expect(time).toBeDefined();
    expect(time.equals(new Time(now))).toBeTruthy();
  });

  it('can be created from a Time', () => {
    expect(new Time(time)).toBeDefined();
  });

  it('can be compared to a Date', () => {
    const date = new Date(0);
    expect(time.toDate(date)).toStrictEqual(date);
  });

  it('parse throws an error on invalid value', () => {
    expect(() => Time.parse('12:000')).toThrow();
    expect(() => Time.parse('12')).toThrow();
    expect(() => Time.parse(':00')).toThrow();
  });

  it('should be equals to self', () => {
    expect(time.equals(time)).toBeTruthy();
  });

  it('should be serializable and de-serializable', () => {
    const serialized = time.toJSON();
    expect(time).toStrictEqual(new Time(serialized));
  });

  it('should be convertible to date', () => {
    expect(time.toDate() instanceof Date).toBeTruthy();
    expect(time.toDate()).toStrictEqual(time.toDate());
  });

  it('can be converted to a formatted string', () => {
    expect(time.toString()).toStrictEqual(timeString);
    expect(timeAfter.toString()).toStrictEqual(timeAfterString);
    expect(timeBefore.toString()).toStrictEqual(timeBeforeString);
  });

  it('should be comparable to another time', () => {
    expect(time.compareTo(new Time(time))).toBe(0);
    expect(time.compareTo(timeAfter)).toBeLessThan(0);
    expect(time.compareTo(timeBefore)).toBeGreaterThan(0);
  });

  it(`${timeString} should be after ${timeBeforeString}`, () => {
    expect(time.isAfter(timeBefore)).toBeTruthy();
    expect(timeBefore.isAfter(time)).toBeFalsy();
  });

  it(`${timeString} should not be after ${timeAfterString}`, () => {
    expect(timeAfter.isAfter(time)).toBeTruthy();
    expect(time.isAfter(timeAfter)).toBeFalsy();
  });
});
