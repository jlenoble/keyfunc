'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyFunc;

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _objectfunc = require('./objectfunc');

var _objectfunc2 = _interopRequireDefault(_objectfunc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function keyFunc() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var func = function func(option) {

    if ((0, _isString2.default)(option)) {
      option = {
        type: option
      };
    }

    if (option.property) {
      option.type = 'property';
    }

    return (0, _objectfunc2.default)(option.type, option);
  };

  return function (keyFuncs, args) {
    var max = keyFuncs.length - 1;
    var rest = 0;

    while (rest <= max) {
      if (args[rest].rest) {
        break;
      }
      rest++;
    }

    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return args.map(function (arg, i) {
        if (i <= max) {
          return keyFuncs[i](arg);
        } else {
          if (rest > max) {
            throw new Error('Too many arguments, can\'t generate key');
          }
          return keyFuncs[rest](arg);
        }
      }).join('_');
    };
  }(args.map(func), args);
};
module.exports = exports['default'];