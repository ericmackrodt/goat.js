import { generateRandomKey, buildEvaluator, getFields, deleteFromCache } from './evaluation.builder';

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
            this._fields = getFields(this._parserToken);
            deleteFromCache(this._parserToken);
        }

        return this._evaluator();
    }
}