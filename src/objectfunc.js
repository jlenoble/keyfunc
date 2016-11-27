import isString from 'is-string';
import strictFunc from './strictfunc';
import looseFunc from './loosefunc';
import propertyFunc from './propertyfunc';
import arrayFunc from './arrayfunc';
import setFunc from './setfunc';

function whichFunc(type, prop) {

  switch (type) {

    case 'object':
      return strictFunc;
      break;

    case 'literal':
      return looseFunc;
      break;

    case 'property':
      return propertyFunc.bind(undefined, prop);
      break;

    case 'array':
      return arrayFunc;
      break;

    case 'set':
      return setFunc;
      break;

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
      break;

    case 'literal':
      return looseFunc(stem.stem || stem);
      break;

    case 'property':
      return propertyFunc(stem.property || stem, stem.stem);
      break;

    case 'array':
      return arrayFunc(stem.stem || stem, whichFunc(match, prop));
      break;

    case 'set':
      return setFunc(stem.stem || stem, whichFunc(match, prop));
      break;

    default:
      throw new TypeError(`Keys can't be created for type ${type}`);

  }

};
