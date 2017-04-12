#### Option `'sub'` !heading

It is the most important option, as it allows to mix types in as deep or as wide variations as you require. It applies to types `'array'`, `'set'`, `'property'` and `'option'`, but *sub-hints* can be of any types.

**Constructs:**

* `'array'`: `{type: 'array', sub: [...hints] || {...innerOptions}}`
* `'set'`: `{type: 'array', sub: [...hints] || {...innerOptions}}`
* `'property'`: `{type: 'property:propName', sub: hint}`
* `'option'`: `{type: 'option', sub: {prop1: hint1[, prop2: hint2...]}}`

`innerOptions` is used to specify some properties of arrays/sets, namely if they are ordered or not, unique or not, or a definite number or not (*sub-options* `'unordered'`, `'unique'` and `'ntimes'`).

#include "build/docs/examples/option-sub.test.md"
