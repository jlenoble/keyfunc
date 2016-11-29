'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyFunc;

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _objectfunc = require('./objectfunc');

var _objectfunc2 = _interopRequireDefault(_objectfunc);

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

    if (option.property && !option.type) {
      option.type = 'property';
    }

    if (option.sub) {
      if (option.type === 'array') {
        return function (stem, key) {
          return function (args) {
            return stem + (0, _sig2.default)([key.apply(undefined, _toConsumableArray(args))]);
          };
        }(option.stem ? option.stem : '', keyFunc.apply(undefined, _toConsumableArray(option.sub)));
      } else if (option.type === 'property') {
        return function (stem, prop, key) {
          return function (args) {
            args = [args].concat(_toConsumableArray(prop.split(':'))).reduce(function (obj, ppty) {
              if (!obj[ppty]) {
                throw new ReferenceError('Can\'t generate key for object with no property \'' + ppty + '\'');
              }
              return obj[ppty];
            });
            return stem + (0, _sig2.default)([key.apply(undefined, _toConsumableArray(args))]);
          };
        }(option.stem ? option.stem : '', option.property, keyFunc.apply(undefined, _toConsumableArray(option.sub)));
      } // else ignore option sub
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