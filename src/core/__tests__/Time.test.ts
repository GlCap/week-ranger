import { Time } from '../Time';

const timeString = '12:30';
const timeAfterString = '14:05';
const timeBeforeString = '09:05';

const strings = [timeString, timeAfterString, timeBeforeString];
const stringsObjects = [
  [timeString, { hours: 12, minutes: 30 }],
  [timeAfterString, { hours: 14, minutes: 5 }],
  [timeBeforeString, { hours: 9, minutes: 5 }],
] as const;

describe('Time class', () => {
  describe('constructor', () => {
    const time = new Time(timeString);

    it('can be created without params', () => {
      expect(new Time()).toBeInstanceOf(Time);
    });

    it('can be created with numbers', () => {
      expect(new Time(14)).toBeInstanceOf(Time);
      expect(new Time(14, 30)).toBeInstanceOf(Time);
    });

    it('can be created from a Date', () => {
      expect(new Time(new Date())).toBeInstanceOf(Time);
    });

    it('can be created from a Time', () => {
      expect(new Time(time)).toBeDefined();
    });

    it('can be compared to a Date', () => {
      const date = new Date(0);
      expect(time.toDate(date)).toStrictEqual(date);
    });
  });

  describe('now', () => {
    const timeNow = Time.now();
    const dateNow = new Date();
    expect(new Time(timeNow).hours).toBe(dateNow.getHours());
    expect(new Time(timeNow).minutes).toBe(dateNow.getMinutes());
  });

  describe('parse', () => {
    it.each(stringsObjects)('it should parse %s to %o', (time, json) => {
      expect(Time.parse(time)).toStrictEqual(json);
      expect(new Time(time).toJSON()).toStrictEqual(json);
    });
    it.each(['12:000', '12', ':00', '24:00', '23:60'])(
      'should throw an error on invalid value %s',
      (time) => {
        expect(() => Time.parse(time)).toThrow();
      },
    );
  });

  describe('getters', () => {
    const time = new Time(timeString);
    it('hours should be 12', () => {
      expect(time.hours).toBe(12);
    });

    it('minutes should be 30', () => {
      expect(time.minutes).toBe(30);
    });
  });

  describe('equals', () => {
    it('should be equals to self', () => {
      const time = new Time(timeString);
      expect(time.equals(time)).toBeTruthy();
    });
  });

  describe('toString', () => {
    it.each(strings)('should serialize to %s', (time) => {
      expect(new Time(time).toString()).toBe(time);
    });
  });

  describe('toJSON', () => {
    it('should be serializable and de-serializable', () => {
      const time = new Time(timeString);
      const serialized = time.toJSON();
      expect(time).toStrictEqual(new Time(serialized));
    });
  });

  describe('toDate', () => {
    it('should be convertible to date', () => {
      const time = new Time(timeString);
      expect(time.toDate() instanceof Date).toBeTruthy();
      expect(time.toDate()).toStrictEqual(time.toDate());
    });
  });

  describe('compareTo', () => {
    it('should be comparable to another time', () => {
      const time = new Time(timeString);
      const timeAfter = new Time(timeAfterString);
      const timeBefore = new Time(timeBeforeString);
      expect(time.compareTo(new Time(time))).toBe(0);
      expect(time.compareTo(timeAfter)).toBeLessThan(0);
      expect(time.compareTo(timeBefore)).toBeGreaterThan(0);
    });
  });

  describe('isAfter', () => {
    it(`${timeString} should be after ${timeBeforeString}`, () => {
      const time = new Time(timeString);
      const timeBefore = new Time(timeBeforeString);

      expect(time.isAfter(timeBefore)).toBeTruthy();
      expect(timeBefore.isAfter(time)).toBeFalsy();
    });

    it(`${timeString} should not be after ${timeAfterString}`, () => {
      const time = new Time(timeString);
      const timeAfter = new Time(timeAfterString);

      expect(timeAfter.isAfter(time)).toBeTruthy();
      expect(time.isAfter(timeAfter)).toBeFalsy();
    });
  });

  describe('add', () => {
    it.each([
      [15, '09:15', '09:30'],
      [60, '09:15', '10:15'],
      [60 * 2, '09:15', '11:15'],
      [60 * 24, '09:15', '09:15'],
      [60 * 23, '09:15', '08:15'],
    ])('should add %i minutes to %s', (minutes, time, sum) => {
      expect(new Time(time).add(minutes).equals(new Time(sum))).toBe(true);
    });
  });
});