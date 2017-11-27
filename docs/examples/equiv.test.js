import {equiv} from '../../src/keyfunc';
import {expect} from 'chai';

describe(`equiv factory example`, function () {
  it(``, function () {
    const eq = equiv({type: 'set', sub: {ntimes: 3}});

    const obj1 = {id: 1};
    const obj2 = {id: 2};
    const obj3 = {id: 3};
    const obj4 = {id: 3};

    expect(eq(
      [obj1, obj2, obj3],
      [obj1, obj3, obj2],
      [obj2, obj1, obj3],
      [obj2, obj3, obj1],
      [obj3, obj1, obj2],
      [obj3, obj2, obj1]
    )).to.be.true;

    expect(eq(
      [obj1, obj2, obj3],
      [obj1, obj2, obj4]
    )).to.be.false;

    expect(eq(
      [obj1, obj2, obj3],
      [obj1, obj3, obj2],
      [obj2, obj1, obj3],
      [obj2, obj4, obj1], // mismatch here
      [obj3, obj1, obj2],
      [obj3, obj2, obj1]
    )).to.be.false;
  });
});
