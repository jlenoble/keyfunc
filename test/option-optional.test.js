import {expect} from 'chai';
import sig from 'sig';
import keyfunc, {optionalKey} from '../src/keyfunc';

describe(`Testing option optional`, function () {
  it('In list of args', function () {
    const key = keyfunc('object', {
      type: 'literal',
      optional: true,
    }, 'ignore');

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};

    expect(key(o1, o2, o3)).to.equal(key(o1, o2, o1));
    expect(key(o1, o2, o3)).to.equal(key(o1, o2));
    expect(key(o1, o2, o3)).not.to.equal(key(o1, o3));

    expect(() => key(o1)).not.to.throw();

    expect(key(o1)).not.to.equal(key(o1, o2));
    expect(key(o1)).to.equal(sig('o1' + optionalKey));
  });

  it(`Testing deep identity with type option 'option'`, function () {
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
      fn: optionalKey,
    }));

    expect(() => key(obj, obj)).to.throw(
      Error, `Inconsistent number of arguments`);
  });
});
