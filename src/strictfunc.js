import isString from 'is-string';

export default function strictFunc (_stem) {
  const stem = isString(_stem) ? _stem : '';

  return (stem => {
    let counter = 0;
    const map = new WeakMap();

    return obj => {
      let key = map.get(obj);

      if (!key) {
        counter++;
        key = stem + counter;
        try {
          map.set(obj, key);
        } catch (e) {
          counter--;
          throw new TypeError(
            `Function can only generate keys for objects,
but argument was: ${JSON.stringify(obj)}`);
        }
      }

      return key;
    };
  })(stem);
};
