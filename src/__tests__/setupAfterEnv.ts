/* eslint-disable @typescript-eslint/no-unused-vars */
declare global {
  namespace jest {
    interface Expect {
      toEqualAnyOf: (argument: any[]) => any,
    }
  }
}

expect.extend({
  toEqualAnyOf(received: any, argument: any[]) {
    const found = argument.some((eqItem) => {
      // undefined
      if (typeof eqItem === 'undefined' && typeof received === 'undefined') {
        return true;
      }
      // null
      if (eqItem === null && received === null) {
        return true;
      }
      // any expect.<any> or direct value
      try {
        expect(received).toEqual(eqItem);
        return true;
      } catch (e) {
        return false;
      }
    });
    return found
      ? {
        message: () => 'Ok',
        pass: true,
      }
      : {
        message: () => `expected ${received} to be any of ${argument}`,
        pass: false,
      };
  },
});

export default undefined;
