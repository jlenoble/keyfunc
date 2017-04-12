import keyfunc from '../../src/keyfunc';
import {expect} from 'chai';

describe(`Hint option 'sub' example`, function () {
  it(``, function () {
    const key1 = keyfunc({type: 'array', sub: ['object', 'literal']});
    const key2 = keyfunc({type: 'option', sub: {
      name: 'literal',
      elements: {type: 'array', sub: {type: 'literal', unordered: true}},
    }});

    const obj = {id: 1, name: 'team', elements: ['Joe', 'Bob', 'Karl']};

    const k1 = key1([obj, 'new']);
    const k2 = key2(obj);

    expect(key1([obj, 'new'])).to.equal(k1);
    expect(key1([obj, 'old'])).not.to.equal(k1);
    expect(key1([{id: 1, name: 'team'}, 'new'])).not.to.equal(k1);

    expect(key2(obj)).to.equal(k2);
    expect(key2({id: 1, name: 'team', elements: [
      'Karl', 'Bob', 'Joe']})).to.equal(k2);
    expect(key2({id: 1, name: 'team2', elements: [
      'Joe', 'Bob', 'Karl']})).not.to.equal(k2);
  });
});
