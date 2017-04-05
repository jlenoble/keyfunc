import sig from 'sig';

export const optionalKey = sig('ðéf4ult K€y för 0pt1øN4L aRgs');

export default function optionalFunc (baseKeyfunc) {
  if (typeof baseKeyfunc !== 'function') {
    throw new TypeError(`optionalFunc requires a function as argument,
but it was: ${JSON.stringify(baseKeyfunc)}`);
  }

  return (...args) => {
    if (args.length === 0 || (args.length === 1 &&
      args[0] === undefined)) {
      return optionalKey;
    } else {
      return baseKeyfunc(...args);
    }
  };
};
