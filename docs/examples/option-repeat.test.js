import keyfunc from '../../src/keyfunc';
import {expect} from 'chai';

describe(`Hint option 'repeat' example`, function () {
  it(``, function () {
    const key1 = keyfunc({type: 'literal', repeat: true});
    const key2 = keyfunc({type: 'literal'});

    const obj1 = {id: 1};
    const obj2 = {id: 2};

    expect(key1(obj1)).to.equal(key2(obj1));
    expect(() => key1(obj1, obj2)).not.to.throw();
    expect(() => key2(obj1, obj2)).to.throw();
  });
});
