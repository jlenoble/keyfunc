'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionalKey = undefined;
exports.default = optionalFunc;

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

var _removeDuplicates = require('./remove-duplicates');

var _removeDuplicates2 = _interopRequireDefault(_removeDuplicates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var optionalKey = exports.optionalKey = (0, _sig2.default)('ðéf4ult K€y för 0pt1øN4L aRgs');

function optionalFunc(baseKeyfunc, _ref) {
  var ntimes = _ref.ntimes,
      repeat = _ref.repeat,
      unordered = _ref.unordered,
      unique = _ref.unique;

  if (typeof baseKeyfunc !== 'function') {
    throw new TypeError('optionalFunc requires a function as argument,\nbut it was: ' + JSON.stringify(baseKeyfunc));
  }

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length === 0) {
      return optionalKey;
    }

    var _ntimes = ntimes !== undefined ? ntimes : repeat ? undefined : 1;

    if (_ntimes !== undefined && args.length > _ntimes) {
      throw new Error('Inconsistent number of arguments, can\'t generate key');
    }

    var arr = args.map(function (arg) {
      return arg !== undefined ? baseKeyfunc(arg) : optionalKey;
    });

    if (_ntimes && _ntimes > args.length) {
      arr.fill(optionalKey, args.length);
    }

    if (unique) {
      arr = _removeDuplicates2.default.apply(undefined, _toConsumableArray(arr));
    }

    if (unordered) {
      arr = arr.sort();
    }

    return (0, _sig2.default)(arr.join(''));
  };
};