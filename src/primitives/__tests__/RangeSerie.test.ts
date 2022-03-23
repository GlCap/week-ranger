import { TimeRange } from '../TimeRange';
import { RangeSerie } from '../RangeSerie';
import { Time } from '../Time';

describe('RangeSerie class', () => {
  const timeRangeChain = RangeSerie.fromString('08:30-10:30,06:30-07:30,07:30-10:30');

  describe('has', () => {
    it('should return true if a Range is in a Day', () => {
      expect(timeRangeChain.has(TimeRange.fromString('08:30-10:30'))).toBe(true);
    });
    it('should return false if a Range is not in a Day', () => {
      expect(timeRangeChain.has(TimeRange.fromString('08:30-11:30'))).toBe(false);
    });
  });

  describe('set', () => {
    test('can set ranges', () => {
      const rangeSet = TimeRange.fromString('14:30-15:30');
      const serieSet = new RangeSerie(timeRangeChain).set(rangeSet);
      expect(serieSet.has(rangeSet)).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('can delete ranges', () => {
      const rangeSet = TimeRange.fromString('14:30-15:30');
      const serieSet = new RangeSerie(timeRangeChain).set(rangeSet);
      serieSet.delete(rangeSet.toString());
      expect(serieSet.has(rangeSet)).toBeFalsy();
    });
  });

  describe('replace', () => {
    it('should replace a Range with another Range', () => {
      const rangeSet = TimeRange.fromString('14:30-15:30');
      const rangeReplace = TimeRange.fromString('15:30-16:30');
      const rangeReplaceSame = TimeRange.fromString('15:30-16:30');
      const serieSet = new RangeSerie(timeRangeChain).set(rangeSet);

      expect(serieSet.has(rangeSet)).toBeTruthy();
      expect(serieSet.replace(rangeSet.toString(), rangeReplace).has(rangeReplace)).toBeTruthy();
      expect(
        serieSet.replace(rangeReplaceSame.toString(), rangeReplace).has(rangeReplace),
      ).toBeTruthy();
    });
  });

  describe('contains', () => {
    const testChain = RangeSerie.fromString('08:30-10:30,13:00-18:30');
    const testErrorChain = RangeSerie.fromString('13:00-18:30,19:00-20:00');

    const data = [
      Time.fromString('08:30'),
      Time.fromString('09:00'),
      Time.fromString('09:30'),
      Time.fromString('10:30'),
      TimeRange.fromString('08:30-10:30'),
      TimeRange.fromString('09:00-10:00'),
      TimeRange.fromString('09:15-10:00'),
      TimeRange.fromString('08:45-10:00'),
    ];

    it.each(data)(
      `should return true or the containing range if %s is contained in ${testChain.toString()}`,
      (range) => {
        const extracted = testChain.contains(range, true);

        expect(extracted?.contains(range)).toBe(true);
        expect(testChain.contains(range)).toBe(true);
      },
    );

    it.each(data)(
      `should return false or null range if %s is not contained in ${testErrorChain.toString()}`,
      (range) => {
        const extracted = testErrorChain.contains(range, true);

        expect(extracted).toBe(null);
        expect(testErrorChain.contains(range)).toBe(false);
      },
    );
  });

  describe('fromArray', () => {
    it('should create an instance from an array', () => {
      expect(
        RangeSerie.fromArray([TimeRange.fromString('07:30-08:30'), '08:30-10:30']),
      ).toBeDefined();

      expect(RangeSerie.fromArray(['07:30-08:30', '08:30-10:30'])).toBeDefined();
    });
  });

  describe('slottable', () => {
    it('should return a splitted TimeRange', () => {
      expect(
        RangeSerie.slottable(30, '10:00-12:00').equals(
          RangeSerie.fromString('10:00-10:30,10:30-11:00,11:00-11:30,11:30-12:00'),
        ),
      ).toBeTruthy();

      expect(
        RangeSerie.slottable(30, '10:00-12:00', { allowedMinutesOverflow: 30 }).equals(
          RangeSerie.fromString('10:00-10:30,10:30-11:00,11:00-11:30,11:30-12:00,12:00-12:30'),
        ),
      ).toBeTruthy();

      expect(
        RangeSerie.slottable(30, '10:00-12:00', { timeRequired: 60 }).equals(
          RangeSerie.fromString('10:00-11:00,10:30-11:30,11:00-12:00'),
        ),
      ).toBeTruthy();

      expect(
        RangeSerie.slottable(30, '10:00-12:00', {
          timeRequired: 60,
          allowedMinutesOverflow: 30,
        }).equals(RangeSerie.fromString('10:00-11:00,10:30-11:30,11:00-12:00,11:30-12:30')),
      ).toBeTruthy();
    });
  });
});
