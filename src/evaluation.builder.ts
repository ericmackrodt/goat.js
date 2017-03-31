/* Constants
----------------------------------------------------------------*/

const EQUALITY_REGEX = /^\s*([!\w\.]+)\s*$|^\s*([!\w\.]+)\s*([^'"\w\s|&]{1,3})\s*([^\sˆ&|\\=)]+)\s*$/;
const STRING_REGEX = /^['"](.*)['"]$/;
const NOT_REGEX = /^\s*([!]+)\s*(\w+)\s*$/;
const LOGICAL_OPERATORS = ['&&', '||'];
const RELATIONAL_OPERATORS = ['==', '!=', '===', '!==', '!', '>=', '<=', '>', '<'];

/* Types
----------------------------------------------------------------*/

type Evaluator = () => boolean;
type Operand = string | Evaluator;
type Expression = RegExpMatchArray | Array<Operand>;

export interface IKeyValue<T> {
    [key: string]: T;
}

export interface IKeyFunction extends IKeyValue<() => boolean> {
}

export interface IExpressionCache { 
    fields?: string[];
    expression: string;
}

/* Cache Variables
----------------------------------------------------------------*/

const expressionCache: IKeyValue<IExpressionCache> = {};

/* Support Functions
----------------------------------------------------------------*/

const isBoolean = (value: string) => ['true', 'false'].indexOf(value) > -1;
const isFunction = (o: any) => typeof o === 'function';
const includes = <T>(o: T[], value: T) => o.indexOf(value) > -1;
const getMiddleItem = (expression: Expression) => expression[Math.round((expression.length - 1) / 2)];

const matchExpression = (expression: string) => 
    expression.match(/([&|]{2})|([\(\)])|([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\)]+)?/g);

const asFunction = (val: any) => isFunction(val) ? val() : val;

const setFirstInExpression = (expression: Expression, value: Operand) => (expression as Array<Operand>)[0] = value;
const getFirstInExpression = <T extends Operand>(expression: Expression) => <T>(expression as Array<Operand>)[0];

const getRegexMatchArray = (regex: RegExp, input: string) => {
    let match: string[] = regex.exec(input) || [];
    if (match.length === 0) return;
    match = match.filter(m => m !== undefined);
    match.shift();
    return match;
};

const getExpression = (token: string) => expressionCache[token].expression;

const throwError = (...msg: string[]) => { throw new Error(msg.join('')); };
const throwInvalidOperationError = (operator: string, token: string) => throwError(`Operator [${operator}] is not valid in expression [${getExpression(token)}]`);
const throwInvalidExpressionError = (token: string) => throwError(`Invalid expression [${getExpression(token)}]`);

const getOperation = (operation: string, left: Operand, right?: Operand) => (<IKeyFunction>{
    '==': () => asFunction(left) == asFunction(right),
    '!=': () => asFunction(left) != asFunction(right),
    '===': () => asFunction(left) === asFunction(right),
    '!==': () => asFunction(left) !== asFunction(right),
    '<=': () => asFunction(left) <= asFunction(right),
    '>=': () => asFunction(left) >= asFunction(right),
    '<': () => asFunction(left) < asFunction(right),
    '>': () => asFunction(left) > asFunction(right),
    '&&': () => asFunction(left) && asFunction(right),
    '||': () => asFunction(left) || asFunction(right)
})[operation];

const evaluateNot = (nots: string[], value: string, controller: IKeyValue<any>, parserToken: string) => {
    let evaluate: Operand;
    nots.shift();
    if (nots.length) {
        evaluate = evaluateNot(nots, value, controller, parserToken);
    }

    const operand = processOperand(value, controller, parserToken);
    return () => !asFunction(evaluate || operand);
};

const getPropertyEval = (obj: IKeyValue<any>, prop: string) => (() => obj[prop]);

const setField = (field: string, parserToken: string) => {
    let cache = expressionCache[parserToken].fields;
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
const untilTruthy = (...fns: Function[]) => !fns.every((fn) => !fn());

/* Processing Functions
----------------------------------------------------------------*/

const processOperand = (m: any, controller: IKeyValue<any>, parserToken: string): any => {
    let match;
    if ((match = getRegexMatchArray(NOT_REGEX, m))) {
        const nots = match[0].split('');
        return evaluateNot(nots, match[1], controller, parserToken);
    } else if (isBoolean(m)) {
        return m === 'true';
    } else if (m in controller) {
        setField(m, parserToken);
        return getPropertyEval(controller, m);
    } else if (!isNaN(m)) {
        return parseInt(m);
    } else if ((match = STRING_REGEX.exec(m))) {
        return getMiddleItem(match);
    }
    
    throwInvalidExpressionError(parserToken);
};

const processLogicalOperation = (operation: string, expression: any, controller: IKeyValue<any>, parserToken: string) => {
    let index = -1;
    let leftIndex = 0;
    let rightIndex = 0;
    if ((index = expression.indexOf(operation)) > -1 && 
        (expression[leftIndex = index - 1] !== ')') &&
        (expression[rightIndex = index + 1] !== '(')) {
        let left = processExpression(expression[leftIndex], controller, parserToken);
        let right = processExpression(expression[rightIndex], controller, parserToken);
        const result = getOperation(operation, getFirstInExpression(left), getFirstInExpression(right));
        expression[leftIndex] = result;
        expression.splice(index, 2);

        return result;
    }
};

const processExplicitPrecedence = (expression: any, controller: IKeyValue<any>, parserToken: string) => {
    let subExpression = expression;
    const indexLeftParenthesis = expression.lastIndexOf('(');
    if (indexLeftParenthesis > -1) {
        subExpression = subExpression.slice(indexLeftParenthesis + 1, subExpression.length);
        const indexRightParenthesis = subExpression.indexOf(')');
        subExpression = subExpression.slice(0, indexRightParenthesis);
        const expressionLength = subExpression.length;
        const result = processExpression(subExpression, controller, parserToken);
        expression[indexLeftParenthesis] = result;
        expression.splice(indexLeftParenthesis + 1, expressionLength + 1);
        return result;
    }
};

const processEquality = (expression: Expression, controller: IKeyValue<any>, parserToken: string) => {
    let match: RegExpMatchArray;
    let operatorFunc: Evaluator;
    if (expression.length === 1 && (match = getRegexMatchArray(EQUALITY_REGEX, getFirstInExpression<string>(expression)))) {
        const left = processOperand(match[0], controller, parserToken);
        let right = match[2];
        if (right) {
            right = processOperand(match[2], controller, parserToken);
        }

        const operation = match[1];
        if (isFunction(left) && !right && !operation) {
            operatorFunc = left as () => boolean;
        } else {
            operatorFunc = getOperation(match[1], left, right);
        }

        if (!operatorFunc) throwInvalidOperationError(match[1], parserToken);

        setFirstInExpression(expression, operatorFunc);

        return operatorFunc;
    }
};

const processExpression = (expression: Expression, controller: IKeyValue<any>, parserToken: string): Expression => {
    if (!(expression instanceof Array)) {
        expression = [expression];
    }

    if (expression.length === 3 && !includes(LOGICAL_OPERATORS, getMiddleItem(expression))) {
        throwError(`Invalid logical operator [${<string>getMiddleItem(expression)}] in expression [${getExpression(parserToken)}]`);
    }

    if (!untilTruthy(
        () => processEquality(expression, controller, parserToken),
        () => processExplicitPrecedence(expression, controller, parserToken),
        () => processLogicalOperation('&&', expression, controller, parserToken),
        () => processLogicalOperation('||', expression, controller, parserToken)
    ) && (expression.length % 2) === 1 && !isFunction(getFirstInExpression(expression))) {
        throwInvalidExpressionError(parserToken);
    }

    if (expression.length > 1 || !isFunction(getFirstInExpression(expression))) {
        return processExpression(expression, controller, parserToken);
    } else {
        return expression;
    }
};

/* Exported Functions
----------------------------------------------------------------*/

export const getFields = (token: string) => expressionCache[token].fields;
export const deleteFromCache = (token: string) => delete expressionCache[token];

export const generateRandomKey = () => Math.floor((1 + Math.random()) * 0x100000000000000).toString(16).substring(1);

export const buildEvaluator = (expression: string, controller: IKeyValue<any>, parserToken: string): Evaluator => {
    const match = matchExpression(expression) || [];

    expressionCache[parserToken] = { expression: expression };
    
    if (match.length % 2 === 0) {
        throwInvalidExpressionError(parserToken);
    }    

    const result = processExpression(match, controller, parserToken);

    return getFirstInExpression<Evaluator>(result);
};