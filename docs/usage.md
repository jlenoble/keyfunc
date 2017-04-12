## Usage !heading

`keyfunc` exports as a default an eponymous factory which takes as arguments a list of *hints*.

*Hints* are object literals and some expressive string shortcuts specifying what to expect with the corresponding arguments that will be passed to the key function made by the `keyfunc` factory.

For example, in `const key = keyfunc('set', 'set')`, `key` is a function that expects two arguments exactly, both *sets*, that is to say unordered arrays of unique (*i.e* appearing only once) of object (*i.e.* equal under the `===` operator) elements, or `key([1,2], [4,5,6,7] === key([2,1], [6,5,4,7]))`.

So `keyfunc` has the following signature:

`keyfunc([hint1][, hint2][, hint3...]) = [function]`

and the result of calling `keyfunc` has the following signature:

`function ([arg1][, arg2][, arg3...]) = [String]`,

where `hint1` hints at `arg1`, `hint2` hints at `arg2`, *etc*.

So in order to use `keyfunc`, it is key to understand what hints are made of.
