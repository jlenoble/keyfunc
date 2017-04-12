#### Hint type `'array'` !heading

The `'array'` hint means that the corresponding argument in the generated key function is an array, that is to say an ordered list of repeatable elements.

If no options are specified, then the element type is expected to be `'object'`.
The type can be changed using one or the other special following constructs:

* `'array:type'` as in 'array:literal' or 'array:set'. The elements share then the same type `'literal'` or `'set'` in any number.
* `{type: 'array', sub: [type1[, type2][, type3...]]}`. The elements have respectively types `type1`, `type2` and 'type3' and are exactly 3.

#include "build/docs/examples/type-array.test.md"
