## Usage !heading

keyFunc takes at least as many arguments as you will use the generated function with.

Those arguments should hint on the nature of the arguments you will pass to the generated function. Main keywords are 'object', 'literal', 'property', 'array', 'set' and 'ignore' used as in the following example:

```js
import keyFunc from 'keyfunc';

const key = keyFunc(
  'object', // First argument must be an object matched strictly
  'literal', // Second argument can be anything matched literally
  {property: 'color'}, // Third argument can be anything matched literally from their property 'id' downwards
  'array', // Fourth argument is an array of 'object'
  'set', // Fifth argument is a set of 'object'
  'ignore', // Sixth argument is ignored
);

const obj = {id: 1};
const s1 = key(console, 'log', {color: 'red'}, [console, obj],
  [console, obj], console);
const s2 = key(console, 'log', {color: 'red'}, [console, obj],
  [obj, console], 'dummy');

s1 === s2; // true
```

There is also a type 'option' which can't be used without the option 'sub' specifying the nature of its properties. See [Type 'option'](#type-option).

See also [array:* and set:*](#array-and-set) for constructs ```array:*``` and ```set:*```. See [property:*](#property) for construct ```property:*```.

#include "docs/options.md"
