import sig from 'sig';
import {expect} from 'chai';
import keyfunc from '../src/keyfunc';

describe(`Testing option ntimes`, function () {
  it(`Single hint`, function () {
    const key1 = keyfunc({type: 'object', ntimes: 5});
    const key2 = keyfunc('object', 'object', 'object', 'object', 'object');

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    const o4 = {id: 4};
    const o5 = {id: 5};

    expect(key1(o1, o2, o3, o4, o5)).to.equal(key1(o1, o2, o3, o4, o5));
    expect(key1(o1, o2, o3, o4, o5)).to.equal(sig('o1o2o3o4o5'));

    // key1 uses 1 single keyFunc, key2 uses 5 different keyFuncs
    expect(key1(o1, o2, o3, o4, o5)).not.to.equal(key2(o1, o2, o3, o4, o5));
    expect(key2(o1, o2, o3, o4, o5)).to.equal(sig('o1o1o1o1o1'));

    // The number of arguments must be exactly ntimes
    expect(() => key1(o1, o2, o3, o4)).to.throw(Error,
      `Inconsistent number of arguments, can't generate key`);
    expect(() => key1(o1, o2, o3, o4, o5, o1)).to.throw(Error,
      `Inconsistent number of arguments, can't generate key`);
  });

  it(`Multi hints`, function () {
    const key1 = keyfunc({
      type: 'object', ntimes: 2,
    }, {
      type: 'literal', ntimes: 3,
    });

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    const o4 = {id: 4};
    const o5 = {id: 5};

    expect(key1(o1, o2, o3, o4, o5)).to.equal(key1(o1, o2, o3, o4, o5));
    expect(key1(o1, o2, o3, o4, o5)).to.equal(key1(o1, o2, o3, {id: 4}, o5));
    expect(key1(o1, o2, o3, o4, {id: 5})).to.equal(
      key1(o1, o2, o3, {id: 4}, o5));
    expect(key1(o1, o2, o3, o4, o5)).not.to.equal(
      key1(o1, {id: 2}, o3, o4, o5));

    // !!! key1 and key2 use different schemes to generate their keys
    const key2 = keyfunc('object', 'object', 'literal', 'literal', 'literal');
    expect(key1(o1, o2, o3, o4, o5)).not.to.equal(key2(o1, o2, o3, o4, o5));
  });

  it(`Single hint as type 'array'`, function () {
    const key1 = keyfunc({
      type: 'array',
      sub: {
        ntimes: 5,
      },
    });
    const key2 = keyfunc({
      type: 'array',
      sub: ['object', 'object', 'object', 'object', 'object'],
    });

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    const o4 = {id: 4};
    const o5 = {id: 5};

    expect(() => key1([o1, o2, o3, o4, o5])).not.to.throw();
    expect(key1([o1, o2, o3, o4, o5])).to.equal(key1([o1, o2, o3, o4, o5]));

    // key1 uses 1 single keyFunc, key2 uses 5 different keyFuncs
    expect(key1([o1, o2, o3, o4, o5])).not.to.equal(key2([o1, o2, o3, o4, o5]));

    // The number of elements must be exactly ntimes
    expect(() => key1([o1, o2, o3, o4])).to.throw(Error,
      `Inconsistent number of elements, can't generate key`);
    expect(() => key1([o1, o2, o3, o4, o5, o1])).to.throw(Error,
      `Inconsistent number of elements, can't generate key`);
  });
});
