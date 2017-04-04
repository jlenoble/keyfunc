import {expect} from 'chai';
import keyfunc from '../src/keyfunc';

describe(`Testing 'object' hint`, function () {
  it(`Hint as string`, function () {
    const key = keyfunc('object');

    expect(key(console)).to.equal('o1');
    expect(key({id: 1})).to.equal('o2');

    expect(key(console)).to.equal('o1');
    expect(key({id: 1})).to.equal('o3');

    expect(() => key(1)).to.throw(
      `Function can only generate keys for objects,
but argument was: 1`);
    expect(() => key('title')).to.throw(
      `Function can only generate keys for objects,
but argument was: "title"`);

    expect(key([1])).to.equal('o4');
    expect(key([1])).to.equal('o5');
  });

  it(`Hint as option`, function () {
    const key = keyfunc({type: 'object'});

    expect(key(console)).to.equal('o1');
    expect(key({id: 1})).to.equal('o2');

    expect(key(console)).to.equal('o1');
    expect(key({id: 1})).to.equal('o3');

    expect(() => key(1)).to.throw(
      `Function can only generate keys for objects,
but argument was: 1`);
    expect(() => key('title')).to.throw(
      `Function can only generate keys for objects,
but argument was: "title"`);

    expect(key([1])).to.equal('o4');
    expect(key([1])).to.equal('o5');
  });

  it(`No hint`, function () {
    const key = keyfunc();

    expect(key(console)).to.equal('o1');
    expect(key({id: 1})).to.equal('o2');

    expect(key(console)).to.equal('o1');
    expect(key({id: 1})).to.equal('o3');

    expect(() => key(1)).to.throw(
      `Function can only generate keys for objects,
but argument was: 1`);
    expect(() => key('title')).to.throw(
      `Function can only generate keys for objects,
but argument was: "title"`);

    expect(key([1])).to.equal('o4');
    expect(key([1])).to.equal('o5');
  });

  it(`Multi args is invalid`, function () {
    const key = keyfunc('object');

    expect(() => key(console, console)).to.throw(
      `Inconsistent number of arguments, can't generate key`);
  });
});
