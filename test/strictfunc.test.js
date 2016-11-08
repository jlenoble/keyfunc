import {expect} from 'chai';
import strictFunc from '../src/strictfunc';

describe('Testing strictFunc', function() {

  it(`Calling strictFunc()` , function() {
    const key = strictFunc();

    expect(key(console)).to.equal('1');
    expect(key({id: 1})).to.equal('2');

    expect(key(console)).to.equal('1');
    expect(key({id: 1})).to.equal('3');

    expect(() => key(1)).to.throw(
      `Function can only generate keys for objects,
but argument was: 1`);
    expect(() => key('title')).to.throw(
      `Function can only generate keys for objects,
but argument was: "title"`);

    expect(key([1])).to.equal('4');
    expect(key([1])).to.equal('5');
  });

  it(`Calling strictFunc('key-')` , function() {
    const key = strictFunc('key-');

    expect(key(console)).to.equal('key-1');
    expect(key({id: 1})).to.equal('key-2');

    expect(key(console)).to.equal('key-1');
    expect(key({id: 1})).to.equal('key-3');

    expect(() => key(1)).to.throw(
      `Function can only generate keys for objects,
but argument was: 1`);
    expect(() => key('title')).to.throw(
      `Function can only generate keys for objects,
but argument was: "title"`);

    expect(key([1])).to.equal('key-4');
    expect(key([1])).to.equal('key-5');
  });

});
