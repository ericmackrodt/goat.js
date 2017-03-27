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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EQUALITY_REGEX = /^\s*([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\\=)]+)?\s*$/;
var EXPRESSION_REGEX = /([&|]{2})|([\(\)])|([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\)]+)?/g;
var STRING_REGEX = /^['"](.*)['"]$/;
var NOT_REGEX = /^\s*([!]+)\s*(\w+)\s*$/;
var LOGICAL_OPERATORS = ['&&', '||'];
var RELATIONAL_OPERATORS = ['==', '!=', '===', '!==', '!', '>=', '<=', '>', '<'];
var fieldsCache = {};
var isBoolean = function (value) { return ['true', 'false'].indexOf(value) > -1; };
var generateRandomKey = function () { return Math.floor((1 + Math.random()) * 0x100000000000000).toString(16).substring(1); };
var matchExpression = function (expression) {
    return expression.match(/([&|]{2})|([\(\)])|([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\)]+)?/g);
};
var asFunction = function (val) { return typeof val === 'function' ? val() : val; };
var getRegexMatchArray = function (regex, input) {
    var match = regex.exec(input) || [];
    if (match.length === 0)
        return;
    match = match.filter(function (m) { return m !== undefined; });
    match.shift();
    return match;
};
var getOperation = function (operation, left, right) { return {
    '==': function () { return asFunction(left) == asFunction(right); },
    '!=': function () { return asFunction(left) != asFunction(right); },
    '===': function () { return asFunction(left) === asFunction(right); },
    '!==': function () { return asFunction(left) !== asFunction(right); },
    '<=': function () { return asFunction(left) <= asFunction(right); },
    '=<': function () { return asFunction(left) <= asFunction(right); },
    '>=': function () { return asFunction(left) >= asFunction(right); },
    '=>': function () { return asFunction(left) >= asFunction(right); },
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
    return function () { return !asFunction(evaluate || getValue(value, controller, parserToken)); };
};
var getPropertyEval = function (obj, prop) { return (function () { return obj[prop]; }); };
var setField = function (field, parserToken) {
    var cache = fieldsCache[parserToken];
    if (!cache) {
        cache = fieldsCache[parserToken] = [];
    }
    cache.push(field);
};
var getValue = function (m, controller, parserToken) {
    var match;
    if ((match = getRegexMatchArray(NOT_REGEX, m))) {
        var nots = match[0].split('');
        return evaluateNot(nots, match[1], controller, parserToken);
    }
    else if (isBoolean(m)) {
        return m === 'true';
    }
    else if (m in controller) {
        setField(m, parserToken);
        return getPropertyEval(controller, m);
    }
    else if (!isNaN(m)) {
        return parseInt(m);
    }
    else if ((match = STRING_REGEX.exec(m))) {
        return match[1];
    }
    else {
        return m;
    }
};
var processExpression = function (expression, controller, parserToken) {
    var match;
    if (!(expression instanceof Array)) {
        expression = [expression];
    }
    if (expression.length === 1 && (match = getRegexMatchArray(EQUALITY_REGEX, expression[0]))) {
        var left = getValue(match[0], controller, parserToken);
        var right = getValue(match[2], controller, parserToken);
        var operation = match[1];
        if (typeof left === 'function' && !right && !operation) {
            expression[0] = left;
        }
        else {
            expression[0] = getOperation(match[1], left, right);
        }
    }
    while (expression.length > 1 || typeof expression[0] !== 'function') {
        var index = -1;
        var leftIndex = 0;
        var rightIndex = 0;
        var left = void 0;
        var right = void 0;
        var subExpression = expression;
        var indexLeftParenthesis = expression.lastIndexOf('(');
        if (indexLeftParenthesis > -1) {
            subExpression = subExpression.slice(indexLeftParenthesis + 1, subExpression.length);
            var indexRightParenthesis = subExpression.indexOf(')');
            subExpression = subExpression.slice(0, indexRightParenthesis);
            var expressionLength = subExpression.length;
            expression[indexLeftParenthesis] = processExpression(subExpression, controller, parserToken);
            expression.splice(indexLeftParenthesis + 1, expressionLength + 1);
            continue;
        }
        if ((index = expression.indexOf('&&')) > -1 &&
            (expression[leftIndex = index - 1] !== ')') &&
            (expression[rightIndex = index + 1] !== '(')) {
            left = processExpression(expression[leftIndex], controller, parserToken);
            right = processExpression(expression[rightIndex], controller, parserToken);
            expression[leftIndex] = getOperation('&&', left, right);
            expression.splice(index, 2);
            continue;
        }
        else if ((index = expression.indexOf('||')) > -1 &&
            (expression[leftIndex = index - 1] !== ')') &&
            (expression[rightIndex = index + 1] !== '(')) {
            left = processExpression(expression[leftIndex], controller, parserToken);
            right = processExpression(expression[rightIndex], controller, parserToken);
            expression[leftIndex] = getOperation('||', left, right);
            expression.splice(index, 2);
            continue;
        }
        break;
    }
    if (expression.length === 1) {
        return expression[0];
    }
    ;
};
var buildEvaluator = function (expression, controller, parserToken) {
    var match = matchExpression(expression) || [];
    return processExpression(match, controller, parserToken);
};
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
        this._parserToken = generateRandomKey();
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
    /**
     * Evaluates current instance of the Expression Parser and returns
     * a boolean value based on the expression that was passed in the constructor.
     */
    default_1.prototype.evaluate = function () {
        if (!this._evaluator) {
            this._evaluator = buildEvaluator(this._expression, this._controller, this._parserToken);
            this._fields = fieldsCache[this._parserToken];
            delete fieldsCache[this._parserToken];
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