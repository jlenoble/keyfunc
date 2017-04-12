import keyfunc from '../../src/keyfunc';
import {expect} from 'chai';

describe(`Hint option 'optional' example`, function () {
  it(``, function () {
    const key = keyfunc({type: 'array', optional: true});

    const obj1 = {id: 1};
    const obj2 = {id: 2};
    const obj3 = {id: 3};
    const obj4 = {id: 4};

    const k = key([obj1, obj2]);

    expect(key([obj1, obj2])).to.equal(k);
    expect(() => key([obj1, obj2], [obj3, obj4])).to.throw();
    expect(() => key()).not.to.throw();
  });
});
