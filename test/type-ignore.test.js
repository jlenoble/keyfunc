import {expect} from 'chai';
import keyFunc from '../src/keyfunc';

describe(`Testing 'ignore' hint`, function () {
  it(`Hint as last hint`, function () {
    const key = keyFunc('literal', 'ignore');

    expect(() => key('first')).not.to.throw();
    expect(() => key('first', 'second')).not.to.throw();
    expect(key('first', 'second')).to.equal(key('first'));
    expect(() => key()).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
    expect(() => key('first', 'second', 'third')).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
  });

  it(`Hint as last hints`, function () {
    const key = keyFunc('literal', 'ignore', 'ignore', 'ignore');

    expect(() => key(1)).not.to.throw();
    expect(() => key(1, 2)).not.to.throw();
    expect(() => key(1, 2, 3)).not.to.throw();
    expect(() => key(1, 2, 3, 4)).not.to.throw();
    expect(key(1)).to.equal(key(1, 2));
    expect(key(1)).to.equal(key(1, 2, 3));
    expect(key(1)).to.equal(key(1, 2, 3, 4));

    expect(() => key()).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
    expect(() => key(1, 2, 3, 4, 5)).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
  });

  it(`Hint as hints within hints`, function () {
    const key = keyFunc('literal', 'ignore', 'ignore', 'literal');

    expect(() => key(1, 2, 3, 4)).not.to.throw();
    expect(key(1, 0, 0, 4)).to.equal(key(1, 2, 3, 4));
    expect(key(1, '', null, 4)).to.equal(key(1, 2, 3, 4));
    expect(key(1, /.*/, {id: 42}, 4)).to.equal(key(1, 2, 3, 4));

    expect(() => key()).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
    expect(() => key(1)).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
    expect(() => key(1, 2)).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
    expect(() => key(1, 2, 3)).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
    expect(() => key(1, 2, 3, 4, 5)).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
  });

  it(`Hint with option optional`, function () {
    const key = keyFunc('literal', {type: 'ignore', optional: true});

    expect(() => key(1, 2)).not.to.throw();
    expect(() => key(1)).not.to.throw();
    expect(key(1, 0)).to.equal(key(1, 2));
    expect(key(1)).to.equal(key(1, 2));

    expect(() => key()).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
    expect(() => key(1, 2, 3)).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
  });

  it(`Hint with option ntimes`, function () {
    const key = keyFunc('literal', {type: 'ignore', ntimes: 3});

    expect(() => key(1, 2, 3, 4)).not.to.throw();
    expect(() => key(1, 2, 3)).not.to.throw();
    expect(() => key(1, 2)).not.to.throw();
    expect(() => key(1)).not.to.throw();
    expect(key(1, 0, 0, 4)).to.equal(key(1, 2, 3, 4));
    expect(key(1, '', null, 4)).to.equal(key(1, 2, 3, 4));
    expect(key(1, /.*/, {id: 42}, 4)).to.equal(key(1, 2, 3, 4));

    expect(() => key()).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);
    expect(() => key(1, 2, 3, 4, 5)).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);

    expect(key(1, 0, 0)).to.equal(key(1, 2, 3, 4));
    expect(key(1, 0)).to.equal(key(1, 2, 3, 4));
    expect(key(1)).to.equal(key(1, 2, 3, 4));
  });

  it(`Hint with option repeat`, function () {
    const key = keyFunc('literal', {type: 'ignore', repeat: true});

    expect(() => key(1, 2, 3, 4)).not.to.throw();
    expect(() => key(1, 2, 3)).not.to.throw();
    expect(() => key(1, 2)).not.to.throw();
    expect(() => key(1)).not.to.throw();
    expect(key(1, 0, 0, 4)).to.equal(key(1, 2, 3, 4));
    expect(key(1, '', null, 4)).to.equal(key(1, 2, 3, 4));
    expect(key(1, /.*/, {id: 42}, 4)).to.equal(key(1, 2, 3, 4));

    expect(() => key()).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);

    expect(key(1, 0, 0)).to.equal(key(1, 2, 3, 4));
    expect(key(1, 0)).to.equal(key(1, 2, 3, 4));
    expect(key(1)).to.equal(key(1, 2, 3, 4));
  });

  it(`Hint with option rest`, function () {
    const key = keyFunc('literal', {type: 'ignore', rest: true});

    expect(() => key(1, 2, 3, 4)).not.to.throw();
    expect(() => key(1, 2, 3)).not.to.throw();
    expect(() => key(1, 2)).not.to.throw();
    expect(() => key(1)).not.to.throw();
    expect(key(1, 0, 0, 4)).to.equal(key(1, 2, 3, 4));
    expect(key(1, '', null, 4)).to.equal(key(1, 2, 3, 4));
    expect(key(1, /.*/, {id: 42}, 4)).to.equal(key(1, 2, 3, 4));

    expect(() => key()).to.throw(
      Error, `Inconsistent number of arguments, can't generate key`);

    expect(key(1, 0, 0)).to.equal(key(1, 2, 3, 4));
    expect(key(1, 0)).to.equal(key(1, 2, 3, 4));
    expect(key(1)).to.equal(key(1, 2, 3, 4));
  });
});
