// OLD = /([&|]{2})|([\(\)])|([!]+)?([\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\)]+)?/g;

const EQUALITY_REGEX = /^\s*([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\\=)]+)?\s*$/;
const EXPRESSION_REGEX = /([&|]{2})|([\(\)])|([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\)]+)?/g;
const STRING_REGEX = /^['"](.*)['"]$/;
const NOT_REGEX = /^\s*([!]+)\s*(\w+)\s*$/;
const LOGICAL_OPERATORS = ['&&', '||'];
const RELATIONAL_OPERATORS = ['==', '!=', '===', '!==', '!', '>=', '<=', '>', '<'];
const BOOLEANS = ['true', 'false'];

type Operatee = string | (() => boolean);
interface IKeyFunction {
    [key: string]: () => boolean;
}

interface IKeyValue {
    [key: string]: any;
}

const isBoolean = (value: string) => ['true', 'false'].indexOf(value) > -1;

const matchExpression = (expression: string) => 
    expression.match(/([&|]{2})|([\(\)])|([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\)]+)?/g);

const asFunction = (val: any) => typeof val === 'function' ? val() : val;

const getRegexMatchArray = (regex: RegExp, input: string) => {
    let match: string[] = regex.exec(input) || [];
    if (match.length === 0) return;
    match = match.filter(m => m !== undefined);
    match.shift();
    return match;
};

const getOperation = (operation: string, left: Operatee, right?: Operatee) => (<IKeyFunction>{
    '==': () => asFunction(left) == asFunction(right),
    '!=': () => asFunction(left) != asFunction(right),
    '===': () => asFunction(left) === asFunction(right),
    '!==': () => asFunction(left) !== asFunction(right),
    '<=': () => asFunction(left) <= asFunction(right),
    '=<': () => asFunction(left) <= asFunction(right),
    '>=': () => asFunction(left) >= asFunction(right),
    '=>': () => asFunction(left) >= asFunction(right),
    '<': () => asFunction(left) < asFunction(right),
    '>': () => asFunction(left) > asFunction(right),
    '&&': () => asFunction(left) && asFunction(right),
    '||': () => asFunction(left) || asFunction(right)
})[operation];

const evaluateNot = (nots: string[], value: string, controller: IKeyValue) => {
    let evaluate: Operatee;
    nots.shift();
    if (nots.length) {
        evaluate = evaluateNot(nots, value, controller);
    }

    return () => !asFunction(evaluate || getValue(value, controller));
}

const getPropertyEval = (obj: IKeyValue, prop: string) => (() => obj[prop]);

const getValue = (m: any, controller: IKeyValue): any => {
    let match;
    if ((match = getRegexMatchArray(NOT_REGEX, m))) {
        const nots = match[0].split('');
        return evaluateNot(nots, match[1], controller);
    } else if (BOOLEANS.indexOf(m) > -1) {
        return m === 'true';
    } else if (m in controller) {
        // setField(m);
        return getPropertyEval(controller, m);
    } else if (!isNaN(m)) {
        return parseInt(m);
    } else if ((match = STRING_REGEX.exec(m))) {
        return match[1];
    } else {
        return m;
    }
}

const processExpression = (expression: any, controller: IKeyValue): () => boolean | undefined => {
    let match;
    if (!(expression instanceof Array)) {
        expression = [expression];
    }
    if (expression.length === 1 && (match = getRegexMatchArray(EQUALITY_REGEX, <string>expression[0]))) {
        const left = getValue(match[0], controller);
        const right = getValue(match[2], controller);
        const operation = match[1];
        if (typeof left === 'function' && !right && !operation) {
            expression[0] = left;
        } else {
            expression[0] = getOperation(match[1], left, right);
        }
    }

    while (expression.length > 1 || typeof expression[0] !== 'function') {
        let index = -1;
        let leftIndex = 0;
        let rightIndex = 0;
        let left: () => boolean | undefined;
        let right: () => boolean | undefined;

        let subExpression = expression;
        const indexLeftParenthesis = expression.lastIndexOf('(');
        if (indexLeftParenthesis > -1) {
            subExpression = subExpression.slice(indexLeftParenthesis + 1, subExpression.length);
            const indexRightParenthesis = subExpression.indexOf(')');
            subExpression = subExpression.slice(0, indexRightParenthesis);
            const expressionLength = subExpression.length;
            expression[indexLeftParenthesis] = processExpression(subExpression, controller);
            expression.splice(indexLeftParenthesis + 1, expressionLength + 1);

            continue;
        }


        if ((index = expression.indexOf('&&')) > -1 && 
            (expression[leftIndex = index - 1] !== ')') &&
            (expression[rightIndex = index + 1] !== '(')) {
            left = processExpression(expression[leftIndex], controller);
            right = processExpression(expression[rightIndex], controller);
            expression[leftIndex] = getOperation('&&', <() => boolean>left, <() => boolean>right);
            expression.splice(index, 2);

            continue;
        } else if ((index = expression.indexOf('||')) > -1 &&
            (expression[leftIndex = index - 1] !== ')') &&
            (expression[rightIndex = index + 1] !== '(')) {
            // leftIndex = index - 1;
            // rightIndex = index + 1;
            left = processExpression(expression[leftIndex], controller);
            right = processExpression(expression[rightIndex], controller);
            expression[leftIndex] = getOperation('||', <() => boolean>left, <() => boolean>right);
            expression.splice(index, 2);

            continue;
        }

        break;
    }

    if (expression.length === 1) {
        return expression[0];
    };

    return () => false;
}

const buildEvaluator = (expression: string, controller: IKeyValue) => {
    debugger;
    const match = matchExpression(expression) || [];
    return processExpression(match, controller);
}

export default class {
    private _evaluator: () => boolean;

    public get fields(): string[] {
        return [];
    }

    constructor (private _expression: string, private _controller: IKeyValue) {
        
    }
    
    public evaluate() {
        if (!this._evaluator) {
            this._evaluator = <() => boolean>buildEvaluator(this._expression, this._controller);
        }

        return this._evaluator();
    }
}


// export class Goat {

//     get fields() {
//         return this._fields;
//     }

//     constructor(expression, controller) {
//         this._expression = expression;
//         this._controller = controller;
//     }

//     _getRegexMatchArray(regex, input) {
//         let match = regex.exec(input);
//         if (!match) return;
//         match = match.filter(m => m !== undefined);
//         match.shift();
//         return match;
//     }

//     _evaluateNot(nots, value) {
//         let evaluate;
//         nots.shift();
//         if (nots.length) {
//             evaluate = this._evaluateNot(nots, value);
//         }

//         return this._getOperation('!', evaluate || this._getValue(value));
//     }

//     _setField(field) {
//         if (!this._fields) {
//             this._fields = [];
//         }
//         if (typeof field === 'string') {
//             this.fields.push(field);
//         }
//     }

//     _getValue(m) {
//         let match;
//         if ((match = this._getRegexMatchArray(NOT_REGEX, m))) {
//             const nots = match[0].split('');
//             return this._evaluateNot(nots, match[1]);
//         } else if (BOOLEANS.indexOf(m) > -1) {
//             return m === 'true';
//         } else if (m in this._controller) {
//             this._setField(m);
//             return this._getPropertyEval(this._controller, m);
//         } else if (!isNaN(m)) {
//             return parseInt(m);
//         } else if ((match = STRING_REGEX.exec(m))) {
//             return match[1];
//         } else {
//             return m;
//         }
//     }

//     _getPropertyEval(obj, prop) {
//         return () => obj[prop];
//     }

//     _asFunction(val) {
//         if (typeof val === 'function') {
//             return val();
//         } else {
//             return val;
//         }
//     }

//     _getOperation(operation, left, right) {
//         switch (operation) {
//             case '==':
//                 return () => this._asFunction(left) == this._asFunction(right);
//             case '!=':
//                 return () => this._asFunction(left) != this._asFunction(right);
//             case '===':
//                 return () => this._asFunction(left) === this._asFunction(right);
//             case '!==':
//                 return () => this._asFunction(left) !== this._asFunction(right);
//             case '<=':
//             case '=<':
//                 return () => this._asFunction(left) <= this._asFunction(right);
//             case '>=':
//             case '=<':
//                 return () => this._asFunction(left) >= this._asFunction(right);
//             case '<':
//                 return () => this._asFunction(left) < this._asFunction(right);
//             case '>':
//                 return () => this._asFunction(left) > this._asFunction(right);
//             case '!':
//                 return () => !this._asFunction(left);
//             case '&&':
//                 return () => this._asFunction(left) && this._asFunction(right);
//             case '||':
//                 return () => this._asFunction(left) || this._asFunction(right);
//         }
//     }

//     _processExpression(expression) {
//         let match;
//         if (!(expression instanceof Array)) {
//             expression = [expression];
//         }
//         if (expression.length === 1 && (match = this._getRegexMatchArray(EQUALITY_REGEX, expression[0]))) {
//             const left = this._getValue(match[0]);
//             const right = this._getValue(match[2]);
//             const operation = match[1];
//             if (typeof left === 'function' && !right && !operation) {
//                 expression[0] = left;
//             } else {
//                 expression[0] = this._getOperation(match[1], left, right);
//             }
//         }

//         while (expression.length > 1 || typeof expression[0] !== 'function') {
//             let index = -1;
//             let leftIndex = 0;
//             let rightIndex = 0;
//             let left;
//             let right;

//             let subExpression = expression;
//             const indexLeftParenthesis = expression.lastIndexOf('(');
//             if (indexLeftParenthesis > -1) {
//                 subExpression = subExpression.slice(indexLeftParenthesis + 1, subExpression.length);
//                 const indexRightParenthesis = subExpression.indexOf(')');
//                 subExpression = subExpression.slice(0, indexRightParenthesis);
//                 const expressionLength = subExpression.length;
//                 expression[indexLeftParenthesis] = this._processExpression(subExpression);
//                 expression.splice(indexLeftParenthesis + 1, expressionLength + 1);

//                 continue;
//             }


//             if ((index = expression.indexOf('&&')) > -1 && 
//                 (expression[leftIndex = index - 1] !== ')') &&
//                 (expression[rightIndex = index + 1] !== '(')) {
//                 // leftIndex = index - 1;
//                 // rightIndex = index + 1;
//                 left = this._processExpression(expression[leftIndex]);
//                 right = this._processExpression(expression[rightIndex]);
//                 expression[leftIndex] = this._getOperation('&&', left, right);
//                 expression.splice(index, 2);

//                 continue;
//             } else if ((index = expression.indexOf('||')) > -1 &&
//                 (expression[leftIndex = index - 1] !== ')') &&
//                 (expression[rightIndex = index + 1] !== '(')) {
//                 // leftIndex = index - 1;
//                 // rightIndex = index + 1;
//                 left = this._processExpression(expression[leftIndex]);
//                 right = this._processExpression(expression[rightIndex]);
//                 expression[leftIndex] = this._getOperation('||', left, right);
//                 expression.splice(index, 2);

//                 continue;
//             }

//             break;
//         }

//         if (expression.length === 1) {
//             return expression[0];
//         }
//     }

//     _buildEvaluator() {
//         const expression = this._expression.match(EXPRESSION_REGEX);
//         EXPRESSION_REGEX.lastIndex = 0;
//         return this._processExpression(expression);
//     }

//     evaluate() {
//         if (!this._evaluator) {
//             this._evaluator = this._buildEvaluator();
//         }

//         return this._evaluator();
//     }
// }