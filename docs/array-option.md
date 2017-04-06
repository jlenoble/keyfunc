### 'array' option !heading

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
