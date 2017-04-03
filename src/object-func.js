export default function objectFunc () {
  let counter = 0;
  const map = new WeakMap();
  const stem = 'o';

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
};
