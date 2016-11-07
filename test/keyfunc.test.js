import {expect} from 'chai';
import keyFunc from '../src/keyfunc';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import signature from 'sig';

describe('Testing keyFunc', function() {

  it(`for args (Number)` , function() {
    const key = keyFunc('strict');
    expect(key(10)).to.equal(key(10));
    expect(key(10)).not.to.equal(key(11));
    expect(key(10)).not.to.equal(key('10'));
  });

  it(`for args (String)` , function() {
    const key = keyFunc('strict');
    expect(key('10')).to.equal(key('10'));
    expect(key('10')).not.to.equal(key('11'));
    expect(key('10')).not.to.equal(key(10));
  });

  it(`for args (console, String)` , function() {
    const key = keyFunc('strict', 'strict');
    expect(key(console, 'log')).to.equal(key(console, 'log'));
    expect(key(console, 'log')).not.to.equal(key(console, 'info'));
  });

  it(`for args (plugin, Object)` , function() {
    const key = keyFunc('strict', 'loose');
    expect(key(babel)).to.equal(key(babel));
    expect(key(babel)).not.to.equal(key(rename));
    expect(key(rename, {suffix: '-renamed'})).to.equal(key(
      rename, {suffix: '-renamed'}
    ));
    expect(key(rename, {suffix: '-renamed'})).not.to.equal(key(
      rename, {suffix: '-original'}
    ));
  });

  it(`for options ({idProperty: 'uid'})`, function() {
    const key = keyFunc({idProperty: 'uid'});
    expect(key({uid: 10})).to.equal(key({uid: 10}));
    expect(key({uid: 10})).not.to.equal(key({uid: 11}));
    expect(() => key({id: 10})).to.throw(ReferenceError);
  });

  it(`for options ({stem: 'custom-key'})`, function() {
    const key = keyFunc({stem: 'custom-key'});
    expect(key(console)).to.equal(key(console));
    expect(key(console)).not.to.equal(key(babel));
    expect(key(babel)).to.equal(key(babel));
    expect(key(console)).to.equal('custom-key1');
    expect(key(babel)).to.equal('custom-key2');
  });

  it(`for options ({stem: 'one'}, {stem: 'two'}, {stem: 'three'})`, function() {
    const stems = ['one', 'two', 'three'];
    const key = keyFunc(...stems.map(stem => {
      return {stem};
    }));
    expect(key(1, 2, 3)).to.equal(key(1, 2, 3));
    expect(key(3, 2, 1)).not.to.equal(key(1, 2, 3));
    expect(key(2, 2, 2)).not.to.equal(key(1, 1, 1));
    expect(key(3, 3, 3)).to.equal(key(3, 3, 3));
    expect(key(1, 2, 3)).to.equal([1, 2, 3].map((n, i) => {
      return stems[i] + signature(n);
    }).join('_'));
    expect(key(3, 2, 1)).to.equal([3, 2, 1].map((n, i) => {
      return stems[i] + signature(n);
    }).join('_'));
    expect(key(1, 1, 1)).to.equal([1, 1, 1].map((n, i) => {
      return stems[i] + signature(n);
    }).join('_'));
    expect(key(2, 2, 2)).to.equal([2, 2, 2].map((n, i) => {
      return stems[i] + signature(n);
    }).join('_'));
    expect(key(3, 3, 3)).to.equal([3, 3, 3].map((n, i) => {
      return stems[i] + signature(n);
    }).join('_'));
  });

});
