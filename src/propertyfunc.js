import isString from 'is-string';
import signature from 'sig';

export default function propertyFunc(property, stem) {

  if (!isString(property)) {
    throw new TypeError(`propertyFunc requires a string as first argument,
but it was: ${JSON.stringify(property)}`);
  }

  if (!isString(stem)) {
    stem = '';
  }

  return ((property, stem) => {
    return obj => {
      if (obj[property] === undefined) {
        throw new ReferenceError(
          `Can't generate key for object with no property '${property}'`);
      }
      return stem + signature(obj[property]);
    }
  })(property, stem);

};
