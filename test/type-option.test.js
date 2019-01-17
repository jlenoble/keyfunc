import {expect} from 'chai';
import sig from 'sig';
import keyfunc from '../src/keyfunc';

describe(`Testing 'option' hint`, function () {
  it(`Calling keyfunc({
    type: 'option',
    sub: {
      name: 'literal',
      fn: 'object'
    }
  })`, function () {
    const key = keyfunc({
      type: 'option',
      sub: {
        name: 'literal',
        fn: 'object',
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

    expect(key(obj)).to.equal(sig({
      name: sig('Albert'),
      fn: 'o1',
    }));

    expect(() => key(obj, obj)).to.throw(
      Error, `Inconsistent number of arguments`);
  });
});
