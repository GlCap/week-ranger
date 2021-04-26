import { TimeRange } from '../TimeRange';
import { RangeSerie } from '../RangeSerie';

const chain = '08:30-10:30,06:30-07:30,07:30-10:30';

describe('TimeRangeChain class', () => {
  const timeRangeChain = new RangeSerie(chain);

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
      const daySet = new RangeSerie(timeRangeChain).set(rangeSet);
      expect(daySet.has(rangeSet)).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('can delete ranges', () => {
      const rangeSet = new TimeRange('14:30-15:30');
      const daySet = new RangeSerie(timeRangeChain).set(rangeSet).delete(rangeSet.toString());
      expect(daySet.has(rangeSet)).toBeFalsy();
    });
  });

  describe('replace', () => {
    it('should replace a Range with another Range', () => {
      const rangeSet = new TimeRange('14:30-15:30');
      const rangeReplace = new TimeRange('15:30-16:30');
      const rangeReplaceSame = new TimeRange('15:30-16:30');
      const daySet = new RangeSerie(timeRangeChain).set(rangeSet);

      expect(daySet.has(rangeSet)).toBeTruthy();
      expect(daySet.replace(rangeSet.toString(), rangeReplace).has(rangeReplace)).toBeTruthy();
      expect(
        daySet.replace(rangeReplaceSame.toString(), rangeReplace).has(rangeReplace),
      ).toBeTruthy();
    });
  });
});
