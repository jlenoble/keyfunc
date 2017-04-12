#### Option `ntimes` !heading

Used on top level, this option allows to have several arguments use the same hint `ntimes` number of times.

Used in combination with types `'array'` or `'set'`, it limits their number of elements.

Therefore beware of the difference between `{type: 'array', ntimes: 5}` and `{type: 'array', sub: {ntimes: 5}}`. Case 1 says that we expect 5 arguments as 5 arrays with their elements ordered, repeatable, in any number, and of type `'object'`. Case 2 says that we expect only one argument as an array with 5 ordered, repeatable elements of type `'object'`.

#include "build/docs/examples/option-ntimes.test.md"
