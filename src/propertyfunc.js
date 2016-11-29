import isString from 'is-string';
import signature from 'sig';
import looseFunc from './loosefunc';

export default function propertyFunc(property, stem = '',
  propertyKeyFunc= looseFunc()) {

  if (!isString(property)) {
    throw new TypeError(`propertyFunc requires a string as first argument,
but it was: ${JSON.stringify(property)}`);
  }

  if (!isString(stem)) {
    stem = '';
  }

  return ((property, stem, keyFunc) => {
    return obj => {
      if (obj[property] === undefined) {
        throw new ReferenceError(
          `Can't generate key for object with no property '${property}'`);
      }
      return stem + keyFunc(obj[property]);
    };
  })(property, stem, propertyKeyFunc);

};
