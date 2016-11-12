import isString from 'is-string';
import strictFunc from './strictfunc';
import looseFunc from './loosefunc';
import propertyFunc from './propertyfunc';
import arrayFunc from './arrayfunc';

export default function objectFunc(type, stem) {

  if (!isString(type)) {
    type = 'object';
  }

  if (!stem) {
    stem = {};
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
      return arrayFunc(stem.stem || stem);
      break;

    default:
      throw new TypeError(`Keys can't be created for type ${type}`);

  }

};
