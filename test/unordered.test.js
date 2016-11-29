import {expect} from 'chai';
import signature from 'sig';
import keyFunc from '../src/keyfunc';

describe(`Testing keyFunc with option 'unordered'`, function() {

  it(`Calling keyFunc({type: 'object', unordered: true})`,
  function() {
    const key = keyFunc({type: 'object', unordered: true});

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    expect(key(o1, o2, o3)).to.equal(key(o2, o1, o3));
    expect(key(o1, o2, o3)).to.equal(key(o2, o3, o1));
    expect(key(o1, o2, o3)).to.equal(key(o3, o2, o1));
  });

  it(`Calling keyFunc({type: 'object', unordered: true}, 'literal')`,
  function() {
    expect(() => keyFunc({type: 'object', unordered: true}, 'literal'))
      .to.throw(Error,
        `'unordered' option can only be used with a repeating single type`);
  });

  it(`Calling keyFunc('object', {type: 'object', unordered: true})`,
  function() {
    expect(() => keyFunc('object', {type: 'object', unordered: true}))
      .to.throw(Error,
        `'unordered' option can only be used with a repeating single type`);
  });

});
