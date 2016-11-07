# keyfunc
Creates custom functions returning custom keys for any set of args

## Usage

Strict equality is too strong a condition when dealing with flyweights and the like. ```keyFunc``` helps create custom key functions that basically return the same key when object or set of objects are 'sufficiently' equal, thus allowing to reference only one element of the generated equivalency class for later use.

### Single argument

#### keyword 'strict'

Use it when you want to reference functions, globals, object generated once. But the key function will work with pretty much everything except litteral objects and arrays.

```js
import keyFunc from 'keyfunc';

const key = keyFunc('strict');
key(1) === key(1);
key('foo') === key('foo');
key(Number) === key(Number);
key(Object) === key(Object);
key({id: 1}) !== key({id: 1});
key({a: 0, uid: 1}) !== key({uid: 1, a: 0});
key({id: {a: 1, b: 2}}) !== key({id: {b: 2, a: 1}});
key([1, 2, 3]) !== key([1, 2, 3]);
key(console) === key(console);
key(key) === key(key);
key(function() {}) !== key(function() {});
```

#### keyword 'loose'

Use it when you want shared keys between litterals. The key will also work
with base types but not with functions.

```js
import keyFunc from 'keyfunc';

const key = keyFunc('loose');
key(1) === key(1);
key('foo') === key('foo');
key(Number); // Throws TypeError
key(Object); // Throws TypeError
key({id: 1}) === key({id: 1});
key({a: 0, uid: 1}) === key({uid: 1, a: 0});
key({id: {a: 1, b: 2}}) === key({id: {b: 2, a: 1}});
key([1, 2, 3]) === key([1, 2, 3]);
key(console) === key(console);
key(key); // Throws TypeError
key(function() {}); // Throws TypeError
```

#### option 'idProperty'

```js
import keyFunc from 'keyfunc';

const key = keyFunc({idProperty: 'uid'});

```

## License

keyfunc is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
