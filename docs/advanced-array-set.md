### `array:*` and `set:*` !heading

By default, options `'array'` and `'set'` define arrays and sets of objects compared with strict equality (`===`). When the comparison can (or should) be relaxed or precised, those options can be extended as such:

* `'array:literal'`: Expects an array of literals (strictly ordered).
* `'array:property:[propertyName]'`: Expects an array of objects with property 'propertyName' (strictly ordered).
* `'array:array'`: Expects an array (strictly ordered) of arrays (strictly ordered) of objects (strictly compared).
* `'array:set'`: Expects an array (strictly ordered) of arrays (unordered) of objects (strictly compared).
* `'set:literal'`: Expects an array of literals (unordered).
* `'set:property:[propertyName]'`: Expects an array of objects with property 'propertyName' (unordered).
* `'set:array'`: Expects an array (unordered) of arrays (strictly ordered) of objects (strictly compared).
* `'set:set'`: Expects an array (unordered) of arrays (unordered) of objects (strictly compared).

For other element types, you will need to use option 'sub' instead. See [Mixed arrays](#mixed-arrays).
