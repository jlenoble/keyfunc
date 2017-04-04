import sig from 'sig';

export default function optionFunc (sub, keyfunc) {
  if (typeof sub !== 'object') {
    throw new TypeError(`optionFunc requires an object as first argument,
but it was: ${JSON.stringify(sub)}`);
  }

  const keyObject = {};

  Object.keys(sub).forEach(key => {
    keyObject[key] = keyfunc(sub[key]);
  });

  return opt => {
    const keys = {};
    Object.keys(keyObject).forEach(key => {
      keys[key] = keyObject[key](opt[key]);
    });
    return sig(keys);
  };
};
