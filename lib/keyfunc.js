'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyFunc;

var _isString = require('is-string');

var _isString2 = _interopRequireDefault(_isString);

var _objectfunc = require('./objectfunc');

var _objectfunc2 = _interopRequireDefault(_objectfunc);

var _propertyfunc = require('./propertyfunc');

var _propertyfunc2 = _interopRequireDefault(_propertyfunc);

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
        return (0, _propertyfunc2.default)(option.property, option.stem ? option.stem : '', keyFunc(option.sub));
      } else if (option.type === 'option') {
        var keyObject = {};
        for (var key in option.sub) {
          keyObject[key] = keyFunc(option.sub[key]);
        }
        return function (stem, keyObject) {
          return function (args) {
            var res = {};
            for (var _key2 in keyObject) {
              res[_key2] = keyObject[_key2](args[_key2]);
            }
            return stem + (0, _sig2.default)(res);
          };
        }(option.stem ? option.stem : '', keyObject);
      } // else ignore option sub
    }

    return (0, _objectfunc2.default)(option.type, option);
  };

  return function (keyFuncs, args) {
    var max = keyFuncs.length - 1;
    var rest = 0;
    var unordered = false;

    while (rest <= max) {
      if (args[rest].unordered) {
        if (rest === 0 && args.length === 1) {
          unordered = true;
          args[rest].rest = true;
        } else {
          throw new Error('\'unordered\' option can only be used with a repeating single type');
        }
      }
      if (args[rest].rest) {
        break;
      }
      rest++;
    }

    return function () {

      var keys = [];

      for (var _len2 = arguments.length, args = Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
        args[_key3] = arguments[_key3];
      }

      args.forEach(function (arg, i) {
        if (i <= max) {
          if (keyFuncs[i]) {
            keys.push(keyFuncs[i](arg));
          }
        } else {
          if (rest > max) {
            throw new Error('Too many arguments, can\'t generate key');
          }
          if (keyFuncs[rest]) {
            keys.push(keyFuncs[rest](arg));
          }
        }
      });

      if (unordered) {
        keys.sort();
      }

      return keys.join('_');
    };
  }(args.map(func), args);
};
module.exports = exports['default'];