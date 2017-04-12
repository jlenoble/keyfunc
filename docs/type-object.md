#### Hint type `'object'` !heading

The `'object'` hint is the default hint, that is to say that if `'keyfunc'` is called without any argument, it is the one that will be used. It is also the default for the elements of arrays when using hints `'array'` and `'set'`.

`'object'` is used when the corresponding argument in the generated key function must be compared using the `===` operator. For functions expecting one argument, or only distinct object arguments,  that type is not very useful, except to maintain the homogeneity of the code structure if many key functions are generated (you could use an `if` statement along with a series of `&&` and `===` operators).

But when the functions expect more than one arguments needing to be compared according to different schemes, it is pretty handy.

#include "build/docs/examples/type-object.test.md"
