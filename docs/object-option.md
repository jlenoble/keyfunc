### 'object' option !heading

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
