'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = objectFunc;
function objectFunc() {
  var counter = 0;
  var map = new WeakMap();
  var stem = 'o';

  return function (obj) {
    var key = map.get(obj);

    if (!key) {
      counter++;
      key = stem + counter;
      try {
        map.set(obj, key);
      } catch (e) {
        counter--;
        throw new TypeError('Function can only generate keys for objects,\nbut argument was: ' + JSON.stringify(obj));
      }
    }

    return key;
  };
};
module.exports = exports.default;