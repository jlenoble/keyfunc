import {expect} from 'chai';
import keyFunc from '../src/keyfunc';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

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

});
