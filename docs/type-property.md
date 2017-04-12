#### Hint type `'property'` !heading

The `'property'` hint, like the `'literal'` hint, is used when the corresponding argument in the generated key function will be compared according to a `JSON` representation. The difference lies in that in this case not the whole object is used but only whatever a specific property is set to.

As a string with no further options, this type requires that the property name be appended with a `:`, as in `'property:name'` or `property:length`.

It is actually possible to go much deeper, with constructs such as `'property:client:age'` or `'property:team:player:id'`.

If the property needs to be compared in a more complex way, use [option `'sub'`](#option-sub).

#include "build/docs/examples/type-property.test.md"
