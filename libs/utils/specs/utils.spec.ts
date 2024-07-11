import { isNullOrUndefined, getErrorMessage } from '../src';

describe('utils', () => {
  describe('isNullOrUndefined', () => {
    it('should verify if value is null or undefined', () => {
      const received = [
        null,
        undefined,
        0,
        '',
        1,
        'hi',
        [],
        {},
        new Date(),
      ].map((value) => isNullOrUndefined(value));

      expect(received).toEqual([
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
    });
  });

  describe('getErrorMessage', () => {
    it('should extract the error message', () => {
      const received = getErrorMessage(new Error('mock error'));
      expect(received).toEqual('mock error');
    });

    it('should falback to default error message', () => {
      const received = getErrorMessage({}, 'Default message');
      expect(received).toEqual('Default message');
    });

    it('should falback to standard error message if no default passed', () => {
      const received = getErrorMessage({});
      expect(received).toEqual('And error occurred');
    });
  });
});
