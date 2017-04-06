### Type 'option' !heading

Using the 'property' type may not be enough if one is interested in more than one property to generate a key. Often the 'literal' type will be enough, but again, one may want to ignore some properties, or check a property strictly. The 'option' type solves that by using the option 'sub' to specify what to expect for each relevant properties. The other ones will be ignored.

```js
import keyFunc from 'keyfunc';

const key = keyFunc({
  type: 'option',
  sub: {
    id: 'literal',
    name: 'literal'
  }
});

const option1 = {id: 1, name: 'a', color: 'red'};
const option2 = {id: 2, name: 'b', color: 'green'};
const option3 = {id: 1, name: 'a', color: 'blue'};

const s1 = key(option1);
const s2 = key(option2);
const s3 = key(option3);

s1 !== s2; // true
s1 === s3; // true
```
