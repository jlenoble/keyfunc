#### Option `unordered` !heading

Used on top level, this option allows to have all arguments use the same hint and makes their order not matter.

Used in combination with types `'array'`, it allows their elements to be unordered (but they already share their *sub-hint*).

Therefore beware of the difference between `{type: 'array', unordered: true}` and `{type: 'array', sub: {unordered: true}}`. Case 1 says that we expect any number of arguments in any order as arrays with their elements ordered, repeatable, in any number, and of type `'object'`. Case 2 says that we expect only one argument as an array with unordered, repeatable elements of type `'object'`.

#include "build/docs/examples/option-unordered.test.md"
