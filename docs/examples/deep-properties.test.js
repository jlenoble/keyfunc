import {expect} from 'chai';
import keyFunc from '../../src/keyfunc';

describe('Testing README.md examples', function () {
  it(`Deep properties`, function () {
    const cumbersomeKey = keyFunc({
      property: 'humanity',
      sub: {
        property: 'man',
        sub: {
          property: 'brain',
          sub: {
            property: 'thought',
          },
        },
      },
    });
    const straightKey = keyFunc({property: 'humanity:man:brain:thought'});

    const o = {humanity: {man: {brain: {thought: 'Duh?'}}}};

    expect(cumbersomeKey(o)).to.equal(straightKey(o));
    expect(cumbersomeKey(o)).to.equal(
      cumbersomeKey({humanity: {man: {brain: {thought: 'Duh?'}}}}));
    expect(cumbersomeKey(o)).not.to.equal(
      cumbersomeKey({humanity: {man: {brain: {thought: 'Da!'}}}}));
    expect(straightKey(o)).to.equal(
      straightKey({humanity: {man: {brain: {thought: 'Duh?'}}}}));
    expect(straightKey(o)).not.to.equal(
      straightKey({humanity: {man: {brain: {thought: 'Da!'}}}}));
  });
});
