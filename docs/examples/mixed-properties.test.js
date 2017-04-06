import {expect} from 'chai';
import keyFunc from '../../src/keyfunc';

describe('Testing README.md examples', function () {
  it(`Mixed properties`, function () {
    const poorKey = keyFunc({property: 'data', rest: true});

    const sharpKey = keyFunc({
      property: 'data', // Mandatory
      sub: {type: 'array', sub: ['object', 'literal']},
      rest: true, // Expects a list of mixed arrays, not only a single one
    });

    const o1 = {name: 1};
    const o2 = {name: 2};
    const o3 = {name: 3};

    const poor = poorKey({data: [o1, 'name']}, {data: [o2, 'name']},
      {data: [o3, 'name']});
    const sharp = sharpKey({data: [o1, 'name']}, {data: [o2, 'name']},
      {data: [o3, 'name']});

    o1.name = 4;

    expect(poor).not.to.equal(poorKey({data: [o1, 'name']},
      {data: [o2, 'name']}, {data: [o3, 'name']}));
    expect(poor).to.equal(poorKey({data: [{name: 1}, 'name']},
      {data: [o2, 'name']}, {data: [o3, 'name']}));

    expect(sharp).to.equal(sharpKey({data: [o1, 'name']}, {data: [o2, 'name']},
      {data: [o3, 'name']}));
    expect(sharp).not.to.equal(sharpKey({data: [{name: 1}, 'name']},
      {data: [o2, 'name']}, {data: [o3, 'name']}));
  });
});
