import { RangeSerie } from '../../primitives';
import { Day } from '../Day';
import { Week } from '../Week';

const stringFullWeek =
  '08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30';

const stringWorkDays =
  '\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30';

const stringMissingTuesdaySundaySaturday =
  '\n08:30-10:30,06:30-07:30,07:30-10:30\n\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30';
const invalidWeek =
  '08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30\n08:30-10:30,06:30-07:30,07:30-10:30';

describe('Week class', () => {
  describe('constructor', () => {
    const week = new Week(stringFullWeek);
    it('should instance from an object', () => {
      expect(new Week(week.toJSON())).toBeDefined();
    });

    it('should instance from another instance', () => {
      expect(new Week(week)).toBeInstanceOf(Week);
    });

    it('should instance from a Day', () => {
      const serie = new RangeSerie('08:30-10:30,06:30-07:30,07:30-10:30');
      expect(new Week(serie)).toBeInstanceOf(Week);
      expect(new Week(serie).equals(new Week(stringFullWeek))).toBeTruthy();
    });
  });

  describe('parse', () => {
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
      expect(workWeek.saturday).toBeInstanceOf(Day);
      expect(workWeek.sunday).toBeInstanceOf(Day);

      const weekMissing = new Week(stringMissingTuesdaySundaySaturday);
      expect(weekMissing).toBeInstanceOf(Week);
      expect(weekMissing.sunday).toBeInstanceOf(Day);
      expect(weekMissing.monday).toBeInstanceOf(Day);
      expect(weekMissing.tuesday).toBeInstanceOf(Day);
      expect(weekMissing.wednesday).toBeInstanceOf(Day);
      expect(weekMissing.thursday).toBeInstanceOf(Day);
      expect(weekMissing.friday).toBeInstanceOf(Day);
      expect(weekMissing.saturday).toBeInstanceOf(Day);
    });

    it('should throw on invalid string format', () => {
      expect(() => new Week('')).toThrow();
      expect(() => Week.parse('')).toThrow();
      expect(() => Week.parse(invalidWeek)).toThrow();
    });
  });

  describe('toString', () => {
    it('can be serialized to a formatted string', () => {
      const week = new Week(stringFullWeek);
      expect(week.toString()).toStrictEqual(new Week(stringFullWeek).toString());
      expect(week.equals(new Week(week.toString()))).toBeTruthy();
    });
  });

  describe('toJSON', () => {
    it('can be serialized to JSON', () => {
      expect(new Week(stringFullWeek).toJSON()).toStrictEqual(
        JSON.parse(JSON.stringify(new Week(stringFullWeek))),
      );
    });
  });

  describe('equals', () => {
    it('can be compared to another instance', () => {
      expect(new Week(stringFullWeek).equals(new Week(stringFullWeek))).toBeTruthy();
    });
  });
});
