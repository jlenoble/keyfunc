### 'literal' option !heading

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
