### 'property' option !heading

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
