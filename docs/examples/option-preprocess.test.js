import keyfunc from '../../src/keyfunc';
import {expect} from 'chai';

describe(`Hint option 'preprocess' example`, function () {
  it(``, function () {
    const key = keyfunc({
      type: 'literal',
      preprocess: (func, ...args) => {
        if (typeof func === 'function') {
          return func(...args);
        } else {
          return func;
        }
      },
    });

    function fn (name, id) {
      return {name, id};
    }

    expect(key(fn, 'Joe', 22)).to.equal(key({name: 'Joe', id: 22}));
  });
});
