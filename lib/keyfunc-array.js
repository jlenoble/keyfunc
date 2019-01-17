'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = arrayFunc;

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

var _keyfuncObject = require('./keyfunc-object');

var _keyfuncObject2 = _interopRequireDefault(_keyfuncObject);

var _removeDuplicates = require('./remove-duplicates');

var _removeDuplicates2 = _interopRequireDefault(_removeDuplicates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function arrayFunc() {
  var elementKeyfunc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _keyfuncObject2.default)();
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var unordered = options.unordered,
      unique = options.unique,
      ntimes = options.ntimes,
      spread = options.spread;

  // used to be array => sig(array.map(elementKeyfunc))
  // but it breaks when elementKeyfunc is defined with a rest operator
  // because then the args passed to elementKeyFunc are (arg, i, array)
  // and elementKeyFunc may treat those as arg0, arg1, arg2 in some loop

  return function (array) {
    try {
      if (ntimes && array.length !== ntimes) {
        throw new Error('Inconsistent number of elements, can\'t generate key');
      }

      var arr = array;

      if (spread) {
        return (0, _sig2.default)([elementKeyfunc.apply(undefined, _toConsumableArray(arr))]);
      }

      arr = arr.map(function (arg) {
        return elementKeyfunc(arg);
      });

      if (unique) {
        arr = _removeDuplicates2.default.apply(undefined, _toConsumableArray(arr));
      }

      if (unordered) {
        arr = arr.sort();
      }

      return (0, _sig2.default)(arr);
    } catch (e) {
      if (e.message.match(/arr.map is not a function/)) {
        throw new TypeError('Function can only generate keys for ' + (unique ? 'sets' : 'arrays') + ', but argument was: ' + JSON.stringify(array));
      }
      throw e;
    }
  };
};
module.exports = exports.default;