# keyfunc

Creates custom functions returning custom keys for any set of args

  * [Background](#background)
  * [Usage](#usage)
  * [Hints](#hints)
    * [Hint types](#hint-types)
      * [Hint type `'object'`](#hint-type-object)
      * [Hint type `'literal'`](#hint-type-literal)
      * [Hint type `'property'`](#hint-type-property)
      * [Hint type `'option'`](#hint-type-option)
      * [Hint type `'array'`](#hint-type-array)
      * [Hint type `'set'`](#hint-type-set)
      * [Hint type `'ignore'`](#hint-type-ignore)
    * [Hint options](#hint-options)
      * [Option `'sub'`](#option-sub)
      * [Option `unordered`](#option-unordered)
      * [Option `ntimes`](#option-ntimes)
      * [Option `repeat`](#option-repeat)
      * [Option `unique`](#option-unique)
      * [Option `optional`](#option-optional)
      * [Option `rest`](#option-rest)
      * [Option `preprocess`](#option-preprocess)
  * [License](#license)


## Background

*Take `2` and `'1 + 1'`. Are they equal? Maybe.*

*Take `{name: 'Patrick'}` and `{name: Patrick}`. Are they the same? It depends.*

There are two equality operators in *Javascript*, namely `==` and `===`. Both above comparisons yield `false` under both operators. But a glance at both of them and it's easy to convince oneself that in a sense both their terms could be regarded as equivalent to one another in each case. Not programmatically, sure, but maybe in your custom use cases.

*Then you need to write your own comparison functions, again.*

Once you have written a ton of them, always the same, or so slightly different, across many modules, it's now just a pain, especially when their only purpose is to enable unit tests 1000th and 1001th, just for them to be thrown away as usual right afterwards.

`keyfunc` enables you to create a great many custom key functions. As a multi-purpose [key function generator](#usage), it was originally written as the backbone of node module [singletons](https://github.com/jlenoble/singletons).

But to come back to our introducing questions, the key functions created by `keyfunc`'s little brother `equiv` will answer a big YES!

```js
import {equiv} from 'keyfunc';

const eq1 = equiv({preprocess: eval});
const eq2 = equiv({property: 'name'});

eq1(2, '1 + 1'); // true;
eq1('2 * 3 * 4', '48 / 2', '6 * 6 * 2/3'); // true;
eq1('2 * 3 * 4', '25', '6 * 6 * 2/3'); // false;

eq2({name: 'Patrick'}, {name: 'Patrick'}); // true;
eq2({name: 'Patrick'}, {name: 'Patrick'}, {name: 'Patrick'}); // true;
eq2({name: 'Patrick'}, {name: 'Patrick'}, {name: 'Patricia'}); // false;
```

## Usage

`keyfunc` exports as a default an eponymous factory which takes as arguments a list of *hints*.

*Hints* are object literals and some expressive string shortcuts specifying what to expect with the corresponding arguments that will be passed to the key function made by the `keyfunc` factory.

For example, in `const key = keyfunc('set', 'set')`, `key` is a function that expects two arguments exactly, both *sets*, that is to say unordered arrays of unique (*i.e* appearing only once) of object (*i.e.* equal under the `===` operator) elements, or `key([1,2], [4,5,6,7] === key([2,1], [6,5,4,7]))`.

So `keyfunc` has the following signature:

`keyfunc([hint1][, hint2][, hint3...]) = [function]`

and the result of calling `keyfunc` has the following signature:

`function ([arg1][, arg2][, arg3...]) = [String]`,

where `hint1` hints at `arg1`, `hint2` hints at `arg2`, *etc*.

So in order to use `keyfunc`, it is key to understand what hints are made of.

## Hints

*Hints* are what `keyfunc` expects in order to build any key function.

### Hint types

*Hints* are first distinguished by types. They are `'object'`, `'literal'`, `'property'`, `'option'`, `'array'`, `'set'` and `'ignore'`.

#### Hint type `'object'`

The `'object'` hint is the default hint, that is to say that if `'keyfunc'` is called without any argument, it is the one that will be used. It is also the default for the elements of arrays when using hints `'array'` and `'set'`.

`'object'` is used when the corresponding argument in the generated key function must be compared using the `===` operator. For functions expecting one argument, or only distinct object arguments,  that type is not very useful, except to maintain the homogeneity of the code structure if many key functions are generated (you could use an `if` statement along with a series of `&&` and `===` operators).

But when the functions expect more than one arguments needing to be compared according to different schemes, it is pretty handy.

```js
import keyfunc from 'keyfunc';

const key1 = keyfunc();
const key2 = keyfunc('object', 'object');
const key3 = keyfunc('object', 'object', 'object');

const obj = {id: 1, name: 'Joe'};

const k1 = key1(String);
const k2 = key2(Number, console);
const k3 = key3(Math, obj, obj);

key1(String) === k1;
key1(Number) !== k1;

key2(Number, console) === k2;
key2(console, Number) !== k2;
key2(obj, console) !== k2;

key3(Math, obj, obj) === k3;
key3(Math, obj, {id: 1, name: 'Joe'}) !== k3;
key3(obj, Math, obj) !== k3;
```

#### Hint type `'literal'`

The `'literal'` hint is used when the corresponding argument in the generated key function will be compared according to its `JSON` representation. It is the least specific of all types. It is also the default used to compare properties when using the type `'property'`.

```js
import keyfunc from 'keyfunc';
import sig from 'sig';

const key1 = keyfunc('literal');
const key2 = keyfunc('literal', 'literal');
const key3 = keyfunc('literal', 'literal', 'literal');

const obj = {id: 1, name: 'Joe'};

const k1 = key1(obj);
const k2 = key2('John', 'Doe');
const k3 = key3(42, obj, obj);

key1(obj) === k1;
key1(21) !== k1;

key2('John', 'Doe') === k2;
key2('Doe', 'John') !== k2;
key2('Jane', 'Doe') !== k2;

key3(42, obj, obj) === k3;
key3(42, obj, {id: 1, name: 'Joe'}) === k3;
key3('42', obj, obj) !== k3;
```

#### Hint type `'property'`

The `'property'` hint, like the `'literal'` hint, is used when the corresponding argument in the generated key function will be compared according to a `JSON` representation. The difference lies in that in this case not the whole object is used but only whatever a specific property is set to.

As a string with no further options, this type requires that the property name be appended with a `:`, as in `'property:name'` or `property:length`.

It is actually possible to go much deeper, with constructs such as `'property:client:age'` or `'property:team:player:id'`.

If the property needs to be compared in a more complex way, use [option `'sub'`](#option-sub).

```js
import keyfunc from 'keyfunc';

const key1 = keyfunc('property:id');
const key2 = keyfunc('property:id', 'property:name');
const key3 = keyfunc('property:id', 'property:id', 'property:id');

const obj1 = {id: 1, name: 'Joe'};
const obj2 = {id: 2, name: 'Jane'};
const obj3 = {id: 3, name: 'Joyce'};

const k1 = key1(obj1);
const k2 = key2(obj1, obj2);
const k3 = key3(obj1, obj2, obj3);

key1(obj1) === k1;
key1(obj2) !== k1;

key2(obj1, obj2) === k2;
key2(obj2, obj1) !== k2;
key2(obj1, {id: 2, name: 'Jane'}) === k2;

key3(obj1, obj2, obj3) === k3;
key3(obj1, obj3, obj2) !== k3;
key3({id: 1, name: 'Joe'}, {id: 2, name: 'Jane'},{id: 3, name: 'Joyce'}) === k3;
```

#### Hint type `'option'`

Unlike the 3 former, the `'option'` hint cannot be used as just a string. It requires that the names of the properties to be considered be specified.

Specifying *sub-hints* is done through the option `'sub'`. Types `'array'`, `'set'` and `'property'` may use the construct as well.

The syntax of an `'option'` hint is of the form `{type: 'option', sub: {prop1: type1[, name2: type2][, name3: type3...]}}`. When only one name is specified, one may use alternatively the type `'property'`, though they won't yield the same key function, as the latter only considers whatever is *after* the property name, not the whole `'option'` object.

```js
import keyfunc from 'keyfunc';

const key1 = keyfunc({
  type: 'option',
  sub: {
    id: 'literal',
    name: 'literal',
  },
});
const key2 = keyfunc({
  type: 'option',
  sub: {
    id: 'literal',
    name: 'literal',
  },
}, {
  type: 'option',
  sub: {
    name: 'literal',
  },
});

const obj1 = {id: 1, name: 'Joe'};
const obj2 = {id: 2, name: 'Jane'};
const obj3 = {id: 3, name: 'Joyce'};

const k1 = key1(obj1);
const k2 = key2(obj1, obj2);

key1(obj1) === k1;
key1(obj2) !== k1;
key1({id: 1, name: 'Joe'}) === k1;

key2(obj1, obj2) === k2;
key2(obj1, obj3) !== k2;
key2(obj2, obj1) !== k2;
key2({id: 1, name: 'Joe'}, {name: 'Jane'}) === k2;
```

#### Hint type `'array'`

The `'array'` hint means that the corresponding argument in the generated key function is an array, that is to say an ordered list of repeatable elements.

If no options are specified, then the element type is expected to be `'object'`.
The type can be changed using one or the other special following constructs:

* `'array:type'` as in 'array:literal' or 'array:set'. The elements share then the same type `'literal'` or `'set'` in any number.
* `{type: 'array', sub: [type1[, type2][, type3...]]}`. The elements have respectively types `type1`, `type2` and 'type3' and are exactly 3.

```js
import keyfunc from 'keyfunc';

const key1 = keyfunc('array');
const key2 = keyfunc('array', 'array');
const key3 = keyfunc('array', 'array', 'array');

const obj1 = {id: 1, name: 'Joe'};
const obj2 = {id: 2, name: 'Jane'};
const obj3 = {id: 3, name: 'Joyce'};

const k1 = key1([obj1, obj2, obj3]);
const k2 = key2([obj1], [obj2, obj3]);
const k3 = key3([obj1, obj2], [obj2, obj3], [obj3, obj1]);

key1([obj1, obj2, obj3]) === k1;
key1([obj1, obj3, obj2]) !== k1;
key1([obj1, obj2]) !== k1;

key2([obj1], [obj2, obj3]) === k2;
key2([obj2], [obj2, obj3]) !== k2;
key2([obj1], [obj3, obj2]) !== k2;

key3([obj1, obj2], [obj2, obj3], [obj3, obj1]) === k3;
key3([obj1, obj2], [obj2], [obj3, obj1]) !== k3;
key3([obj3, obj1], [obj2, obj3], [obj1, obj2]) !== k3;
```

#### Hint type `'set'`

The `'set'` hint means that the corresponding argument in the generated key function is a set, that is to say an unordered list of unique elements.

If no options are specified, then the element type is expected to be `'object'`.
The type can be changed using one or the other special following constructs:

* `'set:type'` as in 'set:literal' or 'set:set'. The elements share then the same type `'literal'` or `'set'` in any number.
* `{type: 'set', sub: [type1[, type2][, type3...]]}`. The elements have respectively types `type1`, `type2` and 'type3' and are exactly 3.

```js
import keyfunc from 'keyfunc';

const key1 = keyfunc('set');
const key2 = keyfunc('set', 'set');
const key3 = keyfunc('set', 'set', 'set');

const obj1 = {id: 1, name: 'Joe'};
const obj2 = {id: 2, name: 'Jane'};
const obj3 = {id: 3, name: 'Joyce'};

const k1 = key1([obj1, obj2, obj3]);
const k2 = key2([obj1], [obj2, obj3]);
const k3 = key3([obj1, obj2], [obj2, obj3], [obj3, obj1]);

key1([obj1, obj2, obj3]) === k1;
key1([obj1, obj3, obj2]) === k1;
key1([obj1, obj2]) !== k1;

key2([obj1], [obj2, obj3]) === k2;
key2([obj2], [obj2, obj3]) !== k2;
key2([obj1], [obj3, obj2]) === k2;

key3([obj1, obj2], [obj2, obj3], [obj3, obj1]) === k3;
key3([obj2, obj1], [obj3, obj2], [obj1, obj3]) === k3;
key3([obj1, obj2], [obj2], [obj3, obj1]) !== k3;
key3([obj3, obj1], [obj2, obj3], [obj1, obj2]) !== k3;
```

#### Hint type `'ignore'`

The `'ignore'` hint is used whenever not to take into account a specific argument in the generated key function.

```js
import keyfunc from 'keyfunc';

const key1 = keyfunc('object', 'ignore');
const key2 = keyfunc('object', 'ignore', 'literal');
const key3 = keyfunc('ignore', 'ignore', 'property:name');

const obj = {id: 1, name: 'Joe'};

const k1 = key1(obj, 'anything');
const k2 = key2(obj, 'foo', 'bar');
const k3 = key3(42, 21, obj);

key1(obj, 'anything') === k1;
key1(obj, 'anything else') === k1;
key1({id: 1, name: 'Joe'}, 'anything else') !== k1;

key2(obj, 'foo', 'bar') === k2;
key2(obj, 'quux', 'bar') === k2;
key2(obj, 'foo', 'quux') !== k2;

key3(42, 21, obj) === k3;
key3(obj, obj, obj) === k3;
key3(42, 21, {id: 1, name: 'Jane'}) !== k3;
```


### Hint options

On top of its type, a hint may be further specified using several options. In such a case, the hint will take a literal object form instead of being just a string.

Currently possible options are `'ntimes'`, `'optional'`, `'preprocess'`, `'repeat'`, `'rest'`, `'sub'`, `'unique'` and `'unordered'`.

#### Option `'sub'`

It is the most important option, as it allows to mix types in as deep or as wide variations as you require. It applies to types `'array'`, `'set'`, `'property'` and `'option'`, but *sub-hints* can be of any types.

**Constructs:**

* `'array'`: `{type: 'array', sub: [...hints] || {...innerOptions}}`
* `'set'`: `{type: 'array', sub: [...hints] || {...innerOptions}}`
* `'property'`: `{type: 'property:propName', sub: hint}`
* `'option'`: `{type: 'option', sub: {prop1: hint1[, prop2: hint2...]}}`

`innerOptions` is used to specify some properties of arrays/sets, namely if they are ordered or not, unique or not, or a definite number or not (*sub-options* `'unordered'`, `'unique'` and `'ntimes'`).

```js
import keyfunc from 'keyfunc';

const key1 = keyfunc({type: 'array', sub: ['object', 'literal']});
const key2 = keyfunc({type: 'option', sub: {
  name: 'literal',
  elements: {type: 'array', sub: {type: 'literal', unordered: true}},
}});

const obj = {id: 1, name: 'team', elements: ['Joe', 'Bob', 'Karl']};

const k1 = key1([obj, 'new']);
const k2 = key2(obj);

key1([obj, 'new']) === k1;
key1([obj, 'old']) !== k1;
key1([{id: 1, name: 'team'}, 'new']) !== k1;

key2(obj) === k2;
key2({id: 1, name: 'team', elements: ['Karl', 'Bob', 'Joe']}) === k2;
key2({id: 1, name: 'team2', elements: ['Joe', 'Bob', 'Karl']}) !== k2;
```

#### Option `unordered`

Used on top level, this option allows to have all arguments use the same hint and makes their order not matter.

Used in combination with types `'array'`, it allows their elements to be unordered (but they already share their *sub-hint*).

Therefore beware of the difference between `{type: 'array', unordered: true}` and `{type: 'array', sub: {unordered: true}}`. Case 1 says that we expect any number of arguments in any order as arrays with their elements ordered, repeatable, in any number, and of type `'object'`. Case 2 says that we expect only one argument as an array with unordered, repeatable elements of type `'object'`.

```js
import keyfunc from 'keyfunc';

const key = keyfunc({type: 'array', unordered: true});

const obj1 = {id: 1};
const obj2 = {id: 2};
const obj3 = {id: 3};
const obj4 = {id: 4};

const k = key([obj1, obj2], [obj3], [obj4]);

key([obj1, obj2], [obj3], [obj4]) === k;
key([obj1, obj2], [obj4], [obj3]) === k;
key([obj1, obj2], [obj3], [{id: 4}]) !== k;
key([obj2, obj1], [obj3], [obj4]) !== k;
```

#### Option `ntimes`

Used on top level, this option allows to have several arguments use the same hint `ntimes` number of times.

Used in combination with types `'array'` or `'set'`, it limits their number of elements.

Therefore beware of the difference between `{type: 'array', ntimes: 5}` and `{type: 'array', sub: {ntimes: 5}}`. Case 1 says that we expect 5 arguments as 5 arrays with their elements ordered, repeatable, in any number, and of type `'object'`. Case 2 says that we expect only one argument as an array with 5 ordered, repeatable elements of type `'object'`.

```js
import keyfunc from 'keyfunc';

const key = keyfunc({type: 'array', ntimes: 3});

const obj1 = {id: 1};
const obj2 = {id: 2};
const obj3 = {id: 3};
const obj4 = {id: 4};

const k = key([obj1, obj2], [obj3], [obj4]);

key([obj1, obj2], [obj3], [obj4]) === k;
key([obj1, obj2], [obj3]); // throws;
key([obj1, obj2], [obj3], [{id: 4}]) !== k;
```

#### Option `repeat`

Option `repeat` allows to have all remaining arguments share the same hint. Only the last hint may have that option.

```js
import keyfunc from 'keyfunc';

const key1 = keyfunc({type: 'literal', repeat: true});
const key2 = keyfunc({type: 'literal'});

const obj1 = {id: 1};
const obj2 = {id: 2};

key1(obj1) === key2(obj1);
key1(obj1, obj2); // doesn't throw;
key2(obj1, obj2); // throws;
```

#### Option `unique`

Used on top level, this option forbids arguments to be identical.

Used in combination with types `'array'`, it forbids the same for their elements.

So with `{type: 'array', unique: true}`, we expect several distinct arrays and with `{type: 'array', sub: {unique: true}}`, we expect one array of distinct elements.

```js
import keyfunc from 'keyfunc';

const key1 = keyfunc({type: 'literal', unique: true});
const key2 = keyfunc({type: 'literal'});

const obj = {id: 1};

key1(obj) === key2(obj);
key1(obj, obj); // doesn't throw;
key2(obj, obj); // throws;
key1(obj, obj) === key2(obj);
```

#### Option `optional`

Option `optional` makes an argument (a property when type is `'option'`, an element when type is `'array'` or `'set'`) optional. This is different from using type `'ignore'` which means that the argument will never be considered.

With option `optional`, the argument/property/element is used when present and a filler key is used when not.

```js
import keyfunc from 'keyfunc';

const key = keyfunc({type: 'array', optional: true});

const obj1 = {id: 1};
const obj2 = {id: 2};
const obj3 = {id: 3};
const obj4 = {id: 4};

const k = key([obj1, obj2]);

key([obj1, obj2]) === k;
key([obj1, obj2], [obj3, obj4]); // throws;
key(); // doesn't throw;
```

#### Option `rest`

Option `rest` is a shortcut for options `repeat` + `optional`. The actual difference is that it allows to have no argument at all instead of having at least one.

```js
import keyfunc from 'keyfunc';

const key1 = keyfunc({type: 'literal', rest: true});
const key2 = keyfunc({type: 'literal'});

const obj1 = {id: 1};
const obj2 = {id: 2};

key1(obj1) !== key2(obj1);
key1(obj1, obj2); // doesn't throw;
key2(obj1, obj2); // throws;
key1(); // doesn't throw;
key2(); // throws;
```

#### Option `preprocess`

Option `preprocess` helps with arguments that can take more than one form, as when an 1-array is assimilated to a scalar for example.

The key function you generated with `keyfunc` can't handle complex cases. Sure, you can often use the `JSON` representation (option `'literal'`), but if your argument is expected to be an unordered array or something, it won't work.

Therefore you need to preprocess your arguments to make sure they have the proper signature every time.

Option `preprocess` must be a function that takes as argument whatever will be passed to your key function. It returns the preprocessed argument with the proper signature. For example `arg => Array.isArray(arg) ? arg : [arg]` is a typical preprocessing function.

```js
import keyfunc from 'keyfunc';

const key = keyfunc({
  type: 'literal',
  preprocess: (func, ...args) => {
    if (typeof arg === 'function') {
      return func(...args);
    } else {
      return func;
    }
  },
});

function fn (name, id) {
  return {name, id};
}

key(fn('Joe', 22)) === key({name: 'Joe', id: 22});
```




## License

keyfunc is [MIT licensed](./LICENSE).

© 2016-2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
