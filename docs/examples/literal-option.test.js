import {expect} from 'chai';
import keyFunc from '../../src/keyfunc';

describe('Testing README.md examples', function () {
  it(`'literal' option example`, function () {
    const key = keyFunc('literal');

    const option1 = {color: 'red'};

    const s1 = key(option1);
    const s2 = key({color: 'green'});
    const s3 = key({color: 'blue'});

    expect(s1).not.to.equal(s2);
    expect(s2).not.to.equal(s3);
    expect(s3).not.to.equal(s1);

    expect(s1).to.equal(key(option1));
    expect(s1).to.equal(key({color: 'red'}));
    expect(s1).not.to.equal(key({color: 'red', size: 'Huge'}));
  });
});
