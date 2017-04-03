import {expect} from 'chai';
import sig from 'sig';
import keyfunc from '../src/keyfunc';

describe(`Testing multi hints`, function () {
  it(`Hints as strings`, function () {
    const key = keyfunc('object', 'literal');

    expect(key(console, 'log')).to.equal(key(console, 'log'));
    expect(key(console, 'log')).to.equal(sig('o1' + sig('log')));
    expect(() => key(1, 2)).to.throw(
      'Function can only generate keys for objects,\nbut argument was: 1');

    expect(() => key(console, 'log', {color: 'red'})).to.throw(Error,
      `Inconsistent number of arguments, can't generate key`);
  });
});
