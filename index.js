'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyFunc;

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function strictKeyFunc() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (options.idProperty) {
    return function (idProperty) {
      return function strictKey(inst) {
        return inst[idProperty];
      };
    }(options.idProperty);
  }

  return function (stem) {
    var counter = 0;
    var map = new Map();
    return function strictKey(inst) {
      var key = map.get(inst);
      if (!key) {
        counter++;
        key = stem + counter;
        map.set(inst, key);
      }
      return key;
    };
  }(options.stem ? options.stem : 'key');
}

function looseKeyFunc() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (options.idProperty) {
    return function (idProperty) {
      return function strictKey(inst) {
        return inst[idProperty];
      };
    }(options.idProperty);
  }

  return _sig2.default;
}

function keyFunc() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var func = function func(option) {
    if (option === 'strict' || option.strict) {
      return strictKeyFunc(option);
    } else if (option === 'loose' || option.loose) {
      return looseKeyFunc(option);
    } else {
      return keyFunc(option);
    }
  };

  if (args.length === 1) {
    return func(args[0]);
  }

  return function (keyFuncs) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return args.map(function (arg, i) {
        return keyFuncs[i](arg);
      }).join('_');
    };
  }(args.map(func));
};
module.exports = exports['default'];