## Background !heading

*Take `2` and `'1 + 1'`. Are they equal? Maybe.*

*Take `{name: 'Patrick'}` and `{name: Patrick}`. Are they the same? It depends.*

There are two equality operators in *Javascript*, namely `==` and `===`. Both above comparisons yield `false` under both operators. But a glance at both of them and it's easy to convince oneself that in a sense both their terms could be regarded as equivalent to one another in each case. Not programmatically, sure, but maybe in your custom use cases.

*Then you need to write your own comparison functions, again.*

Once you have written a ton of them, always the same, or so slightly different, across many modules, it's now just a pain, especially when their only purpose is to enable unit tests 1000th and 1001th, just for them to be thrown away as usual right afterwards.

`keyfunc` enables you to create a great many custom key functions. As a multi-purpose [key function generator](#usage), it was originally written as the backbone of node module [singletons](https://github.com/jlenoble/singletons).

But to come back to our introducing questions, the key functions created by `keyfunc`'s little brother `equiv` will answer a big YES!

#include "build/docs/examples/background.test.md"
