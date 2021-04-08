import { Day } from '../src/core/Day';
import { Week } from '../src/core/Week';

describe('Week class', () => {
  const stringFullWeek =
    '08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30';

  const stringWorkDays =
    '\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30';

  const stringMissingTuesdaySundaySaturday =
    '\n08:30-10:30,06:30-07:30,07:30-10:30\n\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30';

  it('can be instantiated by an object or an instance', () => {
    const week = new Week(stringFullWeek);
    expect(new Week(week)).toBeInstanceOf(Week);
    expect(new Week(week.toJSON())).toBeDefined();
  });

  it('can be created from a single Day', () => {
    const day = new Day('08:30-10:30,06:30-07:30,07:30-10:30');
    expect(new Week(day)).toBeInstanceOf(Week);
    expect(new Week(day).equals(new Week(stringFullWeek))).toBeTruthy();
  });

  it('should parse a correctly formatted string', () => {
    const week = new Week(stringFullWeek);
    expect(week).toBeInstanceOf(Week);
    expect(week.monday).toBeInstanceOf(Day);
    expect(week.tuesday).toBeInstanceOf(Day);
    expect(week.wednesday).toBeInstanceOf(Day);
    expect(week.thursday).toBeInstanceOf(Day);
    expect(week.friday).toBeInstanceOf(Day);
    expect(week.saturday).toBeInstanceOf(Day);
    expect(week.sunday).toBeInstanceOf(Day);

    const workWeek = new Week(stringWorkDays);
    expect(workWeek).toBeInstanceOf(Week);
    expect(workWeek.monday).toBeInstanceOf(Day);
    expect(workWeek.tuesday).toBeInstanceOf(Day);
    expect(workWeek.wednesday).toBeInstanceOf(Day);
    expect(workWeek.thursday).toBeInstanceOf(Day);
    expect(workWeek.friday).toBeInstanceOf(Day);
    expect(workWeek.saturday).toBeNull();
    expect(workWeek.sunday).toBeNull();

    const weekMissing = new Week(stringMissingTuesdaySundaySaturday);
    expect(weekMissing).toBeInstanceOf(Week);
    expect(weekMissing.sunday).toBeNull();
    expect(weekMissing.monday).toBeInstanceOf(Day);
    expect(weekMissing.tuesday).toBeNull();
    expect(weekMissing.wednesday).toBeInstanceOf(Day);
    expect(weekMissing.thursday).toBeInstanceOf(Day);
    expect(weekMissing.friday).toBeInstanceOf(Day);
    expect(weekMissing.saturday).toBeNull();
  });

  it('should throw on invalid string format', () => {
    const invalidWeek =
      '08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30';
    expect(() => new Week('')).toThrow();
    expect(() => Week.parse('')).toThrow();
    expect(() => Week.parse(invalidWeek)).toThrow();
  });

  it('can be serialized to a formatted string', () => {
    const week = new Week(stringFullWeek);
    expect(week.toString()).toStrictEqual(new Week(stringFullWeek).toString());
    expect(week.equals(new Week(week.toString()))).toBeTruthy();
  });

  it('can be serialized to JSON', () => {
    expect(new Week(stringFullWeek).toJSON()).toStrictEqual(
      JSON.parse(JSON.stringify(new Week(stringFullWeek))),
    );
  });

  it('can be compared to another instance', () => {
    expect(new Week(stringFullWeek).equals(new Week(stringFullWeek))).toBeTruthy();
  });
});
