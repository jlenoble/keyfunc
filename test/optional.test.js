import {expect} from 'chai';
import signature from 'sig';
import keyFunc from '../src/keyfunc';

describe(`Testing deep identity for option 'optional'`, function () {
  it(`Calling keyFunc({
    type: 'option',
    sub: {
      name: 'literal',
      fn: {type: 'object', optional: true}
    }
  })`, function () {
    const key = keyFunc({
      type: 'option',
      sub: {
        name: 'literal',
        fn: {type: 'object', optional: true},
      },
      stem: 'key',
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

    expect(key(obj)).to.equal('key' + signature({
      name: signature('Albert'),
      fn: '1',
    }));
    expect(key({name: 'Albert'})).to.equal('key' + signature({
      name: signature('Albert'),
      fn: '0', // '0' is the key for all optional arg
    }));

    expect(() => key(obj, obj)).to.throw(
      Error, `Too many arguments, can't generate key`);
  });
});
