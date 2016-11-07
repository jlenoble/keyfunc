import {expect} from 'chai';
import keyFunc from '../src/keyfunc';

describe('Testing README.md examples', function() {

  it(`Example Single argument/keyword 'strict'` , function() {
    const key = keyFunc('strict');
    expect(key(1)).to.equal(key(1));
    expect(key('foo')).to.equal(key('foo'));
    expect(key(Number)).to.equal(key(Number));
    expect(key(Object)).to.equal(key(Object));
    expect(key({id: 1})).not.to.equal(key({id: 1}));
    expect(key({a: 0, uid: 1})).not.to.equal(key({uid: 1, a: 0}));
    expect(key({uid: {a: 1, b: 2}})).not.to.equal(key({uid: {b: 2, a: 1}}));
    expect(key([1, 2, 3])).not.to.equal(key([1, 2, 3]));
    expect(key(console)).to.equal(key(console));
    expect(key(key)).to.equal(key(key));
    expect(key(function() {})).not.to.equal(key(function() {}));
  });

  it(`Example Single argument/keyword 'loose'` , function() {
    const key = keyFunc('loose');
    expect(key(1)).to.equal(key(1));
    expect(key('foo')).to.equal(key('foo'));
    expect(() => key(Number)).to.throw(TypeError);
    expect(() => key(Object)).to.throw(TypeError);
    expect(key({id: 1})).to.equal(key({id: 1}));
    expect(key({a: 0, uid: 1})).to.equal(key({uid: 1, a: 0}));
    expect(key({uid: {a: 1, b: 2}})).to.equal(key({uid: {b: 2, a: 1}}));
    expect(key([1, 2, 3])).to.equal(key([1, 2, 3]));
    expect(key(console)).to.equal(key(console));
    expect(() => key(key)).to.throw(TypeError);
    expect(() => key(function() {})).to.throw(TypeError);
  });

  it(`Example Single argument/option 'idProperty'` , function() {
    const key = keyFunc({idProperty: 'uid'});
    expect(() => key(1)).to.throw(ReferenceError);
    expect(() => key('foo')).to.throw(ReferenceError);
    expect(() => key(Number)).to.throw(ReferenceError);
    expect(() => key(Object)).to.throw(ReferenceError);
    expect(() => key({id: 1})).to.throw(ReferenceError);
    expect(key({a: 0, uid: 1})).to.equal(key({uid: 1, a: 0}));
    expect(key({uid: {a: 1, b: 2}})).not.to.equal(key({uid: {b: 2, a: 1}}));
    expect(() => key([1, 2, 3])).throw(ReferenceError);
    expect(() => key(console)).to.throw(ReferenceError);
    expect(() => key(key)).to.throw(ReferenceError);
    expect(() => key(function() {}).to.throw(ReferenceError));
  });

});
