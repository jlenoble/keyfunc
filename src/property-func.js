import isString from 'is-string';
import sig from 'sig';

export default function propertyFunc (property,
  propertyKeyfunc = sig) {
  if (!isString(property)) {
    throw new TypeError(`propertyFunc requires a string as first argument,
but it was: ${JSON.stringify(property)}`);
  }

  return arg => {
    const _arg = property.split(':').reduce((obj, ppty) => {
      if (obj[ppty] === undefined) {
        throw new ReferenceError(
          `Can't generate key for object with no property '${ppty}'`);
      }
      return obj[ppty];
    }, arg);

    return propertyKeyfunc(_arg);
  };
};
