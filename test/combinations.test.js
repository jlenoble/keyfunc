import {expect} from 'chai';
import keyFunc from '../src/keyfunc';
import signature from 'sig';

describe('Testing combinations', function() {

  describe('Single argument', function() {

    it(`keyword 'strict'` , function() {
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

    it(`keyword 'loose'` , function() {
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

    it(`option 'idProperty'` , function() {
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

    it(`option 'stem'` , function() {
      const stem = '_key-';
      const key = keyFunc({stem: stem});
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
      expect(key(1)).to.equal(stem + signature(1));
      expect(key('foo')).to.equal(stem + signature('foo'));
      expect(key(Number)).to.equal(stem + 1);
      expect(key(Object)).to.equal(stem + 2);
      expect(key({id: 1})).to.equal(stem + 15);
      expect(key({a: 0, uid: 1})).to.equal(stem + 16);
      expect(key({uid: {a: 1, b: 2}})).to.equal(stem + 17);
      expect(key([1, 2, 3])).to.equal(stem + 18);
      expect(key(console)).to.equal(stem + 11);
      expect(key(key)).to.equal(stem + 12);
      expect(key(function() {})).to.equal(stem + 19);
    });

    it(`options 'idProperty', 'loose'` , function() {
      const key = keyFunc({idProperty: 'uid', loose: true});
      expect(() => key(1)).to.throw(ReferenceError);
      expect(() => key('foo')).to.throw(ReferenceError);
      expect(() => key(Number)).to.throw(ReferenceError);
      expect(() => key(Object)).to.throw(ReferenceError);
      expect(() => key({id: 1})).to.throw(ReferenceError);
      expect(key({a: 0, uid: 1})).to.equal(key({uid: 1, a: 0}));
      expect(key({uid: {a: 1, b: 2}})).to.equal(key({uid: {b: 2, a: 1}}));
      expect(() => key([1, 2, 3])).throw(ReferenceError);
      expect(() => key(console)).to.throw(ReferenceError);
      expect(() => key(key)).to.throw(ReferenceError);
      expect(() => key(function() {}).to.throw(ReferenceError));
      expect(key({a: 0, uid: 1})).to.equal('key' + signature(1));
      expect(key({uid: {a: 1, b: 2}})).to.equal('key' +
        signature({a: 1, b: 2}));
    });

    it(`option 'stem', 'loose'` , function() {
      const stem = '_key-';
      const key = keyFunc({stem: stem, loose: true});
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
      expect(key(1)).to.equal(stem + signature(1));
      expect(key('foo')).to.equal(stem + signature('foo'));
      expect(key({id: 1})).to.equal(stem + signature({id: 1}));
      expect(key({a: 0, uid: 1})).to.equal(stem + signature({a: 0, uid: 1}));
      expect(key({uid: {a: 1, b: 2}})).to.equal(stem +
        signature({uid: {a: 1, b: 2}}));
      expect(key([1, 2, 3])).to.equal(stem + signature([1, 2, 3]));
      expect(key(console)).to.equal(stem + signature(console));
    });

  });

  describe('Multiple arguments', function() {

    it(`['strict', 'loose', 'loose' , 'strict']`, function() {
      const key = keyFunc('strict', 'loose', 'loose' , 'strict');
      expect(key(console, {a: 3}, {a: 2}, Number)).to.equal(
        `key1_key${signature({a:3})}_key${signature({a:2})}_key1`);
      expect(key(console, {a: 3}, {a: 2}, Number)).to.equal(
        `key1_key${signature({a:3})}_key${signature({a:2})}_key1`);
      expect(key(String, {a: 7}, {a: 9}, Number)).to.equal(
        `key2_key${signature({a:7})}_key${signature({a:9})}_key1`);
    });

    it(`[{idProperty: 'name', stem: 'name-'}, {idProperty: 'title',` +
      ` stem: 'title-', loose: true}, 'strict']`, function() {
      const key = keyFunc({idProperty: 'name', stem: 'name-'},
        {idProperty: 'title', stem: 'title-', loose: true}, 'strict');
      const named1 = {name: 'Adam'};
      const named2 = {name: 'Eve'};
      expect(key(named1, {title: 'title 1'}, named1)).to.equal(
        `name-${signature('Adam')}_title-${signature('title 1')}_key1`);
      expect(key(named2, {title: 'title 2'}, named1)).to.equal(
        `name-${signature('Eve')}_title-${signature('title 2')}_key1`);
      expect(key(named1, {title: 'title 1'}, named2)).to.equal(
        `name-${signature('Adam')}_title-${signature('title 1')}_key2`);
    });

  });

});
