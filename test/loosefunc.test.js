import {expect} from 'chai';
import signature from 'sig';
import looseFunc from '../src/loosefunc';

describe('Testing looseFunc', function() {

  it(`Calling looseFunc()` , function() {
    const key = looseFunc();

    expect(key(console)).to.equal(signature(console));
    expect(key({id: 1})).to.equal(signature({id: 1}));
    expect(key([1])).to.equal(signature([1]));
    expect(key(1)).to.equal(signature(1));
    expect(key('title')).to.equal(signature('title'));
  });

  it(`Calling looseFunc('key-')` , function() {
    const key = looseFunc('key-');

    expect(key(console)).to.equal('key-' + signature(console));
    expect(key({id: 1})).to.equal('key-' + signature({id: 1}));
    expect(key([1])).to.equal('key-' + signature([1]));
    expect(key(1)).to.equal('key-' + signature(1));
    expect(key('title')).to.equal('key-' + signature('title'));
  });

});
