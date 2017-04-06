import {expect} from 'chai';
import keyFunc from '../../src/keyfunc';

describe('Testing README.md examples', function () {
  it(`Mixed arrays`, function () {
    const poorKey = keyFunc({type: 'literal', rest: true});

    const sharpKey = keyFunc({
      type: 'array', // Mandatory
      sub: ['object', 'literal'],
      rest: true, // Expects a list of mixed arrays, not only a single one
    });

    const o1 = {name: 1};
    const o2 = {name: 2};
    const o3 = {name: 3};

    const poor = poorKey([o1, 'name'], [o2, 'name'], [o3, 'name']);
    const sharp = sharpKey([o1, 'name'], [o2, 'name'], [o3, 'name']);

    o1.name = 4;

    expect(poor).not.to.equal(poorKey(
      [o1, 'name'], [o2, 'name'], [o3, 'name']));
    expect(poor).to.equal(poorKey(
      [{name: 1}, 'name'], [o2, 'name'], [o3, 'name']));

    expect(sharp).to.equal(sharpKey(
      [o1, 'name'], [o2, 'name'], [o3, 'name']));
    expect(sharp).not.to.equal(sharpKey(
      [{name: 1}, 'name'], [o2, 'name'], [o3, 'name']));
  });
});
