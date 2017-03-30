const EQUALITY_REGEX = /^\s*([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\\=)]+)?\s*$/;
const EXPRESSION_REGEX = /([&|]{2})|([\(\)])|([!\w\.]+)\s*([^\w\s|&]{1,3})?\s*([^\sˆ&|\)]+)?/g;
const STRING_REGEX = /^['"](.*)['"]$/;
const NOT_REGEX = /^\s*([!]+)\s*(\w+)\s*$/;
const LOGICAL_OPERATORS = ['&&', '||'];
const RELATIONAL_OPERATORS = ['==', '!=', '===', '!==', '!', '>=', '<=', '>', '<'];

type Operatee = string | (() => boolean);

interface IKeyValue<T> {
    [key: string]: T;
}

interface IKeyFunction extends IKeyValue<() => boolean> {
}

const fieldsCache: IKeyValue<string[]> = {};

const isBoolean = (value: string) => ['true', 'false'].indexOf(value) > -1;

const generateRandomKey = () => Math.floor((1 + Math.random()) * 0x100000000000000).toString(16).substring(1);

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

const throwError = (...msg: string[]) => { throw new Error(msg.join('')); };

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


const processExpression = (expression: any, controller: IKeyValue<any>, parserToken: string): () => boolean => {
    let match;
    if (!(expression instanceof Array)) {
        expression = [expression];
    }
    if (expression.length === 1 && (match = getRegexMatchArray(EQUALITY_REGEX, <string>expression[0]))) {
        const left = getValue(match[0], controller, parserToken);
        const right = getValue(match[2], controller, parserToken);
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
        let left: () => boolean;
        let right: () => boolean;

        let subExpression = expression;
        const indexLeftParenthesis = expression.lastIndexOf('(');
        if (indexLeftParenthesis > -1) {
            subExpression = subExpression.slice(indexLeftParenthesis + 1, subExpression.length);
            const indexRightParenthesis = subExpression.indexOf(')');
            subExpression = subExpression.slice(0, indexRightParenthesis);
            const expressionLength = subExpression.length;
            expression[indexLeftParenthesis] = processExpression(subExpression, controller, parserToken);
            expression.splice(indexLeftParenthesis + 1, expressionLength + 1);

            continue;
        }

        if ((index = expression.indexOf('&&')) > -1 && 
            (expression[leftIndex = index - 1] !== ')') &&
            (expression[rightIndex = index + 1] !== '(')) {
            left = processExpression(expression[leftIndex], controller, parserToken);
            right = processExpression(expression[rightIndex], controller, parserToken);
            expression[leftIndex] = getOperation('&&', <() => boolean>left, <() => boolean>right);
            expression.splice(index, 2);

            continue;
        } else if ((index = expression.indexOf('||')) > -1 &&
            (expression[leftIndex = index - 1] !== ')') &&
            (expression[rightIndex = index + 1] !== '(')) {
            left = processExpression(expression[leftIndex], controller, parserToken);
            right = processExpression(expression[rightIndex], controller, parserToken);
            expression[leftIndex] = getOperation('||', <() => boolean>left, <() => boolean>right);
            expression.splice(index, 2);

            continue;
        }

        break;
    }

    if (expression.length === 1) {
        return expression[0];
    };
};

const buildEvaluator = (expression: string, controller: IKeyValue<any>, parserToken: string) => {
    const match = matchExpression(expression) || [];
    return processExpression(match, controller, parserToken);
};

/**
 * Expression parser class
 */
export default class {
    private _evaluator: () => boolean;
    private _fields: string[];
    private _parserToken: string;

    /**
     * Object fields that were used in the expression.
     */
    public get fields(): string[] {
        return this._fields;
    }

    /**
     * Creates new instance of the ExpressionParser.
     * @param _expression Expression to be parsed
     * @param _controller Object with fields that will be evaluated
     */
    constructor (private _expression: string, private _controller: { [key: string]: any }) {
        this._parserToken = generateRandomKey();
    }
    
    /**
     * Evaluates current instance of the Expression Parser and returns
     * a boolean value based on the expression that was passed in the constructor.
     */
    public evaluate() {
        if (!this._evaluator) {
            this._evaluator = buildEvaluator(this._expression, this._controller, this._parserToken);
            this._fields = fieldsCache[this._parserToken];
            delete fieldsCache[this._parserToken];
        }

        return this._evaluator();
    }
}