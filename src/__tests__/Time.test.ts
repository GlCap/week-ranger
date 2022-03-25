import { DateTime } from 'luxon';
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
    const time = Time.fromString(timeString);

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
  });

  describe('getters', () => {
    const time = Time.fromString(timeString);
    it('hours should be 12', () => {
      expect(time.hours).toBe(12);
    });

    it('minutes should be 30', () => {
      expect(time.minutes).toBe(30);
    });
  });

  describe('now', () => {
    const dateNow = new Date();
    const timeNow = Time.now();
    const testTime = Time.fromString(timeNow);

    expect(testTime.hours).toStrictEqual(dateNow.getUTCHours());
    expect(testTime.minutes).toStrictEqual(dateNow.getUTCMinutes());
  });

  describe('fromString', () => {
    it.each(stringsObjects)('it should parse %s to %o', (time, json) => {
      expect(Time.fromString(time).toJSON()).toStrictEqual(json);
    });
    it.each(['12:000', '12', ':00', '24:00', '23:60'])(
      'should throw an error on invalid value %s',
      (time) => {
        expect(() => Time.fromString(time)).toThrow();
      },
    );
  });

  describe('equals', () => {
    it('should be equals to self', () => {
      const time = Time.fromString(timeString);
      expect(time.equals(time)).toBeTruthy();
    });
  });

  describe('toString', () => {
    it.each(strings)('should serialize to %s', (time) => {
      expect(Time.fromString(time).toString()).toBe(time);
    });
  });

  describe('toLocaleString', () => {
    it.each(Array.from({ length: 24 }, (_, k) => k))('should serialize to %s', (hours) => {
      const now = new Date();
      const timeZoneOffset = now.getTimezoneOffset();
      const localTime = new Time(now.setUTCHours(hours));
      const utcTime = localTime.add(timeZoneOffset);

      expect(localTime.toString()).toBe(utcTime.toLocaleString());
    });
  });

  describe('toJSON', () => {
    it('should be serializable and de-serializable', () => {
      const time = Time.fromString(timeString);
      const serialized = time.toJSON();
      expect(time).toStrictEqual(new Time(serialized));
    });
  });

  describe('toDate', () => {
    it('should be convertible to Date', () => {
      const time = Time.fromString(timeString);
      expect(time.toDate() instanceof Date).toBeTruthy();
      expect(time.hours).toBe(time.toDate().getUTCHours());
      expect(time.minutes).toBe(time.toDate().getUTCMinutes());
    });
  });

  describe('toDate', () => {
    it('should be convertible to DateTime', () => {
      const time = Time.fromString(timeString);
      expect(time.toDateTime() instanceof DateTime).toBeTruthy();
      expect(time.hours).toBe(time.toDateTime().hour);
      expect(time.minutes).toBe(time.toDateTime().minute);
    });
  });

  describe('compareTo', () => {
    it('should compare times', () => {
      const time = Time.fromString(timeString);
      const timeAfter = Time.fromString(timeAfterString);
      const timeBefore = Time.fromString(timeBeforeString);

      expect(time.compareTo(timeAfter)).toBeLessThan(0);
      expect(timeAfter.compareTo(time)).toBeGreaterThan(0);

      expect(time.compareTo(timeBefore)).toBeGreaterThan(0);
      expect(timeBefore.compareTo(time)).toBeLessThan(0);
    });

    it('should compare times in Standard Time and Daylight Saving Time', () => {
      const jan = new Time(new Date(Date.UTC(new Date().getFullYear(), 0, 1)));
      const jul = new Time(new Date(Date.UTC(new Date().getFullYear(), 6, 1)));

      expect(jan.compareTo(jul)).toBe(0);
      expect(jul.compareTo(jan)).toBe(0);
      expect(jan.compareTo(jan)).toBe(0);
      expect(jul.compareTo(jul)).toBe(0);
    });
  });

  describe('isAfter', () => {
    it(`${timeString} should be after ${timeBeforeString}`, () => {
      const time = Time.fromString(timeString);
      const timeBefore = Time.fromString(timeBeforeString);

      expect(time.isAfter(timeBefore)).toBeTruthy();
      expect(timeBefore.isAfter(time)).toBeFalsy();
    });

    it(`${timeString} should not be after ${timeAfterString}`, () => {
      const time = Time.fromString(timeString);
      const timeAfter = Time.fromString(timeAfterString);

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
      expect(Time.fromString(time).add(minutes).equals(Time.fromString(sum))).toBe(true);
    });
  });
  describe('sub', () => {
    it.each([
      [15, '09:15', '09:00'],
      [60, '09:15', '08:15'],
      [60 * 2, '09:15', '07:15'],
      [60 * 24, '09:15', '09:15'],
      [60 * 23, '09:15', '10:15'],
    ])('should subtract %i minutes from %s', (minutes, time, diff) => {
      expect(Time.fromString(time).sub(minutes).equals(Time.fromString(diff))).toBe(true);
    });
  });
});
