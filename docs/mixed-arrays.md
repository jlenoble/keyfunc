### Mixed arrays !heading

With [`array:* and set:*`](#array-and-set), you get collections built from a single type, that is `['object', 'object', ...]` or `['array', 'array', ...]` for example. Using straight `keyFunc`, you can get keys from mixed types to index an object, but you do so one at a time. For example, `(console, 'log')` and `(console, 'error')` can map two singletons using `keyFunc('object', 'literal')` key function. But neither constructs allow to index collections of complex singletons: You can't index one for example with `((console, 'log'), (console, 'error'))` except by using `keyFunc({type: 'literal', rest: true})`. But the latter option results in random side-effects once objects start getting mutated.

Therefore you need deep indexing with option `'sub'`. Syntax resembles that of `keyFunc` but arguments are wrapped in an array.

#include "build/docs/examples/mixed-arrays.test.md"
