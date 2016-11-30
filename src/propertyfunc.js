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
    return args => {
      args = [args, ...property.split(':')].reduce((obj, ppty) => {
        if (obj[ppty] === undefined) {
          throw new ReferenceError(
            `Can't generate key for object with no property '${ppty}'`);
        }
        return obj[ppty];
      });

      return stem + keyFunc(args);
    };
  })(property, stem, propertyKeyFunc);

};
