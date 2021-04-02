import { Time } from '../src/core/Time';

const timeString = '12:30';
const timeAfterString = '14:30';
const timeBeforeString = '11:30';

describe('Time class', () => {
  const time = new Time(timeString);

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
  });

  it('can be created with numbers', () => {
    expect(new Time(14)).toBeDefined();
  });

  it('can be created from a Date', () => {
    expect(new Time(new Date()).toDate()).toBeDefined();
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
  });

  it('should be comparable to another time', () => {
    expect(time.compareTo(new Time(time))).toBe(0);
  });

  it(`${timeString} should be after ${timeBeforeString}`, () => {
    expect(time.isAfter(new Time(timeBeforeString))).toBeTruthy();
  });

  it(`${timeString} should not be after ${timeAfterString}`, () => {
    expect(time.isAfter(new Time(timeAfterString))).toBeFalsy();
  });
});
