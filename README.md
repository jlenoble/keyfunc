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
  {property: 'color'}, // Third argument and all subsequent ones can be
  // anything matched literally from their property 'id' downwards
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

### Options

* ```stem```: You may use option 'stem' to prepend to your keys a specific string. That helps figuring out what they were generated from. You need to use this option in combination with option 'type' if you want to use also option 'literal'.

* ```type```: Default is 'object'; Any option having a property 'property' forces the type to be 'property'. This option helps hint the type when other options are needed (that is ```stem``` and ```rest```) simultaneously.

* ```rest```: If omitted, the number of arguments of the generated key function is exactly that passed to keyFunc; if true for one argument, then the corresponding key function  will be used for all arguments not hinted in keyFunc; If several rest options are defined, only the first one is taken into account.

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

## License

keyfunc is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
