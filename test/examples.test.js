import {expect} from 'chai';
import keyFunc from '../src/keyfunc';

describe('Testing README.md examples', function() {

  it(`Usage example`, function() {
    const key = keyFunc(
      'object', // First argument must be an object matched strictly
      'literal', // Second argument can be anything matched literally
      {property: 'color'}, // Third argument and all subsequent ones can be
      // anything matched literally from their property 'id' downwards
      'array', // Fourth argument is an array of 'object'
      'set', // Fifth argument is a set of 'object'
    );

    const obj = {id: 1};
    const s1 = key(console, 'log', {color: 'red'}, [console, obj],
      [console, obj]);
    const s2 = key(console, 'log', {color: 'red'}, [console, obj],
      [obj, console]);

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
      },
      {
        stem: 'fourth',
        type: 'array'
      },
      {
        stem: 'fifth',
        type: 'set'
      }
    );

    const obj = {id: 1};
    expect(
      /first1_second[0-9a-f]{40}_third[0-9a-f]{40}_fourth[0-9a-f]{40}_fifth[0-9a-f]{40}_second[0-9a-f]{40}/
        .test(key(console, 'log', {color: 'red'}, [console, obj],
          [obj, console], 'dummy'))).to.be.true;
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

  it(`'array' option`, function() {
    const key = keyFunc('array');

    const option1 = {color: 'red'};
    const option2 = {color: 'green'};
    const option3 = {color: 'blue'};

    const s1 = key([option1, option2, option3]);
    const s2 = key([option3, option2, option1]);
    const s3 = key([option1, option2, option3]);

    expect(s1).not.to.equal(s2);
    expect(s1).to.equal(s3);
  });

  it(`'set' option`, function() {
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
