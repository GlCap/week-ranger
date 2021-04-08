import { Day } from '../src/core/Day';
import { Week } from '../src/core/Week';

describe('Week class', () => {
  const testFullWeek =
    '08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30';
  const testWorkDays =
    '\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30';

  it('can be instantiated by an object or an instance', () => {
    const week = new Week(testFullWeek);
    expect(new Week(week)).toBeInstanceOf(Week);
    expect(new Week(week.toJSON())).toBeDefined();
  });

  it('can be created from a single Day', () => {
    const day = new Day('08:30-10:30,06:30-07:30,07:30-10:30');
    expect(new Week(day)).toBeInstanceOf(Week);
    expect(new Week(day).equals(new Week(testFullWeek))).toBeTruthy();
  });

  it('should parse a correctly formatted string', () => {
    expect(new Week(testFullWeek)).toBeInstanceOf(Week);
    expect(new Week(testWorkDays)).toBeInstanceOf(Week);
  });

  it('should throw on invalid string format', () => {
    const invalidWeek =
      '08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30';
    expect(() => new Week('')).toThrow();
    expect(() => Week.parse('')).toThrow();
    expect(() => Week.parse(invalidWeek)).toThrow();
  });

  it('can be serialized to a formatted string', () => {
    expect(new Week(testFullWeek).toString()).toStrictEqual(new Week(testFullWeek).toString());
  });

  it('can be serialized to JSON', () => {
    expect(new Week(testFullWeek).toJSON()).toStrictEqual(
      JSON.parse(JSON.stringify(new Week(testFullWeek))),
    );
  });

  it('can be compared to another instance', () => {
    expect(new Week(testFullWeek).equals(new Week(testFullWeek))).toBeTruthy();
  });

  it('should return Days with valid ranges', () => {
    const week = new Week(testWorkDays);
    expect(week.monday).toBeInstanceOf(Day);
    expect(week.tuesday).toBeInstanceOf(Day);
    expect(week.wednesday).toBeInstanceOf(Day);
    expect(week.thursday).toBeInstanceOf(Day);
    expect(week.friday).toBeInstanceOf(Day);
    expect(week.saturday).toBeNull();
    expect(week.sunday).toBeNull();
  });
});
