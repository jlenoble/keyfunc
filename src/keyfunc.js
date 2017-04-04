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

    if (!this.hint.ntimes || this.hint.unordered) {
      // Set default length and trailingIgnores
      Object.defineProperties(this, {
        length: {
          value: 1,
        },
        trailingIgnores: {
          value: this.hint.type === 'ignore' ? 1 : 0,
        },
      });

      // Make key function
      Object.defineProperty(this, 'keyfunc', {
        value: singleFunc(this.hint, keyfunc),
      });
    } else {
      // Expand ntimes and delegate to children
      const hint = Object.assign({}, this.hint);
      delete hint.ntimes; // Protect against Max call stack size error

      const _hints = new Array(this.hint.ntimes);
      _hints.fill(hint);

      this._delegateToChildren(_hints);
    }
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
}

export default function keyfunc (...hints) {
  return new KeyFunc(...hints).keyfunc;
}
