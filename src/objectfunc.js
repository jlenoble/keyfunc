import isString from 'is-string';
import strictFunc from './strictfunc';
import looseFunc from './loosefunc';
import propertyFunc from './propertyfunc';
import arrayFunc from './arrayfunc';
import setFunc from './setfunc';

function whichFunc(type, prop) {

  switch (type) {
    case 'object': return strictFunc();
    case 'literal': return looseFunc();
    case 'property': return propertyFunc(prop);
    case 'array': return arrayFunc();
    case 'set': return setFunc();
  }

}

export default function objectFunc(type, stem) {

  if (!isString(type)) {
    type = 'object';
  }

  if (!stem) {
    stem = {};
  }

  let match = type.match(/(\w+):(\w+)(:)?(\w+)?/);
  let prop;
  if (match) {
    type = match[1];
    if (match[3] === ':') {
      prop = match[4];
    }
    match = match[2];
  } else {
    match = undefined;
  }

  switch (type) {

    case 'object':
      return strictFunc(stem.stem || stem);

    case 'literal':
      return looseFunc(stem.stem || stem);

    case 'property':
      return propertyFunc(stem.property || stem, stem.stem,
        whichFunc(match, prop));

    case 'array':
      return arrayFunc(stem.stem || stem, whichFunc(match, prop));

    case 'set':
      return setFunc(stem.stem || stem, whichFunc(match, prop));

    default:
      throw new TypeError(`Keys can't be created for type ${type}`);

  }

};
