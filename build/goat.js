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
var EQUALITY_REGEX = /^\s*([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\\=)]+)?\s*$/;
var STRING_REGEX = /^['"](.*)['"]$/;
var NOT_REGEX = /^\s*([!]+)\s*(\w+)\s*$/;
var LOGICAL_OPERATORS = ['&&', '||'];
var RELATIONAL_OPERATORS = ['==', '!=', '===', '!==', '!', '>=', '<=', '>', '<'];
/* Cache Variables
----------------------------------------------------------------*/
var fieldsCache = {};
/* Support Functions
----------------------------------------------------------------*/
var isBoolean = function (value) { return ['true', 'false'].indexOf(value) > -1; };
var isFunction = function (o) { return typeof o === 'function'; };
var matchExpression = function (expression) {
    return expression.match(/([&|]{2})|([\(\)])|([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\)]+)?/g);
};
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
var throwError = function () {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i] = arguments[_i];
    }
    throw new Error(msg.join(''));
};
var throwInvalidOperationError = function (operator) { return throwError("Operator " + operator + " is not valid"); };
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
var untilTruthy = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return fns.every(function (fn) { return !fn(); });
};
/* Processing Functions
----------------------------------------------------------------*/
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
        if (!result)
            throwInvalidOperationError(operation);
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
        var left = getValue(match[0], controller, parserToken);
        var right = getValue(match[2], controller, parserToken);
        var operation = match[1];
        if (isFunction(left) && !right && !operation) {
            operatorFunc = left;
        }
        else {
            operatorFunc = getOperation(match[1], left, right);
        }
        if (!operatorFunc)
            throwInvalidOperationError(match[1]);
        setFirstInExpression(expression, operatorFunc);
        return operatorFunc;
    }
};
var processExpression = function (expression, controller, parserToken) {
    if (!(expression instanceof Array)) {
        expression = [expression];
    }
    untilTruthy(function () { return processEquality(expression, controller, parserToken); }, function () { return processExplicitPrecedence(expression, controller, parserToken); }, function () { return processLogicalOperation('&&', expression, controller, parserToken); }, function () { return processLogicalOperation('||', expression, controller, parserToken); });
    if (expression.length > 1 || !isFunction(expression[0])) {
        return processExpression(expression, controller, parserToken);
    }
    else {
        return expression;
    }
};
/* Exported Functions
----------------------------------------------------------------*/
exports.getFields = function (token) { return fieldsCache[token]; };
exports.deleteFromCache = function (token) { return delete fieldsCache[token]; };
exports.generateRandomKey = function () { return Math.floor((1 + Math.random()) * 0x100000000000000).toString(16).substring(1); };
exports.buildEvaluator = function (expression, controller, parserToken) {
    var match = matchExpression(expression) || [];
    var result = processExpression(match, controller, parserToken);
    var evaluator = getFirstInExpression(result);
    if (result.length === 1 && isFunction(evaluator)) {
        return evaluator;
    }
    ;
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