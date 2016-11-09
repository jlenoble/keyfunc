import isString from 'is-string';

export default function strictFunc(stem) {

  if (!isString(stem)) {
    stem = '';
  }

  return (stem => {
    var counter = 0;
    const map = new WeakMap();

    return obj => {
      var key = map.get(obj);

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
