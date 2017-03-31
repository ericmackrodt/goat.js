/* Constants
----------------------------------------------------------------*/

const EQUALITY_REGEX = /^\s*([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\\=)]+)?\s*$/;
const STRING_REGEX = /^['"](.*)['"]$/;
const NOT_REGEX = /^\s*([!]+)\s*(\w+)\s*$/;
const LOGICAL_OPERATORS = ['&&', '||'];
const RELATIONAL_OPERATORS = ['==', '!=', '===', '!==', '!', '>=', '<=', '>', '<'];

/* Types
----------------------------------------------------------------*/

type Evaluator = () => boolean;
type Operatee = string | Evaluator;
type Expression = RegExpMatchArray | Array<Operatee>;

export interface IKeyValue<T> {
    [key: string]: T;
}

export interface IKeyFunction extends IKeyValue<() => boolean> {
}

/* Cache Variables
----------------------------------------------------------------*/

const fieldsCache: IKeyValue<string[]> = {};

/* Support Functions
----------------------------------------------------------------*/

const isBoolean = (value: string) => ['true', 'false'].indexOf(value) > -1;
const isFunction = (o: any) => typeof o === 'function';
const includes = <T>(o: T[], value: T) => o.indexOf(value) > -1;
const getMiddleItem = (expression: Expression) => expression[Math.round((expression.length - 1) / 2)];

const matchExpression = (expression: string) => 
    expression.match(/([&|]{2})|([\(\)])|([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\)]+)?/g);

const asFunction = (val: any) => isFunction(val) ? val() : val;

const setFirstInExpression = (expression: Expression, value: Operatee) => (expression as Array<Operatee>)[0] = value;
const getFirstInExpression = <T extends Operatee>(expression: Expression) => <T>(expression as Array<Operatee>)[0];

const getRegexMatchArray = (regex: RegExp, input: string) => {
    let match: string[] = regex.exec(input) || [];
    if (match.length === 0) return;
    match = match.filter(m => m !== undefined);
    match.shift();
    return match;
};

const throwError = (...msg: string[]) => { throw new Error(msg.join('')); };
const throwInvalidOperationError = (operator: string) => throwError(`Operator ${operator} is not valid`);

const getOperation = (operation: string, left: Operatee, right?: Operatee) => (<IKeyFunction>{
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
    let evaluate: Operatee;
    nots.shift();
    if (nots.length) {
        evaluate = evaluateNot(nots, value, controller, parserToken);
    }

    return () => !asFunction(evaluate || getValue(value, controller, parserToken));
};

const getPropertyEval = (obj: IKeyValue<any>, prop: string) => (() => obj[prop]);

const setField = (field: string, parserToken: string) => {
    let cache = fieldsCache[parserToken];
    if (!cache) {
        cache = fieldsCache[parserToken] = [];
    }
    cache.push(field);
};

const untilTruthy = (...fns: Function[]) => fns.every((fn) => !fn());

/* Processing Functions
----------------------------------------------------------------*/

const getValue = (m: any, controller: IKeyValue<any>, parserToken: string): any => {
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
        return match[1];
    } else {
        return m;
    }
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
        if (!result) throwInvalidOperationError(operation);
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
        const left = getValue(match[0], controller, parserToken);
        const right = getValue(match[2], controller, parserToken);
        const operation = match[1];
        if (isFunction(left) && !right && !operation) {
            operatorFunc = left as () => boolean;
        } else {
            operatorFunc = getOperation(match[1], left, right);
        }

        if (!operatorFunc) throwInvalidOperationError(match[1]);

        setFirstInExpression(expression, operatorFunc);

        return operatorFunc;
    }
};

const processExpression = (expression: Expression, controller: IKeyValue<any>, parserToken: string): Expression => {
    if (!(expression instanceof Array)) {
        expression = [expression];
    }

    if (expression.length === 3 && !includes(LOGICAL_OPERATORS, getMiddleItem(expression))) {
        throwError(`Invalid logical operator [${<string>getMiddleItem(expression)}]`);
    }

    untilTruthy(
        () => processEquality(expression, controller, parserToken),
        () => processExplicitPrecedence(expression, controller, parserToken),
        () => processLogicalOperation('&&', expression, controller, parserToken),
        () => processLogicalOperation('||', expression, controller, parserToken)
    );

    if (expression.length > 1 || !isFunction(expression[0])) {
        return processExpression(expression, controller, parserToken);
    } else {
        return expression;
    }
};

/* Exported Functions
----------------------------------------------------------------*/

export const getFields = (token: string) => fieldsCache[token];
export const deleteFromCache = (token: string) => delete fieldsCache[token];

export const generateRandomKey = () => Math.floor((1 + Math.random()) * 0x100000000000000).toString(16).substring(1);

export const buildEvaluator = (expression: string, controller: IKeyValue<any>, parserToken: string): Evaluator => {
    const match = matchExpression(expression) || [];
    
    if (match.length % 2 === 0) {
        throwError(`Invalid expression [${expression}]`);
    }

    const result = processExpression(match, controller, parserToken);

    const evaluator = getFirstInExpression<Evaluator>(result);
    if (result.length === 1 && isFunction(evaluator)) {
        return evaluator;
    };
};