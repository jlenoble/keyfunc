import {expect} from 'chai';
import sig from 'sig';
import keyfunc from '../src/keyfunc';

describe(`Testing 'literal' hint`, function () {
  it(`Hint as string`, function () {
    const key = keyfunc('literal');

    expect(key(console)).to.equal(sig(console));
    expect(key({id: 1})).to.equal(sig({id: 1}));
    expect(key([1])).to.equal(sig([1]));
    expect(key(1)).to.equal(sig(1));
    expect(key('title')).to.equal(sig('title'));
  });

  it(`Hint as option`, function () {
    const key = keyfunc({type: 'literal'});

    expect(key(console)).to.equal(sig(console));
    expect(key({id: 1})).to.equal(sig({id: 1}));
    expect(key([1])).to.equal(sig([1]));
    expect(key(1)).to.equal(sig(1));
    expect(key('title')).to.equal(sig('title'));
  });

  it(`Multi args is invalid`, function () {
    const key = keyfunc('literal');

    expect(() => key(console, console)).to.throw(
      `Inconsistent number of arguments, can't generate key`);
  });
});
