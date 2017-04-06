import {expect} from 'chai';
import keyFunc from '../../src/keyfunc';

describe('Testing README.md examples', function () {
  it(`Type 'option'`, function () {
    const key = keyFunc({
      type: 'option',
      sub: {
        id: 'literal',
        name: 'literal',
      },
    });

    const option1 = {id: 1, name: 'a', color: 'red'};
    const option2 = {id: 2, name: 'b', color: 'green'};
    const option3 = {id: 1, name: 'a', color: 'blue'};

    const s1 = key(option1);
    const s2 = key(option2);
    const s3 = key(option3);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);
  });
});
