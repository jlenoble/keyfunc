import sig from 'sig';

export default function combineFunc ({keyFuncs, length, trailingIgnores}) {
  return (...args) => {
    if (length !== args.length &&
      (length - trailingIgnores > args.length ||
      length < args.length)) {
      throw new Error(`Inconsistent number of arguments, can't generate key`);
    }

    let n = 0;
    return sig(keyFuncs.map(keyFunc => {
      const slice = args.slice(n, n + keyFunc.length);
      n += keyFunc.length;
      return keyFunc.keyfunc(...slice);
    }).join(''));
  };
}
