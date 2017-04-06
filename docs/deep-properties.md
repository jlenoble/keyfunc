### Deep properties !heading

Using the syntax of [Mixed properties](#mixed-properties), it's cumbersome to write hints to get to a deep property. But you can refine your declaration of 'property' to create the same key function. See the following example:

```js
import keyFunc from 'keyfunc';

const cumbersomeKey = keyFunc({
  property: 'humanity',
  sub: {
    property: 'man',
    sub: {
      property: 'brain',
      sub: {
        property: 'thought'
      }
    }
  }
});
const straightKey = keyFunc({property: 'humanity:man:brain:thought'});

const o = {humanity: {man: {brain: {thought: 'Duh?'}}}};

cumbersomeKey(o) === cumbersomeKey({humanity: {man: {brain: {thought: 'Duh?'}}}});
cumbersomeKey(o) !== cumbersomeKey({humanity: {man: {brain: {thought: 'Da!'}}}});
straightKey(o) === straightKey({humanity: {man: {brain: {thought: 'Duh?'}}}});
straightKey(o) !== straightKey({humanity: {man: {brain: {thought: 'Da!'}}}});
cumbersomeKey(o) === straightKey(o));
```
