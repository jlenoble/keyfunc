import {expect} from 'chai';
import keyFunc from '../../src/keyfunc';

describe('Testing README.md examples', function () {
  it(`Usage example`, function () {
    const key = keyFunc(
      'object', // First argument must be an object matched strictly
      'literal', // Second argument can be anything matched literally
      {property: 'color'}, // Third argument and all subsequent ones can be
      // anything matched literally from their property 'id' downwards
      'array', // Fourth argument is an array of 'object'
      'set', // Fifth argument is a set of 'object'
      'ignore' // Sixth argument is ignored
    );

    const obj = {id: 1};
    const s1 = key(console, 'log', {color: 'red'}, [console, obj],
      [console, obj], console);
    const s2 = key(console, 'log', {color: 'red'}, [console, obj],
      [obj, console], 'dummy');

    expect(s1).to.equal(s2);
  });
});
