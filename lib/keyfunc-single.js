'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = singleFunc;

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

var _keyfuncObject = require('./keyfunc-object');

var _keyfuncObject2 = _interopRequireDefault(_keyfuncObject);

var _keyfuncArray = require('./keyfunc-array');

var _keyfuncArray2 = _interopRequireDefault(_keyfuncArray);

var _keyfuncProperty = require('./keyfunc-property');

var _keyfuncProperty2 = _interopRequireDefault(_keyfuncProperty);

var _keyfuncOption = require('./keyfunc-option');

var _keyfuncOption2 = _interopRequireDefault(_keyfuncOption);

var _keyfuncOptional = require('./keyfunc-optional');

var _keyfuncOptional2 = _interopRequireDefault(_keyfuncOptional);

var _removeDuplicates = require('./remove-duplicates');

var _removeDuplicates2 = _interopRequireDefault(_removeDuplicates);

var _formatHint = require('./format-hint');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var checkArgsLength = function checkArgsLength(args, _ref) {
  var repeat = _ref.repeat,
      ntimes = _ref.ntimes;

  // By default, single key functions must take 1 argument
  // but they can be used repeatedly, thus the filtering below

  if (args.length !== 0) {
    if (args.length === 1 || args.length === ntimes) {
      return;
    }

    if (repeat && ntimes === undefined) {
      return;
    }
  }

  throw new Error('Inconsistent number of arguments, can\'t generate key');
};

function singleFunc(_ref2, keyfunc) {
  var type = _ref2.type,
      property = _ref2.property,
      typesuffix = _ref2.typesuffix,
      sub = _ref2.sub,
      preprocess = _ref2.preprocess,
      optional = _ref2.optional,
      repeat = _ref2.repeat,
      unordered = _ref2.unordered,
      ntimes = _ref2.ntimes,
      unique = _ref2.unique;
  // Recursive generation
  var kfnc = void 0;

  if (optional) {
    return (0, _keyfuncOptional2.default)(singleFunc({ type: type, property: property, typesuffix: typesuffix, sub: sub }, keyfunc), { ntimes: ntimes, repeat: repeat, unordered: unordered, unique: unique });
  }

  switch (type) {
    case 'literal':
      kfnc = _sig2.default;
      break;

    case 'object':
      kfnc = (0, _keyfuncObject2.default)();
      break;

    case 'array':
      if (sub) {
        var hint = (0, _formatHint.formatOptionSub)(sub, typesuffix);
        kfnc = (0, _keyfuncArray2.default)(keyfunc.apply(undefined, _toConsumableArray(hint.elementHints)), hint.arrayHint);
      } else {
        // Shortcut used: 'array[:typesuffix]'
        kfnc = (0, _keyfuncArray2.default)(keyfunc(typesuffix));
      }
      break;

    case 'set':
      if (sub) {
        var _hint = (0, _formatHint.formatOptionSub)(sub, typesuffix);
        kfnc = (0, _keyfuncArray2.default)(keyfunc.apply(undefined, _toConsumableArray(_hint.elementHints)), Object.assign({
          unordered: true, unique: true }, _hint.arrayHint));
      } else {
        // Shortcut used: 'set[:typesuffix]'
        kfnc = (0, _keyfuncArray2.default)(keyfunc(typesuffix), { unordered: true, unique: true });
      }
      break;

    case 'property':
      if (property) {
        if (sub) {
          var _hint2 = (0, _formatHint.formatOptionSub)(sub, typesuffix, false);
          kfnc = (0, _keyfuncProperty2.default)(property, keyfunc(_hint2.elementHints));
        } else {
          // Option form: {type: 'property[:typesuffix]', property: 'propname'}
          kfnc = typesuffix ? (0, _keyfuncProperty2.default)(property, keyfunc(typesuffix)) : (0, _keyfuncProperty2.default)(property);
        }
      } else {
        // Shortcut form: 'property:propname', assuming default type 'literal'
        kfnc = keyfunc({
          type: 'property',
          property: typesuffix
        });
      }
      break;

    case 'option':
      kfnc = (0, _keyfuncOption2.default)(sub, keyfunc);
      break;

    case 'ignore':
      // Rely on kfnc remains undefined
      break;

    default:
      throw new TypeError('Unhandled keyfunc type: ' + JSON.stringify(type));
  }

  return function () {
    for (var _len = arguments.length, _args = Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    if (!kfnc) {
      // Ok, type 'ignore'
      return;
    }

    var args = preprocess ? [preprocess.apply(undefined, _args)] : _args;

    checkArgsLength(args, { repeat: repeat, ntimes: ntimes });

    var keys = args.map(function (arg) {
      return kfnc(arg);
    });

    if (unique) {
      keys = _removeDuplicates2.default.apply(undefined, _toConsumableArray(keys));
    }

    if (keys.length === 1) {
      return keys[0];
    }

    if (unordered) {
      keys = keys.sort();
    }

    return (0, _sig2.default)(keys.join(''));
  };
};
module.exports = exports['default'];