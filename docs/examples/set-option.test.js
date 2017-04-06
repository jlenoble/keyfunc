import {expect} from 'chai';
import keyFunc from '../../src/keyfunc';

describe('Testing README.md examples', function () {
  it(`'set' option`, function () {
    const key = keyFunc('set');

    const option1 = {color: 'red'};
    const option2 = {color: 'green'};
    const option3 = {color: 'blue'};

    const s1 = key([option1, option2, option3]);
    const s2 = key([option3, option2, option1]);
    const s3 = key([option1, option2, option3]);

    expect(s1).to.equal(s2);
    expect(s1).to.equal(s3);
  });
});
