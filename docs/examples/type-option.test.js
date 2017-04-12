import keyfunc from '../../src/keyfunc';
import {expect} from 'chai';

describe(`Hint type 'option' example`, function () {
  it(``, function () {
    const key1 = keyfunc({
      type: 'option',
      sub: {
        id: 'literal',
        name: 'literal',
      },
    });
    const key2 = keyfunc({
      type: 'option',
      sub: {
        id: 'literal',
        name: 'literal',
      },
    }, {
      type: 'option',
      sub: {
        name: 'literal',
      },
    });

    const obj1 = {id: 1, name: 'Joe'};
    const obj2 = {id: 2, name: 'Jane'};
    const obj3 = {id: 3, name: 'Joyce'};

    const k1 = key1(obj1);
    const k2 = key2(obj1, obj2);

    expect(key1(obj1)).to.equal(k1);
    expect(key1(obj2)).not.to.equal(k1);
    expect(key1({id: 1, name: 'Joe'})).to.equal(k1);

    expect(key2(obj1, obj2)).to.equal(k2);
    expect(key2(obj1, obj3)).not.to.equal(k2);
    expect(key2(obj2, obj1)).not.to.equal(k2);
    expect(key2({id: 1, name: 'Joe'}, {name: 'Jane'})).to.equal(k2);
  });
});
