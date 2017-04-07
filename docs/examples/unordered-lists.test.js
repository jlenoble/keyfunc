import {expect} from 'chai';
import keyFunc from '../../src/keyfunc';

describe('Testing README.md examples', function () {
  it(`Unordered lists example`, function () {
    const okey = keyFunc({type: 'object', rest: true});
    const ukey = keyFunc({type: 'object', unordered: true});

    const o1 = {id: 1};
    const o2 = {id: 2};

    expect(okey(o1, o2)).not.to.be.equal(okey(o2, o1));
    expect(okey(o1, o2)).to.be.equal(ukey(o2, o1));
  });
});
