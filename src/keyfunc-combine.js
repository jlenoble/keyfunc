import sig from 'sig';

const checkArgsLength = (args, {length, trailingIgnores, unbound}) => {
  if (!unbound) {
    if (length === args.length) {
      return;
    }

    if (length - trailingIgnores <= args.length && args.length < length) {
      return;
    }
  } else {
    if (args.length >= length) {
      return;
    }
  }

  throw new Error(`Inconsistent number of arguments, can't generate key`);
};

export default function combineFunc ({
  keyFuncs, length, trailingIgnores, unbound,
}) {
  return (...args) => {
    checkArgsLength(args, {length, trailingIgnores, unbound});

    let n = 0;
    return sig(keyFuncs.map((keyFunc, i) => {
      let slice;
      if (unbound && i === keyFuncs.length -1) {
        slice = args.slice(n);
      } else {
        slice = args.slice(n, n + keyFunc.length);
      }
      n += keyFunc.length;
      return keyFunc.keyfunc(...slice);
    }).join(''));
  };
}
