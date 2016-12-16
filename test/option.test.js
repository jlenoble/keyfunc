import {expect} from 'chai';
import signature from 'sig';
import keyFunc from '../src/keyfunc';

describe(`Testing deep identity for option 'option'`, function() {

  it(`Calling keyFunc({
    type: 'option',
    sub: {
      name: 'literal',
      func: 'object'
    }
  })`, function() {
    const key = keyFunc({
      type: 'option',
      sub: {
        name: 'literal',
        fn: 'object'
      },
      stem: 'key'
    });

    const obj = {
      name: 'Albert',
      fn: console.error
    };

    expect(key(obj)).to.equal(key(obj));
    expect(key(obj)).to.equal(key({name: 'Albert', fn: console.error}));
    expect(key(obj)).not.to.equal(key({name: 'Albert', fn: console.log}));
    expect(key(obj)).not.to.equal(key({name: 'Frida', fn: console.error}));
    expect(key(obj)).to.equal('key' + signature({
      name: signature('Albert'),
      fn: '1'
    }));

    expect(() => key(obj, obj)).to.throw(
      Error, `Too many arguments, can't generate key`);
  });

});
