### Unordered lists !heading

`keyFunc` generates key functions that, when they accept more than one argument, enforce strict ordering of those arguments. This is due to the fact that by default, arguments don't share their type, and therefore don't share the function that generates their keys.

But when all arguments have the same type, strict ordering may sometimes be too restrictive. With option 'unordered' provided to the first (and only) argument of `keyFunc`, the limitation is lifted.

#include "build/docs/examples/unordered-lists.test.md"
