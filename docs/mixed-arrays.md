### Mixed arrays !heading

With [`array:* and set:*`](#array-and-set), you get collections built from a single type, that is `['object', 'object', ...]` or `['array', 'array', ...]` for example. Using straight `keyFunc`, you can get keys from mixed types to index an object, but you do so one at a time. For example, `(console, 'log')` and `(console, 'error')` can map two singletons using `keyFunc('object', 'literal')` key function. But neither constructs allow to index collections of complex singletons: You can't index one for example with `((console, 'log'), (console, 'error'))` except by using `keyFunc({type: 'literal', rest: true})`. But the latter option results in random side-effects once objects start getting mutated.

Therefore you need deep indexing with option `'sub'`. Syntax resembles that of `keyFunc` but arguments are wrapped in an array.

```js
import keyFunc from 'keyfunc';

const poorKey = keyFunc({type: 'literal', rest: true});

const sharpKey = keyFunc({
  type: 'array', // Mandatory
  sub: ['object', 'literal'],
  rest: true // Expects a list of mixed arrays, not only a single one
});

const o1 = {name: 1};
const o2 = {name: 2};
const o3 = {name: 3};

const poor = poorKey([o1, 'name'], [o2, 'name'], [o3, 'name']);
const sharp = sharpKey([o1, 'name'], [o2, 'name'], [o3, 'name']);

o1.name = 4;

poor !== poorKey([o1, 'name'], [o2, 'name'], [o3, 'name']);
poor === poorKey([{name: 1}, 'name'], [o2, 'name'], [o3, 'name']);

sharp === sharpKey([o1, 'name'], [o2, 'name'], [o3, 'name']);
sharp !== sharpKey([{name: 1}, 'name'], [o2, 'name'], [o3, 'name']);
```
