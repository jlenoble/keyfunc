#### Hint type `'option'` !heading

Unlike the 3 former, the `'option'` hint cannot be used as just a string. It requires that the names of the properties to be considered be specified.

Specifying *sub-hints* is done through the option `'sub'`. Types `'array'`, `'set'` and `'property'` may use the construct as well.

The syntax of an `'option'` hint is of the form `{type: 'option', sub: {prop1: type1[, name2: type2][, name3: type3...]}}`. When only one name is specified, one may use alternatively the type `'property'`, though they won't yield the same key function, as the latter only considers whatever is *after* the property name, not the whole `'option'` object.

#include "build/docs/examples/type-option.test.md"
