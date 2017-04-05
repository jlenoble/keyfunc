import {expect} from 'chai';
import sig from 'sig';
import keyfunc from '../src/keyfunc';

describe(`Testing deep identity for option 'optional'`, function () {
  it(`Calling keyfunc({
    type: 'option',
    sub: {
      name: 'literal',
      fn: {type: 'object', optional: true}
    }
  })`, function () {
    const key = keyfunc({
      type: 'option',
      sub: {
        name: 'literal',
        fn: {type: 'object', optional: true},
      },
    });

    const obj = {
      name: 'Albert',
      fn: console.error,
    };

    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({name: 'Albert', fn: console.error}));
    expect(key(obj)).to.equal(key({name: 'Albert', fn: console.error,
      dummy: 'dummy'}));

    expect(key(obj)).not.to.equal(key({name: 'Albert', fn: console.log}));
    expect(key(obj)).not.to.equal(key({name: 'Frida', fn: console.error}));

    expect(() => key({name: 'Albert'})).not.to.throw();
    expect(key(obj)).not.to.equal(key({name: 'Albert'})); // fn optional, but
    // not ignored

    expect(key(obj)).to.equal(sig({
      name: sig('Albert'),
      fn: 'o1',
    }));
    expect(key({name: 'Albert'})).to.equal(sig({
      name: sig('Albert'),
      fn: '0', // '0' is the key for all optional arg
    }));

    expect(() => key(obj, obj)).to.throw(
      Error, `Inconsistent number of arguments`);
  });
});
