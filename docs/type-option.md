### Type 'option' !heading

Using the 'property' type may not be enough if one is interested in more than one property to generate a key. Often the 'literal' type will be enough, but again, one may want to ignore some properties, or check a property strictly. The 'option' type solves that by using the option 'sub' to specify what to expect for each relevant properties. The other ones will be ignored.

#include "build/docs/examples/type-option.test.md"
