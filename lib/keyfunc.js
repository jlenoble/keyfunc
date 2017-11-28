'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unequiv = exports.equiv = exports.optionalKey = exports.KeyFunc = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = keyfunc;

var _keyfuncOptional = require('./keyfunc-optional');

Object.defineProperty(exports, 'optionalKey', {
  enumerable: true,
  get: function get() {
    return _keyfuncOptional.optionalKey;
  }
});

var _keyfuncSingle = require('./keyfunc-single');

var _keyfuncSingle2 = _interopRequireDefault(_keyfuncSingle);

var _keyfuncCombine = require('./keyfunc-combine');

var _keyfuncCombine2 = _interopRequireDefault(_keyfuncCombine);

var _formatHint = require('./format-hint');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeyFunc = exports.KeyFunc = function () {
  function KeyFunc() {
    _classCallCheck(this, KeyFunc);

    for (var _len = arguments.length, _hints = Array(_len), _key = 0; _key < _len; _key++) {
      _hints[_key] = arguments[_key];
    }

    var hints = this._handleRest(_hints); // Must be called first

    if (hints.length > 1) {
      this._delegateToChildren(hints);
      return;
    }

    // Format hint

    var _hints2 = _slicedToArray(hints, 1),
        hint = _hints2[0];

    Object.defineProperty(this, 'hint', {
      value: (0, _formatHint.formatHint)(hint)
    });

    var ntimes = this.hint.ntimes;
    if (!ntimes) {
      ntimes = 1;
    }

    // Set default length and trailingIgnores
    Object.defineProperties(this, {
      length: {
        value: ntimes
      },
      trailingIgnores: {
        value: this.hint.type === 'ignore' || this.hint.optional ? ntimes : 0
      }
    });

    // Make key function
    Object.defineProperty(this, 'keyfunc', {
      value: (0, _keyfuncSingle2.default)(this.hint, keyfunc)
    });
  }

  _createClass(KeyFunc, [{
    key: '_delegateToChildren',
    value: function _delegateToChildren(hints) {
      // Delegate to sub instances if more than one hint
      Object.defineProperty(this, 'keyFuncs', {
        value: hints.map(function (hint) {
          return new KeyFunc(hint);
        })
      });

      // Original hints are formatted through sub instances
      Object.defineProperty(this, 'hints', {
        value: this.keyFuncs.map(function (keyFunc) {
          return keyFunc.hint;
        })
      });

      this._handleRepeat();
      this._handleOptional();

      // Compute length and trailingIgnores
      Object.defineProperties(this, {
        length: {
          value: this.keyFuncs.reduce(function (length, keyFunc) {
            return length + keyFunc.length;
          }, 0)
        },
        trailingIgnores: {
          value: this.keyFuncs.reduce(function (ignores, _ref) {
            var length = _ref.length,
                trailingIgnores = _ref.trailingIgnores;

            if (length === trailingIgnores) {
              return ignores + trailingIgnores;
            }
            return trailingIgnores;
          }, 0)
        }
      });

      // Make key function
      Object.defineProperty(this, 'keyfunc', {
        value: (0, _keyfuncCombine2.default)(this)
      });
    }
  }, {
    key: '_handleRest',
    value: function _handleRest(_hints) {
      var hints = [].concat(_toConsumableArray(_hints));
      var index = hints.findIndex(function (hint) {
        return hint && hint.rest;
      });

      if (index !== -1) {
        var last = hints.length - 1;

        if (index < last) {
          throw new Error('Only last hint may have option rest');
        }

        var hint = Object.assign({}, hints[index], { repeat: true, optional: true });
        delete hint.rest;

        hints[last] = hint;
      }

      return hints;
    }
  }, {
    key: '_handleRepeat',
    value: function _handleRepeat() {
      var last = this.hints.length - 1;
      var nth = void 0;
      if (this.hints.some(function (hint, i) {
        nth = i;
        return hint.repeat && hint.ntimes === undefined;
      }) && nth !== last) {
        throw new Error('Only last hint may have option repeat w/o ntimes set');
      }

      // Deal with possible infinite args
      var lastHint = this.hints[last];
      Object.defineProperty(this, 'unbound', {
        value: lastHint.repeat && nth === last && lastHint.ntimes === undefined
      });

      if (this.unbound && lastHint.type === 'ignore') {
        lastHint.optional = true; // Hack to prevent a counting error when
        // combining keyFuncs: For 'ignore' type, 'repeat' should be
        // indistinguishable from 'rest' option
      }
    }
  }, {
    key: '_handleOptional',
    value: function _handleOptional() {
      // If a hint is optional, all following hints must also be.
      var optional = false;

      this.hints.forEach(function (hint, i) {
        if (!hint.optional && hint.type !== 'ignore' && optional) {
          throw new Error('Only trailing hints can be optional');
        }
        optional = optional || hint.optional;
      });

      // Deal with possible optional args
      Object.defineProperty(this, 'optional', {
        value: optional
      });
    }
  }]);

  return KeyFunc;
}();

function keyfunc() {
  for (var _len2 = arguments.length, hints = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    hints[_key2] = arguments[_key2];
  }

  return new (Function.prototype.bind.apply(KeyFunc, [null].concat(hints)))().keyfunc;
}

var equiv = exports.equiv = function equiv() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var key = keyfunc.apply(undefined, args);

  return function (arg1, arg2) {
    for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
      args[_key4 - 2] = arguments[_key4];
    }

    var k = key(arg1);
    var eqv = k === key(arg2);

    if (eqv && args.length !== 0) {
      args.some(function (arg) {
        eqv = eqv && k === key(arg);
        return !eqv;
      });
    }

    return eqv;
  };
};

var unequiv = exports.unequiv = function unequiv() {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  var key = keyfunc.apply(undefined, args);

  return function () {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    var set = new Set(args.map(function (arg) {
      return key(arg);
    }));
    return set.size === args.length;
  };
};