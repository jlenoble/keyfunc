#### Hint type `'set'` !heading

The `'set'` hint means that the corresponding argument in the generated key function is a set, that is to say an unordered list of unique elements.

If no options are specified, then the element type is expected to be `'object'`.
The type can be changed using one or the other special following constructs:

* `'set:type'` as in 'set:literal' or 'set:set'. The elements share then the same type `'literal'` or `'set'` in any number.
* `{type: 'set', sub: [type1[, type2][, type3...]]}`. The elements have respectively types `type1`, `type2` and 'type3' and are exactly 3.

#include "build/docs/examples/type-set.test.md"
