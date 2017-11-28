## `unequiv` factory !heading

`unequiv` is *not* the negation of `equiv`.

Like `equiv`, `unequiv` takes advantage of `keyfunc`'s unique key generation schemes to create custom comparison functions.

Like `equiv`, `unequiv` recieves the same hints as `keyfunc` and uses it underneath.

But `unequiv`'s truth requires that all arguments be different from *all* the other arguments. (Negating `equiv` requires only that *one* be different).

#include "build/docs/examples/unequiv.test.md"
