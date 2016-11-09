# keyfunc
Creates custom functions returning custom keys for any set of args

## Usage

Strict equality is too strong a condition when dealing with flyweights and the like. ```keyFunc``` helps create custom key functions that basically return the same key when objects or set of objects are 'sufficiently' equal, thus allowing to reference only one element of the generated equivalency class for later use.

```js
import keyFunc from 'keyfunc';

const key = keyFunc({
  property: 'name',
  stem: 'name-'
});

key({name: 'Otto'}) === key({name: 'Otto'});
key({name: 'Otto'}) === 'name-Otto';
```

## Advanced usage

```keyFunc``` can take more than one argument. The generated key function will handle all passed arguments, so that you can generate keys for sets of independent objects.

```js
import keyFunc from 'keyfunc';

const key = keyFunc('object', {property: 'id'}, 'literal');

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

Object resulting in same keys may not be equal in all respect if you use the option 'property'. Be clear about your intent, or keep to other options.

## License

keyfunc is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
