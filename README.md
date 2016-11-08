# keyfunc
Creates custom functions returning custom keys for any set of args

## Usage

Strict equality is too strong a condition when dealing with flyweights and the like. ```keyFunc``` helps create custom key functions that basically return the same key when objects or set of objects are 'sufficiently' equal, thus allowing to reference only one element of the generated equivalency class for later use.

```js
import keyFunc from 'keyfunc';

const key = keyFunc({
  idProperty: 'name',
  stem: 'name-',
  type: String
});

key({name: 'Otto'}) === key({name: 'Otto'}); // true
key({name: 'Otto'}) === 'name-Otto'; // true
```

### Options

* 'strict': Litteral objects and arrays generate different keys each time.
* 'loose': Litteral objects and and arrays generate the same keys each time.
* {idProperty: [String]}: Use 'idProperty' property of object to generate key instead of the whole object. This option forces to ignore any other property at the same level of 'idProperty'. Use with caution as you will match objects that share nothing but their ID.
* {stem: [String]}: Prepend the value of 'stem' to every key.
* {type: [Type || String]}: Hint to optimize generated key functions. If not provided, type checks will be made on every call.

## Advanced usage

```keyFunc``` can take more than one option argument. The generated key function will then handle as many passed arguments, so that you can generate keys for sets of independent objects.

```js
import keyFunc from 'keyfunc';

const key = keyFunc('strict', {idProperty: 'id'}, 'loose');

class Class {constructor(){}}
const c = new Class();
const obj = {id: 1};
key(c, obj, {color: 'blue'}) === key(c, obj, {color: 'blue'});
key(c, obj, {color: 'blue'}) === key(c, {id: 1, misc: 1},
  {color: 'blue'}); // true! Watch out!
key(c, obj, {color: 'blue'}) !== key(c, {id: 2}, {color: 'blue'});
key(c, obj, {color: 'blue'}) !== key(c, obj, {color: 'red'});
key(c, obj, {color: 'blue'}) !== key(console, obj, {color: 'blue'});
```

## CAVEAT

Object resulting in same keys may not be equal in all respect if you use the option 'idProperty'. Be clear about your intent, or keep to the other options.

## License

keyfunc is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
