import isString from 'is-string';
import strictFunc from './strictfunc';
import looseFunc from './loosefunc';
import propertyFunc from './propertyfunc';
import arrayFunc from './arrayfunc';
import setFunc from './setfunc';

function whichFunc (type, prop) {
  switch (type) {
  case 'object': return strictFunc();
  case 'literal': return looseFunc();
  case 'property': return propertyFunc(prop);
  case 'array': return arrayFunc();
  case 'set': return setFunc();
  case 'ignore': return () => '';
  }
}

export default function objectFunc (_type, _stem) {
  let type = isString(_type) ? _type : 'object';
  const stem = _stem ? _stem : {};

  let match = type.match(/(\w+):(\w+)((:)(.+))*/);
  let prop;

  if (match) {
    type = match[1];
    if (match[4] === ':') {
      prop = match[5];
    }
    match = match[2];
  } else {
    match = undefined;
  }

  switch (type) {

  case 'object':
    return strictFunc(stem.stem || stem);

  case 'literal':
    return looseFunc(stem.stem || stem);

  case 'property':
    let property = stem.property || stem;
    if (!isString(property)) {
      throw new TypeError(`propertyFunc requires a string as first argument,
but it was: ${property}`);
    }
    let array = property.split(':').reverse();
    return [whichFunc(match, prop), ...array].reduce((fn, ppty) => {
      return propertyFunc(ppty, stem.stem, fn);
    });

  case 'array':
    return arrayFunc(stem.stem || stem, whichFunc(match, prop));

  case 'set':
    return setFunc(stem.stem || stem, whichFunc(match, prop));

  case 'ignore':
    return;

  default:
    throw new TypeError(`Keys can't be created for type ${type}`);
  }
};
