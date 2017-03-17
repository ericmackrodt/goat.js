# goat.js
Goat.js is a conditional expre-he-he-he-ssion parser.

It takes an object with data and a string containing a conditional expression then it parses the expression and compares it to the object giving you the result.

How to use:
-----------

```
import { Goat } from 'goat.js';
// if you're not using node, just reference it from the window object 'goat.Goat';

const obj = { property: true };

const goat = new Goat('property === true', obj);
const result = goat.evaluate();
console.log(result);

// output: true
```