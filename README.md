# keyfunc
Creates custom functions returning custom keys for any set of args

## Usage

keyFunc takes at least as many arguments as you will use the generated function with.

Those arguments should hint on the nature of the arguments you will pass to the generated function. Main keywords are 'object', 'literal', 'property', 'array' and 'set' used as in the following example:

```js
import keyFunc from 'keyfunc';

const key = keyFunc(
  'object', // First argument must be an object matched strictly
  'literal', // Second argument can be anything matched literally
  {property: 'color'}, // Third argument can be anything matched literally from their property 'id' downwards
  'array', // Fourth argument is an array of 'object'
  'set' // Fifth argument is a set of 'object'
);

const obj = {id: 1};
const s1 = key(console, 'log', {color: 'red'}, [console, obj],
  [console, obj]);
const s2 = key(console, 'log', {color: 'red'}, [console, obj],
  [obj, console]);

s1 === s2; // true
```

See also [array:* and set:*](#array-and-set) for constructs ```array:*``` and ```set:*```. See [property:*](#property) for construct ```property:*```.

### Options

* ```stem```: You may use option 'stem' to prepend to your keys a specific string. That helps figuring out what they were generated from. You need to use this option in combination with option 'type' if you want to use also an option type other than 'object' or 'property'.

* ```type```: Default is 'object'; Any option having a property 'property' forces the type to be 'property'. This option helps hint the type when other options are needed simultaneously.

* ```rest```: If omitted, the number of arguments of the generated key function is exactly that passed to keyFunc; if true for one argument, then the corresponding key function  will be used for all arguments not hinted in keyFunc; If several rest options are defined, only the first one is taken into account.

* ```unordered```: By default, the arguments passed to the generated key function are strictly ordered. If set to true, then 'unordered' option enforces 'rest: true' and limits keyFunc initialization to one type only so that the generated key function now doesn't enforce ordering any more. See [Unordered lists](#unordered-lists) for an example.

* ```sub```: Construct ```'array:*'``` allows to handle an ordered list of one type, but you often want an ordered list of mixed types. The ```sub``` option allows to handle this case. See [Mixed arrays](#mixed-arrays) for a discussion on its important use and its difference from a straight call to ```keyFunc```. See also See [Mixed properties](#mixed-properties).

```js
import keyFunc from 'keyfunc';

const key = keyFunc(
  {
    stem: 'first'
  },
  {
    stem: 'second',
    type: 'literal',
    rest: true
  },
  {
    stem: 'third',
    property: 'color'
  },
  {
    stem: 'fourth',
    type: 'array'
  },
  {
    stem: 'fifth',
    type: 'set'
  }
);

const obj = {id: 1};
/first1_second[0-9a-f]{40}_third[0-9a-f]{40}_fourth[0-9a-f]{40}_fifth[0-9a-f]{40}_second[0-9a-f]{40}/.test(
  key(console, 'log', {color: 'red'}, [console, obj], [obj, console], 'dummy')); // true
```

## 'object' vs 'literal' vs 'property'

There are advantages and drawbacks pertaining to each option type. Choose with caution.

### 'object' option

Use this if you know your objects are persistent. When used on intermediary literals, your keys will be only transient. But this option allows for user-friendly (human-readable) keys.

```js
import keyFunc from 'keyfunc';

const key = keyFunc('object');

const option1 = {color: 'red'};

const s1 = key(option1);
const s2 = key({color: 'green'});
const s3 = key({color: 'blue'});

s1 !== s2; // true
s2 !== s3; // true
s3 !== s1; // true

s1 === key(option1); // true
s1 !== key({color: 'red'}); // true
s1 !== key({color: 'red', size: 'Huge'}); // true
```

### 'literal' option

Use this when literal equality is fine. This reduces the number of possible keys, at the expense of key readability.

```js
import keyFunc from 'keyfunc';

const key = keyFunc('literal');

const option1 = {color: 'red'};

const s1 = key(option1);
const s2 = key({color: 'green'});
const s3 = key({color: 'blue'});

s1 !== s2; // true
s2 !== s3; // true
s3 !== s1; // true

s1 === key(option1); // true
s1 === key({color: 'red'}); // true
s1 !== key({color: 'red', size: 'Huge'}); // true
```

### 'property' option

Use this when matching on a specific property. This even further reduces the number of generated keys, but now you run the risk of matching pretty unrelated things.

```js
import keyFunc from 'keyfunc';

const key = keyFunc({property: 'color'});

const option1 = {color: 'red'};

const s1 = key(option1);
const s2 = key({color: 'green'});
const s3 = key({color: 'blue'});

s1 !== s2; // true
s2 !== s3; // true
s3 !== s1; // true

s1 === key(option1); // true
s1 === key({color: 'red'}); // true
s1 === key({color: 'red', size: 'Huge'}); // true
```

## 'array' vs 'set'

When using arrays as arguments, you may either match them simply by using the 'literal' option, or using the 'array' or 'set' options. In the latter case, each element in the list is matched using the 'object' option.

### 'array' option

Use this when matching arrays where order matters and matching literal objects should be considered different.

```js
import keyFunc from 'keyfunc';

const key = keyFunc('array');

const option1 = {color: 'red'};
const option2 = {color: 'green'};
const option3 = {color: 'blue'};

const s1 = key([option1, option2, option3]);
const s2 = key([option3, option2, option1]);
const s3 = key([option1, option2, option3]);

s1 !== s2; // true
s1 === s3; // true
```

### 'set' option

Use this when matching arrays where order doesn't matter and matching literal objects shoud be considered different.

```js
import keyFunc from 'keyfunc';

const key = keyFunc('set');

const option1 = {color: 'red'};
const option2 = {color: 'green'};
const option3 = {color: 'blue'};

const s1 = key([option1, option2, option3]);
const s2 = key([option3, option2, option1]);
const s3 = key([option1, option2, option3]);

s1 === s2; // true
s1 === s3; // true
```

## Advanced Usage

### ```array:*``` and ```set:*```

By default, options ```'array'``` and ```'set'``` define arrays and sets of objects compared with strict equality (```===```). When the comparison can (or should) be relaxed or precised, those options can be extended as such:

* ```'array:literal'```: Expects an array of literals (strictly ordered).
* ```'array:property:[propertyName]'```: Expects an array of objects with property 'propertyName' (strictly ordered).
* ```'array:array'```: Expects an array (strictly ordered) of arrays (strictly ordered) of objects (strictly compared).
* ```'array:set'```: Expects an array (strictly ordered) of arrays (unordered) of objects (strictly compared).
* ```'set:literal'```: Expects an array of literals (unordered).
* ```'set:property:[propertyName]'```: Expects an array of objects with property 'propertyName' (unordered).
* ```'set:array'```: Expects an array (unordered) of arrays (strictly ordered) of objects (strictly compared).
* ```'set:set'```: Expects an array (unordered) of arrays (unordered) of objects (strictly compared).

For other element types, you will need to use option 'sub' instead. See [Mixed arrays](#mixed-arrays).

### ```property:*```

By default, option ```'property'``` indicates that objects will be compared with regard to a particular property, specified as an option: ```keyFunc({property: 'id'})``` for example.

The comparison in such cases will be done literally. But if you want another type of comparison, you may use the following:

* ```'property:object'```: Expects property to be an object, strictly compared.
* ```'property:array'```: Expects property to be an array (strictly ordered) of objects (strictly compared).
* ```'property:set'```: Expects property to be an array (unordered) of objects (strictly compared).

For other property types, you will need to use option 'sub' instead. See [Mixed properties](#mixed-properties).

For deep properties, you have the construct ```{property: 'a:b:c:...'}```. See [Deep properties](#deep-properties).

### Mixed arrays

With [```array:* and set:*```](#array-and-set), you get collections built from a single type, that is ```['object', 'object', ...]``` or ```['array', 'array', ...]``` for example. Using straight ```keyFunc```, you can get keys from mixed types to index an object, but you do so one at a time. For example, ```(console, 'log')``` and ```(console, 'error')``` can map two singletons using ```keyFunc('object', 'literal')``` key function. But neither constructs allow to index collections of complex singletons: You can't index one for example with ```((console, 'log'), (console, 'error'))``` except by using ```keyFunc({type: 'literal', rest: true})```. But the latter option results in random side-effects once objects start getting mutated.

Therefore you need deep indexing with option ```'sub'```. Syntax resembles that of ```keyFunc``` but arguments are wrapped in an array.

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

### Mixed properties

With [```property:*```](#property), just like for [```array:* and set:*```](#array-and-set), your properties point to base types like 'object' or 'array'. That is an improvement compared to default 'literal', but you will often want more flexibility and generate keys for arbitrary types.

Just like for 'array', you can use the option 'sub' for that.

```js
import keyFunc from 'keyfunc';

const poorKey = keyFunc({property: 'data', rest: true});

const sharpKey = keyFunc({
  property: 'data', // Mandatory
  sub: {type: 'array', sub: ['object', 'literal']},
  rest: true // Expects a list of mixed arrays, not only a single one
});

const o1 = {name: 1};
const o2 = {name: 2};
const o3 = {name: 3};

const poor = poorKey({data: [o1, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});
const sharp = sharpKey({data: [o1, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});

o1.name = 4;

poor !== poorKey({data: [o1, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});
poor === poorKey({data: [{name: 1}, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});

sharp === sharpKey({data: [o1, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});
sharp !== sharpKey({data: [{name: 1}, 'name']}, {data: [o2, 'name']},
  {data: [o3, 'name']});
```  

### Deep properties

Using the syntax of [Mixed properties](#mixed-properties), it's cumbersome to write hints to get to a deep property. But you can refine your declaration of 'property' to create the same key function. See the following example:

```js
import keyFunc from 'keyfunc';

const cumbersomeKey = keyFunc({
  property: 'humanity',
  sub: {
    property: 'man',
    sub: {
      property: 'brain',
      sub: {
        property: 'thought'
      }
    }
  }
});
const straightKey = keyFunc({property: 'humanity:man:brain:thought'});

const o = {humanity: {man: {brain: {thought: 'Duh?'}}}};

cumbersomeKey(o) === cumbersomeKey({humanity: {man: {brain: {thought: 'Duh?'}}}});
cumbersomeKey(o) !== cumbersomeKey({humanity: {man: {brain: {thought: 'Da!'}}}});
straightKey(o) === straightKey({humanity: {man: {brain: {thought: 'Duh?'}}}});
straightKey(o) !== straightKey({humanity: {man: {brain: {thought: 'Da!'}}}});
cumbersomeKey(o) == straightKey(o));
```

### Unordered lists

```keyFunc``` generates key functions that, when they accept more than one argument, enforce strict ordering of those arguments. This is due to the fact that by default, arguments don't share their type, and therefore don't share the function that generates their keys.

But when all arguments have the same type, strict ordering may sometimes be too restrictive. With option 'unordered' provided to the first (and only) argument of ```keyFunc```, the limitation is lifted.

```js
import keyFunc from 'keyfunc';

const okey = keyFunc({type: 'object', rest: true});
const ukey = keyFunc({type: 'object', unordered: true});

const o1 = {id: 1};
const o2 = {id: 2};

okey(o1, o2) !== okey(o2, o1);
ukey(o1, o2) === ukey(o2, o1);
```

## License

keyfunc is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
