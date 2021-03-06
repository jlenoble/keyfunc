import singleFunc from './keyfunc-single';
import combineFunc from './keyfunc-combine';
import {formatHint} from './format-hint';

export class KeyFunc {
  constructor (..._hints) {
    const hints = this._handleRest(_hints); // Must be called first

    if (hints.length > 1) {
      this._delegateToChildren(hints);
      return;
    }

    // Format hint
    const [hint] = hints;
    Object.defineProperty(this, 'hint', {
      value: formatHint(hint),
    });

    let ntimes = this.hint.ntimes;
    if (!ntimes) {
      ntimes = 1;
    }

    // Set default length and trailingIgnores
    Object.defineProperties(this, {
      length: {
        value: ntimes,
      },
      trailingIgnores: {
        value: this.hint.type === 'ignore' || this.hint.optional ? ntimes : 0,
      },
    });

    // Make key function
    Object.defineProperty(this, 'keyfunc', {
      value: singleFunc(this.hint, keyfunc),
    });
  }

  _delegateToChildren (hints) {
    // Delegate to sub instances if more than one hint
    Object.defineProperty(this, 'keyFuncs', {
      value: hints.map(hint => new KeyFunc(hint)),
    });

    // Original hints are formatted through sub instances
    Object.defineProperty(this, 'hints', {
      value: this.keyFuncs.map(keyFunc => keyFunc.hint),
    });

    this._handleRepeat();
    this._handleOptional();

    // Compute length and trailingIgnores
    Object.defineProperties(this, {
      length: {
        value: this.keyFuncs.reduce((length, keyFunc) => {
          return length + keyFunc.length;
        }, 0),
      },
      trailingIgnores: {
        value: this.keyFuncs.reduce((ignores,
          {length, trailingIgnores}) => {
          if (length === trailingIgnores) {
            return ignores + trailingIgnores;
          }
          return trailingIgnores;
        }, 0),
      },
    });

    // Make key function
    Object.defineProperty(this, 'keyfunc', {
      value: combineFunc(this),
    });
  }

  _handleRest (_hints) {
    const hints = [..._hints];
    const index = hints.findIndex(hint => hint && hint.rest);

    if (index !== -1) {
      const last = hints.length - 1;

      if (index < last) {
        throw new Error('Only last hint may have option rest');
      }

      const hint = Object.assign({}, hints[index],
        {repeat: true, optional: true});
      delete hint.rest;

      hints[last] = hint;
    }

    return hints;
  }

  _handleRepeat () {
    const last = this.hints.length - 1;
    let nth;
    if (this.hints.some((hint, i) => {
      nth = i;
      return hint.repeat && hint.ntimes === undefined;
    }) && nth !== last) {
      throw new Error('Only last hint may have option repeat w/o ntimes set');
    }

    // Deal with possible infinite args
    const lastHint = this.hints[last];
    Object.defineProperty(this, 'unbound', {
      value: lastHint.repeat && nth === last &&
        lastHint.ntimes === undefined,
    });

    if (this.unbound && lastHint.type === 'ignore') {
      lastHint.optional = true; // Hack to prevent a counting error when
      // combining keyFuncs: For 'ignore' type, 'repeat' should be
      // indistinguishable from 'rest' option
    }
  }

  _handleOptional () {
    // If a hint is optional, all following hints must also be.
    let optional = false;

    this.hints.forEach((hint, i) => {
      if (!hint.optional && hint.type !== 'ignore' && optional) {
        throw new Error('Only trailing hints can be optional');
      }
      optional = optional || hint.optional;
    });

    // Deal with possible optional args
    Object.defineProperty(this, 'optional', {
      value: optional,
    });
  }
}

export default function keyfunc (...hints) {
  return new KeyFunc(...hints).keyfunc;
}

export {optionalKey} from './keyfunc-optional';

export const equiv = (...args) => {
  const key = keyfunc(...args);

  return (arg1, arg2, ...args) => {
    const k = key(arg1);
    let eqv = k === key(arg2);

    if (eqv && args.length !== 0) {
      args.some(arg => {
        eqv = eqv && k === key(arg);
        return !eqv;
      });
    }

    return eqv;
  };
};

export const unequiv = (...args) => {
  const key = keyfunc(...args);

  return (...args) => {
    const set = new Set(args.map(arg => key(arg)));
    return set.size === args.length;
  };
};
