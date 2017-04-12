import {equiv} from '../../src/keyfunc';
import {expect} from 'chai';

describe('Background example', function () {
  it(`"equiv" can generate custom comparison functions`, function () {
    const eq1 = equiv({preprocess: eval});
    const eq2 = equiv({property: 'name'});

    expect(eq1(2, '1 + 1')).to.be.true;
    expect(eq1('2 * 3 * 4', '48 / 2', '6 * 6 * 2/3')).to.be.true;
    expect(eq1('2 * 3 * 4', '25', '6 * 6 * 2/3')).to.be.false;

    expect(eq2({name: 'Patrick'}, {name: 'Patrick'})).to.be.true;
    expect(eq2({name: 'Patrick'}, {name: 'Patrick'}, {name: 'Patrick'}))
      .to.be.true;
    expect(eq2({name: 'Patrick'}, {name: 'Patrick'}, {name: 'Patricia'}))
      .to.be.false;
  });
});
