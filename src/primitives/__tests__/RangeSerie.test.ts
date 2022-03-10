import { TimeRange } from '../TimeRange';
import { RangeSerie } from '../RangeSerie';
import { Time } from '../Time';

describe('RangeSerie class', () => {
  const timeRangeChain = new RangeSerie('08:30-10:30,06:30-07:30,07:30-10:30');

  describe('has', () => {
    it('should return true if a Range is in a Day', () => {
      expect(timeRangeChain.has(new TimeRange('08:30-10:30'))).toBe(true);
    });
    it('should return false if a Range is not in a Day', () => {
      expect(timeRangeChain.has(new TimeRange('08:30-11:30'))).toBe(false);
    });
  });

  describe('set', () => {
    test('can set ranges', () => {
      const rangeSet = new TimeRange('14:30-15:30');
      const serieSet = new RangeSerie(timeRangeChain).set(rangeSet);
      expect(serieSet.has(rangeSet)).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('can delete ranges', () => {
      const rangeSet = new TimeRange('14:30-15:30');
      const serieSet = new RangeSerie(timeRangeChain).set(rangeSet).delete(rangeSet.toString());
      expect(serieSet.has(rangeSet)).toBeFalsy();
    });
  });

  describe('replace', () => {
    it('should replace a Range with another Range', () => {
      const rangeSet = new TimeRange('14:30-15:30');
      const rangeReplace = new TimeRange('15:30-16:30');
      const rangeReplaceSame = new TimeRange('15:30-16:30');
      const serieSet = new RangeSerie(timeRangeChain).set(rangeSet);

      expect(serieSet.has(rangeSet)).toBeTruthy();
      expect(serieSet.replace(rangeSet.toString(), rangeReplace).has(rangeReplace)).toBeTruthy();
      expect(
        serieSet.replace(rangeReplaceSame.toString(), rangeReplace).has(rangeReplace),
      ).toBeTruthy();
    });
  });

  describe('contains', () => {
    const testChain = new RangeSerie('08:30-10:30,13:00-18:30');
    const testErrorChain = new RangeSerie('13:00-18:30,19:00-20:00');

    const data = [
      new Time('08:30'),
      new Time('09:00'),
      new Time('09:30'),
      new Time('10:30'),
      new TimeRange('08:30-10:30'),
      new TimeRange('09:00-10:00'),
      new TimeRange('09:15-10:00'),
      new TimeRange('08:45-10:00'),
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

  describe('slottable', () => {
    it('should return a splitted TimeRange', () => {
      expect(
        RangeSerie.slottable(30, '10:00-12:00').equals(
          new RangeSerie('10:00-10:30,10:30-11:00,11:00-11:30,11:30-12:00'),
        ),
      ).toBeTruthy();

      expect(
        RangeSerie.slottable(30, '10:00-12:00', { allowedMinutesOverflow: 30 }).equals(
          new RangeSerie('10:00-10:30,10:30-11:00,11:00-11:30,11:30-12:00,12:00-12:30'),
        ),
      ).toBeTruthy();

      expect(
        RangeSerie.slottable(30, '10:00-12:00', { timeRequired: 60 }).equals(
          new RangeSerie('10:00-11:00,10:30-11:30,11:00-12:00'),
        ),
      ).toBeTruthy();

      expect(
        RangeSerie.slottable(30, '10:00-12:00', {
          timeRequired: 60,
          allowedMinutesOverflow: 30,
        }).equals(new RangeSerie('10:00-11:00,10:30-11:30,11:00-12:00,11:30-12:30')),
      ).toBeTruthy();
    });
  });
});
