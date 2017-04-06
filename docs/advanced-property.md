### `property:*` !heading

By default, option `'property'` indicates that objects will be compared with regard to a particular property, specified as an option: `keyFunc({property: 'id'})` for example.

The comparison in such cases will be done literally. But if you want another type of comparison, you may use the following:

* `'property:object'`: Expects property to be an object, strictly compared.
* `'property:array'`: Expects property to be an array (strictly ordered) of objects (strictly compared).
* `'property:set'`: Expects property to be an array (unordered) of objects (strictly compared).

For other property types, you will need to use option 'sub' instead. See [Mixed properties](#mixed-properties).

For deep properties, you have the construct `{property: 'a:b:c:...'}`. See [Deep properties](#deep-properties).
