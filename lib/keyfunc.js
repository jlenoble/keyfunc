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

  return function (keyFuncs) {
    var max = keyFuncs.length - 1;

    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return args.map(function (arg, i) {
        return keyFuncs[i < max ? i : max](arg);
      }).join('_');
    };
  }(args.map(func));
};
module.exports = exports['default'];