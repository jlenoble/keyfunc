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
      'ignore', // Sixth argument is ignored
    );

    const obj = {id: 1};
    const s1 = key(console, 'log', {color: 'red'}, [console, obj],
      [console, obj], console);
    const s2 = key(console, 'log', {color: 'red'}, [console, obj],
      [obj, console], 'dummy');

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

  it(`Mixed arrays`, function() {
    const poorKey = keyFunc({type: 'literal', rest: true});

    const sharpKey = keyFunc({
      type: 'array', // Mandatory
      sub: ['object', 'literal'],
      rest: true // Expects a list of mixed arrays, not only a single one
    });

    const o1 = {name: 1};
    const o2 = {name: 2};
    const o3 = {name: 3};

    const poor = poorKey([o1, 'name'], [o2, 'name'], [o3, 'name']);
    const sharp = sharpKey([o1, 'name'], [o2, 'name'], [o3, 'name']);

    o1.name = 4;

    expect(poor).not.to.equal(poorKey(
      [o1, 'name'], [o2, 'name'], [o3, 'name']));
    expect(poor).to.equal(poorKey(
      [{name: 1}, 'name'], [o2, 'name'], [o3, 'name']));

    expect(sharp).to.equal(sharpKey(
      [o1, 'name'], [o2, 'name'], [o3, 'name']));
    expect(sharp).not.to.equal(sharpKey(
      [{name: 1}, 'name'], [o2, 'name'], [o3, 'name']));
  });

  it(`Mixed properties`, function() {
    const poorKey = keyFunc({property: 'data', rest: true});

    const sharpKey = keyFunc({
      property: 'data', // Mandatory
      sub: {type: 'array', sub: ['object', 'literal']},
      rest: true // Expects a list of mixed arrays, not only a single one
    });

    const o1 = {name: 1};
    const o2 = {name: 2};
    const o3 = {name: 3};

    const poor = poorKey({data: [o1, 'name']}, {data: [o2, 'name']},
      {data: [o3, 'name']});
    const sharp = sharpKey({data: [o1, 'name']}, {data: [o2, 'name']},
      {data: [o3, 'name']});

    o1.name = 4;

    expect(poor).not.to.equal(poorKey({data: [o1, 'name']},
      {data: [o2, 'name']}, {data: [o3, 'name']}));
    expect(poor).to.equal(poorKey({data: [{name: 1}, 'name']},
      {data: [o2, 'name']}, {data: [o3, 'name']}));

    expect(sharp).to.equal(sharpKey({data: [o1, 'name']}, {data: [o2, 'name']},
      {data: [o3, 'name']}));
    expect(sharp).not.to.equal(sharpKey({data: [{name: 1}, 'name']},
      {data: [o2, 'name']}, {data: [o3, 'name']}));
  });

  it(`Deep properties`, function() {
    const cumbersomeKey = keyFunc({
      property: 'humanity',
      sub: {
        property: 'man',
        sub: {
          property: 'brain',
          sub: {
            property: 'thought'
          }
        }
      }
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

  it(`Type 'option'`, function() {
    const key = keyFunc({
      type: 'option',
      sub: {
        id: 'literal',
        name: 'literal'
      }
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

  it(`Unordered lists`, function() {
    const okey = keyFunc({type: 'object', rest: true});
    const ukey = keyFunc({type: 'object', unordered: true});

    const o1 = {id: 1};
    const o2 = {id: 2};

    expect(okey(o1, o2)).not.to.equal(okey(o2, o1));
    expect(ukey(o1, o2)).to.equal(ukey(o2, o1));
  });


});
