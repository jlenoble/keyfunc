'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = keyFunc;

var _sig = require('sig');

var _sig2 = _interopRequireDefault(_sig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function strictKeyFunc() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options = Object.assign({ stem: 'key' }, options);
  var key;

  if (options.type) {
    var type = options.type;
    if (type === String) {
      type = 'string';
    } else if (type === Number) {
      type = 'number';
    } else if (type === Object) {
      type = 'object';
    } else if (type === Array) {
      type = 'array';
    }

    if (type === 'string' || type === 'number') {
      key = function (stem, type) {
        return function (inst) {
          if ((typeof inst === 'undefined' ? 'undefined' : _typeof(inst)) !== type) {
            throw new TypeError('Expected type ' + type + ' or Number for ' + JSON.stringify(inst));
          }
          return stem + inst;
        };
      }(options.stem, type);
    } else {
      key = function (stem, type) {
        var counter = 0;
        var map = new WeakMap();
        return function (inst) {
          var isArray = Array.isArray(inst);
          var thrw = (type !== 'object' || isArray) && !(type === 'array' && isArray);
          if (thrw) {
            throw new TypeError('Expected type ' + type + ' for ' + JSON.stringify(inst));
          }
          var key = map.get(inst);
          if (!key) {
            counter++;
            key = stem + counter;
            map.set(inst, key);
          }
          return key;
        };
      }(options.stem, type);
    }
  } else {
    key = function (stem) {
      var counter = 0;
      var map = new WeakMap();
      return function (inst) {
        switch (typeof inst === 'undefined' ? 'undefined' : _typeof(inst)) {
          case 'number':
          case 'string':
            return stem + (0, _sig2.default)(inst);
        }
        var key = map.get(inst);
        if (!key) {
          counter++;
          key = stem + counter;
          map.set(inst, key);
        }
        return key;
      };
    }(options.stem);
  }

  if (options.idProperty) {
    return function (idProperty, key) {
      return function (inst) {
        if (!inst[idProperty]) {
          throw new ReferenceError('No property \'' + idProperty + '\' defined for ' + JSON.stringify(inst));
        }
        return key(inst[idProperty]);
      };
    }(options.idProperty, key);
  }

  return key;
}

function looseKeyFunc() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options = Object.assign({ stem: 'key' }, options);

  var key = function (stem) {
    return function (inst) {
      return stem + (0, _sig2.default)(inst);
    };
  }(options.stem);

  if (options.idProperty) {
    return function (idProperty, key) {
      return function (inst) {
        if (!inst[idProperty]) {
          throw new ReferenceError('No property \'' + idProperty + '\' defined for ' + JSON.stringify(inst));
        }
        return key(inst[idProperty]);
      };
    }(options.idProperty, key);
  }

  return key;
}

function keyFunc() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var func = function func(option) {
    if (option === 'strict') {
      return strictKeyFunc(option);
    } else if (option === 'loose') {
      return looseKeyFunc(option);
    } else if (option.idProperty || option.stem) {
      return option.loose ? looseKeyFunc(option) : strictKeyFunc(option);
    }
  };

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