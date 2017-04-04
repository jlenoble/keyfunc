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

export const splitHint = _hint => {
  let [hint, ...hints] = _hint.split(':');
  return {
    hint, hintSuffix: hints.join(':'),
  };
};

export const formatHint = hint => {
  let _hint;

  switch (typeof hint) {
  case 'undefined':
    _hint = {type: 'object'};
    break;

  case 'string':
    _hint = splitHint(hint);
    _hint = _hint.hintSuffix ? {
      type: _hint.hint,
      typesuffix: _hint.hintSuffix,
    } : {type: _hint.hint};
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

  if ((_hint.unordered || _hint.unique) && _hint.ntimes === undefined) {
    // By default, if args are unordered, then their number is unbound,
    // unless of course it is specified!
    _hint.repeat = true;
  }

  return _hint;
};
