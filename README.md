# keyfunc
Creates custom functions returning custom keys for any set of args

## Usage

keyFunc takes at least as many arguments as you will use the generated function with.

Those arguments should hint on the nature of the arguments you will pass to the generated function. Main keywords are 'object', 'literal' and 'property' used as in the following example:

```js
import keyFunc from 'keyfunc';

const key = keyFunc(
  'object', // First argument must be an object matched strictly
  'literal', // Second argument can be anything matched literally
  {property: 'color'} // Third argument and all subsequent ones can be
  // anything matched literally from their property 'id' downwards
);

const s1 = key(console, 'log', {color: 'red'});
const s2 = key(console, 'log', {color: 'red'});

s1 === s2; // true
```

### Options

* ```stem```: You may use option 'stem' to prepend to your keys a specific string. That helps figuring out what they were generated from. You need to use this option in combination with option 'type' if you want to use also option 'literal'.

* ```type```: Often unused, as the default is 'object', and any option having a property 'property' forces the type to be 'property'. But when you use the option 'stem' and want a 'literal' treatment, then you need it.

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
  }
);

/first1_second[0-9a-f]{40}_third[0-9a-f]{40}_second[0-9a-f]{40}/.test(
  key(console, 'log', {color: 'red'}, 'dummy')); // true
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

## License

keyfunc is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
