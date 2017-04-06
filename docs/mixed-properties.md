### Mixed properties !heading

With [`property:*`](#property), just like for [`array:* and set:*`](#array-and-set), your properties point to base types like 'object' or 'array'. That is an improvement compared to default 'literal', but you will often want more flexibility and generate keys for arbitrary types.

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
