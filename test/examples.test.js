import {expect} from 'chai';
import keyFunc from '../src/keyfunc';

describe('Testing README.md examples', function() {

  it(`Usage example`, function() {
    const key = keyFunc(
      'object', // First argument must be an object matched strictly
      'literal', // Second argument can be anything matched literally
      {property: 'color'} // Third argument and all subsequent ones can be
      // anything matched literally from their property 'id' downwards
    );

    const s1 = key(console, 'log', {color: 'red'});
    const s2 = key(console, 'log', {color: 'red'});

    expect(s1).to.equal(s2);
  });

  it(`Options example`, function() {
    const key = keyFunc(
      {
        stem: 'first'
      },
      {
        stem: 'second',
        type: 'literal',
        rest: true
      },
      {
        stem: 'third',
        property: 'color'
      }
    );

    expect(/first1_second[0-9a-f]{40}_third[0-9a-f]{40}_second[0-9a-f]{40}/.test(
      key(console, 'log', {color: 'red'}, 'dummy'))).to.be.true;
  });

  it(`'object' option example`, function() {
    const key = keyFunc('object');

    const option1 = {color: 'red'};

    const s1 = key(option1);
    const s2 = key({color: 'green'});
    const s3 = key({color: 'blue'});

    expect(s1).not.to.equal(s2);
    expect(s2).not.to.equal(s3);
    expect(s3).not.to.equal(s1);

    expect(s1).to.equal(key(option1));
    expect(s1).not.to.equal(key({color: 'red'}));
    expect(s1).not.to.equal(key({color: 'red', size: 'Huge'}));
  });

  it(`'literal' option example`, function() {
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

  it(`'property' option example`, function() {
    const key = keyFunc({property: 'color'});

    const option1 = {color: 'red'};

    const s1 = key(option1);
    const s2 = key({color: 'green'});
    const s3 = key({color: 'blue'});

    expect(s1).not.to.equal(s2);
    expect(s2).not.to.equal(s3);
    expect(s3).not.to.equal(s1);

    expect(s1).to.equal(key(option1));
    expect(s1).to.equal(key({color: 'red'}));
    expect(s1).to.equal(key({color: 'red', size: 'Huge'}));
  });

});
