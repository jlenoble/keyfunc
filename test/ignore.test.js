import {expect} from 'chai';
import signature from 'sig';
import keyFunc from '../src/keyfunc';

describe(`Testing keyFunc with type 'ignore'`, function () {
  it(`Calling keyFunc('literal', 'ignore')`,
  function () {
    const key = keyFunc('literal', 'ignore');

    expect(key('first', 'second')).to.equal(signature('first'));
    expect(key('first')).to.equal(signature('first'));
    expect(() => key('first', 'second', 'third')).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

  it(`Calling keyFunc({
    type: 'array',
    sub: ['object', 'ignore', 'literal']
  }, 'literal')`,
  function () {
    const key = keyFunc({
      type: 'array',
      sub: ['literal', 'ignore', 'literal'],
    }, 'literal');

    expect(key(['first', 'second', 'third'], 'fourth')).to.equal(
      signature([
        signature('first') + '_' + signature('third'),
      ]) + '_' + signature('fourth'));
  });
});
