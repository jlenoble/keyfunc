## `equiv` factory !heading

`equiv` takes advantage of `keyfunc`'s unique key generation schemes to create custom comparison functions.

`equiv` recieves the same hints as `keyfunc` and uses it underneath. The comparator it generates returns `true` or `false` depending on whether key strings are equal or not.

#include "build/docs/examples/equiv.test.md"
