import singleFunc from './keyfunc-single';
import combineFunc from './keyfunc-combine';
import {formatHint} from './format-hint';

export class KeyFunc {
  constructor (...hints) {
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

  _handleRepeat () {
    const last = this.hints.length - 1;
    let nth;
    if(this.hints.some((hint, i) => {
      nth = i;
      return hint.repeat && hint.ntimes === undefined;
    }) && nth !== last) {
      throw new Error('Only last hint may have option repeat w/o ntimes set');
    }

    // Deal with possible infinite args
    Object.defineProperty(this, 'unbound', {
      value: this.hints[last].repeat && nth === last &&
        this.hints[last].ntimes === undefined,
    });
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
