import keyfunc from '../../src/keyfunc';
import {expect} from 'chai';

describe(`Hint option 'unordered' example`, function () {
  it(``, function () {
    const key = keyfunc({type: 'array', unordered: true});

    const obj1 = {id: 1};
    const obj2 = {id: 2};
    const obj3 = {id: 3};
    const obj4 = {id: 4};

    const k = key([obj1, obj2], [obj3], [obj4]);

    expect(key([obj1, obj2], [obj3], [obj4])).to.equal(k);
    expect(key([obj1, obj2], [obj4], [obj3])).to.equal(k);
    expect(key([obj1, obj2], [obj3], [{id: 4}])).not.to.equal(k);
    expect(key([obj2, obj1], [obj3], [obj4])).not.to.equal(k);
  });
});
