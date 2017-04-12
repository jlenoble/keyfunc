#### Option `preprocess` !heading

Option `preprocess` helps with arguments that can take more than one form, as when an 1-array is assimilated to a scalar for example.

The key function you generated with `keyfunc` can't handle complex cases. Sure, you can often use the `JSON` representation (option `'literal'`), but if your argument is expected to be an unordered array or something, it won't work.

Therefore you need to preprocess your arguments to make sure they have the proper signature every time.

Option `preprocess` must be a function that takes as argument whatever will be passed to your key function. It returns the preprocessed argument with the proper signature. For example `arg => Array.isArray(arg) ? arg : [arg]` is a typical preprocessing function.

#include "build/docs/examples/option-preprocess.test.md"
