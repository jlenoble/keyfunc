#### Option `optional` !heading

Option `optional` makes an argument (a property when type is `'option'`, an element when type is `'array'` or `'set'`) optional. This is different from using type `'ignore'` which means that the argument will never be considered.

With option `optional`, the argument/property/element is used when present and a filler key is used when not.

#include "build/docs/examples/option-optional.test.md"
