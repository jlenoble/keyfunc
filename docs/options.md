### Options !heading

* `stem`: You may use option 'stem' to prepend to your keys a specific string. That helps figuring out what they were generated from. You need to use this option in combination with option 'type' if you want to use also an option type other than 'object' or 'property'.

* `type`: Default is 'object'; Any option having a property 'property' forces the type to be 'property'. This option helps hint the type when other options are needed simultaneously.

* `rest`: If omitted, the number of arguments of the generated key function is exactly that passed to keyFunc; if true for one argument, then the corresponding key function  will be used for all arguments not hinted in keyFunc; If several rest options are defined, only the first one is taken into account.

* `unordered`: By default, the arguments passed to the generated key function are strictly ordered. If set to true, then 'unordered' option enforces 'rest: true' and limits keyFunc initialization to one type only so that the generated key function now doesn't enforce ordering any more. See [Unordered lists](#unordered-lists) for an example.

* `sub`: Construct `'array:*'` allows to handle an ordered list of one type, but you often want an ordered list of mixed types. The `sub` option allows to handle this case. See [Mixed arrays](#mixed-arrays) for a discussion on its important use and its difference from a straight call to `keyFunc`. See also See [Mixed properties](#mixed-properties).

* `optional`: When true, then an argument is allowed to be missing/undefined. In such a case, a default key is provided so that keyFunc is prevented from throwing an exception.

#include "build/docs/examples/options.test.md"
