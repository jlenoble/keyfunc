import {unequiv} from '../../src/keyfunc';
import {expect} from 'chai';

describe(`equiv factory example`, function () {
  it(``, function () {
    const uneq = unequiv({type: 'set', sub: {ntimes: 3}});

    const obj1 = {id: 1};
    const obj2 = {id: 2};
    const obj3 = {id: 3};
    const obj4 = {id: 3};

    expect(uneq(
      [obj1, obj2, obj3],
      [obj1, obj2, obj4],
      [obj1, obj3, obj4],
      [obj2, obj3, obj4]
    )).to.be.true;

    expect(uneq(
      [obj1, obj2, obj3],
      [obj1, obj2, obj4],
      [obj4, obj3, obj2], // Same set as last
      [obj1, obj3, obj4],
      [obj2, obj3, obj4]
    )).to.be.false;
  });
});
