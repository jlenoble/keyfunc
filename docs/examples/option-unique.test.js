import keyfunc from '../../src/keyfunc';
import {expect} from 'chai';

describe(`Hint option 'unique' example`, function () {
  it(``, function () {
    const key1 = keyfunc({type: 'literal', unique: true});
    const key2 = keyfunc({type: 'literal'});

    const obj = {id: 1};

    expect(key1(obj)).to.equal(key2(obj));
    expect(() => key1(obj, obj)).not.to.throw();
    expect(() => key2(obj, obj)).to.throw();
    expect(key1(obj, obj)).to.equal(key2(obj));
  });
});
