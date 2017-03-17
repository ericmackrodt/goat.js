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
Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}} // OLD = /([&|]{2})|([\(\)])|([!]+)?([\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\)]+)?/g;

var EQUALITY_REGEX = /^\s*([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\\=)]+)?\s*$/;
var EXPRESSION_REGEX = /([&|]{2})|([\(\)])|([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\)]+)?/g;
var STRING_REGEX = /^['"](.*)['"]$/;
var NOT_REGEX = /^\s*([!]+)\s*(\w+)\s*$/;
var LOGICAL_OPERATORS = ['&&', '||'];
var RELATIONAL_OPERATORS = ['==', '!=', '===', '!==', '!', '>=', '<=', '>', '<'];
var BOOLEANS = ['true', 'false'];var

Goat = exports.Goat = function () {
    function Goat(expression, controller) {_classCallCheck(this, Goat);
        this._expression = expression;
        this._controller = controller;
    }_createClass(Goat, [{ key: '_getRegexMatchArray', value: function _getRegexMatchArray(

        regex, input) {
            var match = regex.exec(input);
            if (!match) return;
            match = match.filter(function (m) {return m !== undefined;});
            match.shift();
            return match;
        } }, { key: '_evaluateNot', value: function _evaluateNot(

        nots, value) {
            var evaluate = void 0;
            nots.shift();
            if (nots.length) {
                evaluate = this._evaluateNot(nots, value);
            }

            return this._getOperation('!', evaluate || this._getValue(value));
        } }, { key: '_getValue', value: function _getValue(

        m) {
            var match = void 0;
            if (match = this._getRegexMatchArray(NOT_REGEX, m)) {
                var nots = match[0].split('');
                return this._evaluateNot(nots, match[1]);
            } else if (BOOLEANS.indexOf(m) > -1) {
                return m === 'true';
            } else if (m in this._controller) {
                return this._getPropertyEval(this._controller, m);
            } else if (!isNaN(m)) {
                return parseInt(m);
            } else if (match = STRING_REGEX.exec(m)) {
                return match[1];
            } else {
                return m;
            }
        } }, { key: '_getPropertyEval', value: function _getPropertyEval(

        obj, prop) {
            return function () {return obj[prop];};
        } }, { key: '_asFunction', value: function _asFunction(

        val) {
            if (typeof val === 'function') {
                return val();
            } else {
                return val;
            }
        } }, { key: '_getOperation', value: function _getOperation(

        operation, left, right) {var _this = this;
            switch (operation) {
                case '==':
                    return function () {return _this._asFunction(left) == _this._asFunction(right);};
                case '!=':
                    return function () {return _this._asFunction(left) != _this._asFunction(right);};
                case '===':
                    return function () {return _this._asFunction(left) === _this._asFunction(right);};
                case '!==':
                    return function () {return _this._asFunction(left) !== _this._asFunction(right);};
                case '<=':
                case '=<':
                    return function () {return _this._asFunction(left) <= _this._asFunction(right);};
                case '>=':
                case '=<':
                    return function () {return _this._asFunction(left) >= _this._asFunction(right);};
                case '<':
                    return function () {return _this._asFunction(left) < _this._asFunction(right);};
                case '>':
                    return function () {return _this._asFunction(left) > _this._asFunction(right);};
                case '!':
                    return function () {return !_this._asFunction(left);};
                case '&&':
                    return function () {return _this._asFunction(left) && _this._asFunction(right);};
                case '||':
                    return function () {return _this._asFunction(left) || _this._asFunction(right);};}

        } }, { key: '_processExpression', value: function _processExpression(

        expression) {
            var match = void 0;
            if (!(expression instanceof Array)) {
                expression = [expression];
            }
            if (expression.length === 1 && (match = this._getRegexMatchArray(EQUALITY_REGEX, expression[0]))) {
                var left = this._getValue(match[0]);
                var right = this._getValue(match[2]);
                var operation = match[1];
                if (typeof left === 'function' && !right && !operation) {
                    expression[0] = left;
                } else {
                    expression[0] = this._getOperation(match[1], left, right);
                }
            }

            while (expression.length > 1 || typeof expression[0] !== 'function') {
                var index = -1;
                var leftIndex = 0;
                var rightIndex = 0;
                var _left = void 0;
                var _right = void 0;

                var subExpression = expression;
                var indexLeftParenthesis = expression.lastIndexOf('(');
                if (indexLeftParenthesis > -1) {
                    subExpression = subExpression.slice(indexLeftParenthesis + 1, subExpression.length);
                    var indexRightParenthesis = subExpression.indexOf(')');
                    subExpression = subExpression.slice(0, indexRightParenthesis);
                    var expressionLength = subExpression.length;
                    expression[indexLeftParenthesis] = this._processExpression(subExpression);
                    expression.splice(indexLeftParenthesis + 1, expressionLength + 1);

                    continue;
                }


                if ((index = expression.indexOf('&&')) > -1 &&
                expression[leftIndex = index - 1] !== ')' &&
                expression[rightIndex = index + 1] !== '(') {
                    // leftIndex = index - 1;
                    // rightIndex = index + 1;
                    _left = this._processExpression(expression[leftIndex]);
                    _right = this._processExpression(expression[rightIndex]);
                    expression[leftIndex] = this._getOperation('&&', _left, _right);
                    expression.splice(index, 2);

                    continue;
                } else if ((index = expression.indexOf('||')) > -1 &&
                expression[leftIndex = index - 1] !== ')' &&
                expression[rightIndex = index + 1] !== '(') {
                    // leftIndex = index - 1;
                    // rightIndex = index + 1;
                    _left = this._processExpression(expression[leftIndex]);
                    _right = this._processExpression(expression[rightIndex]);
                    expression[leftIndex] = this._getOperation('||', _left, _right);
                    expression.splice(index, 2);

                    continue;
                }

                break;
            }

            if (expression.length === 1) {
                return expression[0];
            }
        } }, { key: '_buildEvaluator', value: function _buildEvaluator()

        {
            var expression = this._expression.match(EXPRESSION_REGEX);
            EXPRESSION_REGEX.lastIndex = 0;
            return this._processExpression(expression);
        } }, { key: 'evaluate', value: function evaluate()

        {
            if (!this._evaluator) {
                this._evaluator = this._buildEvaluator();
            }

            return this._evaluator();
        } }]);return Goat;}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });var _goat = __webpack_require__(0);Object.defineProperty(exports, 'Goat', { enumerable: true, get: function get() {return _goat.Goat;} });

/***/ })
/******/ ]);
});
//# sourceMappingURL=goat.js.map