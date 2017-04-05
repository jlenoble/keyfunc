import sig from 'sig';

const checkArgsLength = (args, {length, trailingIgnores, unbound,
  optional}) => {
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

    if (optional && args.length === length - 1) {
      // Relies on pseudo length 1 for last hint (it can't be known in advance)
      // So minimum authorized length for args is the instance length minus
      // that pseudo length
      return;
    }
  }

  throw new Error(`Inconsistent number of arguments, can't generate key`);
};

export default function combineFunc ({
  keyFuncs, length, trailingIgnores, unbound, optional,
}) {
  return (...args) => {
    checkArgsLength(args, {length, trailingIgnores, unbound, optional});

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
