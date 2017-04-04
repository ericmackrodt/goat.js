(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("goat", [], factory);
	else if(typeof exports === 'object')
		exports["goat"] = factory();
	else
		root["goat"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* Constants
----------------------------------------------------------------*/

Object.defineProperty(exports, "__esModule", { value: true });
var EQUALITY_REGEX = /^\s*([^\sˆ&|\'"\(\)]+|["'][^'"]+["'])\s*$|^\s*([^\sˆ&|\'"\(\)]+|["'][^'"]*["'])\s*([^'"\w\s|&]{1,3})\s*([^\sˆ&|\'"\(\)]+|["'][^'"]*["'])\s*$/;
var STRING_REGEX = /^['"](.*)['"]$/;
var NOT_REGEX = /^\s*([!]+)\s*(\w+)\s*$/;
var LOGICAL_OPERATORS = ['&&', '||'];
var RELATIONAL_OPERATORS = ['==', '!=', '===', '!==', '!', '>=', '<=', '>', '<'];
/* Cache Variables
----------------------------------------------------------------*/
var expressionCache = {};
/* Support Functions
----------------------------------------------------------------*/
var isBoolean = function (value) { return ['true', 'false'].indexOf(value) > -1; };
var isFunction = function (o) { return typeof o === 'function'; };
var includes = function (o, value) { return o.indexOf(value) > -1; };
var getMiddleItem = function (expression) { return expression[Math.round((expression.length - 1) / 2)]; };
var matchExpression = function (expression) {
    return expression.match(/([&|]{2})|([\(\)])|([^\sˆ&|\'"\(\)]+|["'].+["'])\s*([^\w\s|&\(\)]{1,3})?\s*([^\sˆ&|\(\)]+)?/g);
};
var isProperty = function (expression) { return /^\s*([a-z]\w+)(\.[a-z]\w+)*\s*$/g.test(expression); };
var asFunction = function (val) { return isFunction(val) ? val() : val; };
var setFirstInExpression = function (expression, value) { return expression[0] = value; };
var getFirstInExpression = function (expression) { return expression[0]; };
var getRegexMatchArray = function (regex, input) {
    var match = regex.exec(input) || [];
    if (match.length === 0)
        return;
    match = match.filter(function (m) { return m !== undefined; });
    match.shift();
    return match;
};
var getExpression = function (token) { return expressionCache[token].expression; };
var throwError = function () {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i] = arguments[_i];
    }
    throw new Error(msg.join(''));
};
var throwInvalidOperationError = function (operator, token) { return throwError("Operator [" + operator + "] is not valid in expression [" + getExpression(token) + "]"); };
var throwInvalidExpressionError = function (token) { return throwError("Invalid expression [" + getExpression(token) + "]"); };
var getOperation = function (operation, left, right) { return {
    '==': function () { return asFunction(left) == asFunction(right); },
    '!=': function () { return asFunction(left) != asFunction(right); },
    '===': function () { return asFunction(left) === asFunction(right); },
    '!==': function () { return asFunction(left) !== asFunction(right); },
    '<=': function () { return asFunction(left) <= asFunction(right); },
    '>=': function () { return asFunction(left) >= asFunction(right); },
    '<': function () { return asFunction(left) < asFunction(right); },
    '>': function () { return asFunction(left) > asFunction(right); },
    '&&': function () { return asFunction(left) && asFunction(right); },
    '||': function () { return asFunction(left) || asFunction(right); }
}[operation]; };
var evaluateNot = function (nots, value, controller, parserToken) {
    var evaluate;
    nots.shift();
    if (nots.length) {
        evaluate = evaluateNot(nots, value, controller, parserToken);
    }
    var operand = processOperand(value, controller, parserToken);
    return function () { return !asFunction(evaluate || operand); };
};
var buildPropertyCaller = function (fields, lastFunction) {
    var last = fields[fields.length - 1];
    fields.pop();
    // function that evaluates current property
    var fn;
    if (!lastFunction) {
        fn = function (obj) { return obj[last]; };
    }
    else {
        fn = function (obj) { return lastFunction(obj[last]); };
    }
    if (fields.length) {
        return buildPropertyCaller(fields, fn);
    }
    return fn;
};
var setField = function (field, parserToken) {
    var cache = expressionCache[parserToken].fields;
    if (!cache) {
        cache = expressionCache[parserToken].fields = [];
    }
    cache.push(field);
};
/**
 * Executes functions in series until one of them returns a truthy value.
 * If it does, the function returns true.
 * @param fns Functions to be executed
 */
var untilTruthy = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return !fns.every(function (fn) { return !fn(); });
};
/* Processing Functions
----------------------------------------------------------------*/
var processOperand = function (m, controller, parserToken) {
    var match;
    if ((match = getRegexMatchArray(NOT_REGEX, m))) {
        var nots = match[0].split('');
        return evaluateNot(nots, match[1], controller, parserToken);
    }
    else if (isBoolean(m)) {
        return m === 'true';
    }
    else if (isProperty(m)) {
        var caller_1 = buildPropertyCaller(m.split('.'));
        setField(m, parserToken);
        return function () { return caller_1(controller); };
    }
    else if (!isNaN(m)) {
        return parseInt(m);
    }
    else if ((match = STRING_REGEX.exec(m))) {
        return getMiddleItem(match);
    }
    throwInvalidExpressionError(parserToken);
};
var processLogicalOperation = function (operation, expression, controller, parserToken) {
    var index = -1;
    var leftIndex = 0;
    var rightIndex = 0;
    if ((index = expression.indexOf(operation)) > -1 &&
        (expression[leftIndex = index - 1] !== ')') &&
        (expression[rightIndex = index + 1] !== '(')) {
        var left = processExpression(expression[leftIndex], controller, parserToken);
        var right = processExpression(expression[rightIndex], controller, parserToken);
        var result = getOperation(operation, getFirstInExpression(left), getFirstInExpression(right));
        expression[leftIndex] = result;
        expression.splice(index, 2);
        return result;
    }
};
var processExplicitPrecedence = function (expression, controller, parserToken) {
    var subExpression = expression;
    var indexLeftParenthesis = expression.lastIndexOf('(');
    if (indexLeftParenthesis > -1) {
        subExpression = subExpression.slice(indexLeftParenthesis + 1, subExpression.length);
        var indexRightParenthesis = subExpression.indexOf(')');
        subExpression = subExpression.slice(0, indexRightParenthesis);
        var expressionLength = subExpression.length;
        var result = processExpression(subExpression, controller, parserToken);
        expression[indexLeftParenthesis] = result;
        expression.splice(indexLeftParenthesis + 1, expressionLength + 1);
        return result;
    }
};
var processEquality = function (expression, controller, parserToken) {
    var match;
    var operatorFunc;
    if (expression.length === 1 && (match = getRegexMatchArray(EQUALITY_REGEX, getFirstInExpression(expression)))) {
        var left = processOperand(match[0], controller, parserToken);
        var right = match[2];
        if (right) {
            right = processOperand(match[2], controller, parserToken);
        }
        var operation = match[1];
        if (isFunction(left) && !right && !operation) {
            operatorFunc = left;
        }
        else {
            operatorFunc = getOperation(match[1], left, right);
        }
        if (!operatorFunc)
            throwInvalidOperationError(match[1], parserToken);
        setFirstInExpression(expression, operatorFunc);
        return operatorFunc;
    }
};
var processExpression = function (expression, controller, parserToken) {
    if (!(expression instanceof Array)) {
        expression = [expression];
    }
    if (expression.length === 3 && !includes(LOGICAL_OPERATORS, getMiddleItem(expression))) {
        throwError("Invalid logical operator [" + getMiddleItem(expression) + "] in expression [" + getExpression(parserToken) + "]");
    }
    if (!untilTruthy(function () { return processEquality(expression, controller, parserToken); }, function () { return processExplicitPrecedence(expression, controller, parserToken); }, function () { return processLogicalOperation('&&', expression, controller, parserToken); }, function () { return processLogicalOperation('||', expression, controller, parserToken); }) && (expression.length % 2) === 1 && !isFunction(getFirstInExpression(expression))) {
        throwInvalidExpressionError(parserToken);
    }
    if (expression.length > 1 || !isFunction(getFirstInExpression(expression))) {
        return processExpression(expression, controller, parserToken);
    }
    else {
        return expression;
    }
};
/* Exported Functions
----------------------------------------------------------------*/
exports.getFields = function (token) { return expressionCache[token].fields; };
exports.deleteFromCache = function (token) { return delete expressionCache[token]; };
exports.generateRandomKey = function () { return Math.floor((1 + Math.random()) * 0x100000000000000).toString(16).substring(1); };
exports.buildEvaluator = function (expression, controller, parserToken) {
    var match = matchExpression(expression) || [];
    expressionCache[parserToken] = { expression: expression };
    if (match.length % 2 === 0) {
        throwInvalidExpressionError(parserToken);
    }
    var result = processExpression(match, controller, parserToken);
    return getFirstInExpression(result);
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var evaluation_builder_1 = __webpack_require__(0);
/**
 * Expression parser class
 */
var default_1 = (function () {
    /**
     * Creates new instance of the ExpressionParser.
     * @param _expression Expression to be parsed
     * @param _controller Object with fields that will be evaluated
     */
    function default_1(_expression, _controller) {
        this._expression = _expression;
        this._controller = _controller;
        this._parserToken = evaluation_builder_1.generateRandomKey();
    }
    Object.defineProperty(default_1.prototype, "fields", {
        /**
         * Object fields that were used in the expression.
         */
        get: function () {
            return this._fields;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(default_1.prototype, "currentEvaluator", {
        /**
         * Returns the current evaluator function without triggering it like the evaluate() function does.
         */
        get: function () {
            return this._evaluator;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Evaluates current instance of the Expression Parser and returns
     * a boolean value based on the expression that was passed in the constructor.
     */
    default_1.prototype.evaluate = function () {
        if (!this._evaluator) {
            this._evaluator = evaluation_builder_1.buildEvaluator(this._expression, this._controller, this._parserToken);
            this._fields = evaluation_builder_1.getFields(this._parserToken);
            evaluation_builder_1.deleteFromCache(this._parserToken);
        }
        return this._evaluator();
    };
    return default_1;
}());
exports.default = default_1;


/***/ })
/******/ ]);
});
//# sourceMappingURL=goat.js.map