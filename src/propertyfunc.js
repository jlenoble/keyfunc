import isString from 'is-string';
import looseFunc from './loosefunc';

export default function propertyFunc (property, stem = '',
  propertyKeyFunc= looseFunc()) {
  if (!isString(property)) {
    throw new TypeError(`propertyFunc requires a string as first argument,
but it was: ${JSON.stringify(property)}`);
  }

  return ((property, stem, keyFunc) => {
    return args => {
      let _args = [args, ...property.split(':')].reduce((obj, ppty) => {
        if (obj[ppty] === undefined) {
          throw new ReferenceError(
            `Can't generate key for object with no property '${ppty}'`);
        }
        return obj[ppty];
      });

      return stem + keyFunc(_args);
    };
  })(property, isString(stem) ? stem : '', propertyKeyFunc);
};
