export const formatOptionNTimes = ({ntimes}) => {
  if (ntimes === undefined) {
    return;
  }

  if (typeof ntimes !== 'number') {
    throw new TypeError(`Not a number: ${JSON.stringify(ntimes)}`);
  }

  let _ntimes = parseInt(ntimes, 10);

  if (ntimes === 1) {
    return; // Useless option
  }

  if (ntimes === 0) {
    throw new Error('Option ntimes set, but is 0, not handled yet');
  }

  return _ntimes;
};

export const formatHint = hint => {
  let _hint;

  switch (typeof hint) {
  case 'undefined':
    _hint = {type: 'object'};
    break;

  case 'string':
    if (!hint.includes(':')) {
      _hint = {type: hint};
    } else {
      const [type, ...hints] = hint.split(':');
      _hint = {
        type, subhint: hints.join(':'),
      };
    }
    break;

  case 'object':
    if (hint.type) {
      _hint = hint;
      break;
    }
  // FALL THROUGH !

  default:
    throw new TypeError(`Unhandled keyfunc hint: ${JSON.stringify(hint)}`);
  }

  _hint.ntimes = formatOptionNTimes(_hint);

  if (_hint.unordered) {
    // By default, if args are unordered, then their number is unbound
    _hint.repeat = true;
  }

  return _hint;
};
