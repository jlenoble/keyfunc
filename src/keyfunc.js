import sig from 'sig';

export class KeyFunc {
  constructor (...hints) {
    // Define helper property
    Object.defineProperty(this, 'length', {value: hints.length});

    if (this.length !== 1) {
      // Delegate to sub instances if more than one hint
      Object.defineProperty(this, 'keyFuncs', {
        value: hints.map(hint => new KeyFunc(hint)),
      });

      // Original hints are formatted through sub instances
      Object.defineProperty(this, 'hints', {
        value: this.keyFuncs.map(keyFunc => keyFunc.hint),
      });
    } else {
      // Format hint
      const [hint] = hints;
      Object.defineProperty(this, 'hint', {
        value: this.formatHint(hint),
      });

      // Make key function
      Object.defineProperty(this, 'keyFunc', {
        value: this.makeSingleKeyFunc(),
      });
    }
  }

  formatHint (hint) {
    switch (typeof hint) {
    case 'string':
      return {type: hint};

    case 'object':
      if (hint.type) {
        return hint;
      }

    default:
      throw new TypeError(`Unhandled keyfunc hint: ${JSON.stringify(hint)}`);
    }
  }

  makeSingleKeyFunc () {
    switch (this.hint.type) {
    case 'literal':
      return arg => sig(arg);

    default:
      throw new TypeError(`Unhandled keyfunc type: ${this.hint.type}`);
    }
  }
}

export default function keyfunc (...hints) {
  return new KeyFunc(...hints).keyFunc;
}
