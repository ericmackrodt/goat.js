# goat.js
Goat.js is a conditional expre-he-he-he-ssion parser.

[![Build Status](https://travis-ci.org/ericmackrodt/goat.js.svg?branch=master)](https://travis-ci.org/ericmackrodt/goat.js)

It takes an object with data and a string containing a conditional expression then it parses the expression and compares it to the object giving you the result.

Install:
----------

You can either download the files from the build folder and reference them directly in you html file or download the library using npm.

```
npm install goatjs
```

How to use:
-----------

```
import ExpressionParser from 'goatjs';
// if you're not using node, just reference it from the window object 'goat.Goat';

const obj = { property: true };

const goat = new ExpressionParser('property === true', obj);
const result = goat.evaluate();
console.log(result);

// output: true
```