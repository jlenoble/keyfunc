import {expect} from 'chai';
import keyFunc from '../../src/keyfunc';

describe('Testing README.md examples', function () {
  it(`Options example`, function () {
    const key = keyFunc(
      {
        type: 'object',
      },
      {
        type: 'literal',
      },
      {
        property: 'color',
      },
      {
        type: 'array',
      },
      {
        type: 'set',
      }
    );

    const obj = {id: 1};
    expect(
      /[0-9a-f]{40}/.test(key(console, 'log', {color: 'red'}, [console, obj],
          [obj, console]))).to.be.true;
  });
});
