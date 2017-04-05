export default function optionalFunc (baseKeyfunc) {
  if (typeof baseKeyfunc !== 'function') {
    throw new TypeError(`optionalFunc requires a function as argument,
but it was: ${JSON.stringify(baseKeyfunc)}`);
  }

  return (...args) => {
    if (args.length === 0 || (args.length === 1 &&
      args[0] === undefined)) {
      return '0';
    } else {
      return baseKeyfunc(...args);
    }
  };
};
