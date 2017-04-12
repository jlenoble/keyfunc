#### Option `unique` !heading

Used on top level, this option forbids arguments to be identical.

Used in combination with types `'array'`, it forbids the same for their elements.

So with `{type: 'array', unique: true}`, we expect several distinct arrays and with `{type: 'array', sub: {unique: true}}`, we expect one array of distinct elements.

#include "build/docs/examples/option-unique.test.md"
