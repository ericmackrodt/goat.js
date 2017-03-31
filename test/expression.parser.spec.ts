import ExpressionParser from './../src/expression.parser';
import * as chai from 'chai';

const should = chai.should();
const expect = chai.expect;

describe('ExpressionParser', () => {

    function executeValidExpressionTests(tests: { expression: string, obj: { [key: string]: any }, expect: boolean }[]) {
        tests.forEach((t, i) => {
            it(`should be [${t.expect}] when [${t.expression}]. (index: ${i})`, () => {
                const sut = new ExpressionParser(t.expression, t.obj);
                const result = sut.evaluate();
                result.should.be.equal(t.expect);
            });
        });
    }

    executeValidExpressionTests([
        { expression: 'prop === true', obj: { prop: true }, expect: true },
        { expression: 'prop === true', obj: { prop: false }, expect: false },
        { expression: 'prop === false', obj: { prop: false }, expect: true },
        { expression: 'prop === false', obj: { prop: true }, expect: false },
        { expression: 'prop === 1', obj: { prop: 1 }, expect: true },
        { expression: 'prop === 1', obj: { prop: 2 }, expect: false },
        { expression: 'prop === 2', obj: { prop: 2 }, expect: true },
        { expression: 'prop === 2', obj: { prop: 1 }, expect: false },
        { expression: 'prop === \'str\'', obj: { prop: 'str' }, expect: true },
        { expression: 'prop === \'str\'', obj: { prop: 'not' }, expect: false },

        { expression: 'prop !== false', obj: { prop: true }, expect: true },
        { expression: 'prop !== false', obj: { prop: false }, expect: false },
        { expression: 'prop !== true', obj: { prop: false }, expect: true },
        { expression: 'prop !== true', obj: { prop: true }, expect: false },
        { expression: 'prop !== 2', obj: { prop: 1 }, expect: true },
        { expression: 'prop !== 2', obj: { prop: 2 }, expect: false },
        { expression: 'prop !== 1', obj: { prop: 2 }, expect: true },
        { expression: 'prop !== 1', obj: { prop: 1 }, expect: false },
        { expression: 'prop !== \'str\'', obj: { prop: 'not' }, expect: true },
        { expression: 'prop !== \'str\'', obj: { prop: 'str' }, expect: false },

        { expression: 'prop == true', obj: { prop: 1 }, expect: true },
        { expression: 'prop == true', obj: { prop: 0 }, expect: false },
        { expression: 'prop == false', obj: { prop: 0 }, expect: true },
        { expression: 'prop == false', obj: { prop: 1 }, expect: false },
        { expression: 'prop == 1', obj: { prop: true }, expect: true },
        { expression: 'prop == 1', obj: { prop: false }, expect: false },
        { expression: 'prop == 0', obj: { prop: false }, expect: true },
        { expression: 'prop == 0', obj: { prop: true }, expect: false },
        { expression: 'prop == false', obj: { prop: '' }, expect: true },
        { expression: 'prop == true', obj: { prop: '' }, expect: false },
        { expression: 'prop == false', obj: { prop: 'str' }, expect: false },
        { expression: 'prop == \'\'', obj: { prop: false }, expect: true },
        { expression: 'prop == \'\'', obj: { prop: true }, expect: false },
        { expression: 'prop == \'str\'', obj: { prop: false }, expect: false },

        { expression: 'prop != true', obj: { prop: 1 }, expect: false },
        { expression: 'prop != true', obj: { prop: 0 }, expect: true },
        { expression: 'prop != false', obj: { prop: 0 }, expect: false },
        { expression: 'prop != false', obj: { prop: 1 }, expect: true },
        { expression: 'prop != 1', obj: { prop: true }, expect: false },
        { expression: 'prop != 1', obj: { prop: false }, expect: true },
        { expression: 'prop != 0', obj: { prop: false }, expect: false },
        { expression: 'prop != 0', obj: { prop: true }, expect: true },
        { expression: 'prop != false', obj: { prop: '' }, expect: false },
        { expression: 'prop != true', obj: { prop: '' }, expect: true },
        { expression: 'prop != false', obj: { prop: 'str' }, expect: true },
        { expression: 'prop != \'\'', obj: { prop: false }, expect: false },
        { expression: 'prop != \'\'', obj: { prop: true }, expect: true },
        { expression: 'prop != \'str\'', obj: { prop: false }, expect: true },

        { expression: 'prop > 1', obj: { prop: 2 }, expect: true },
        { expression: 'prop > 1', obj: { prop: 1 }, expect: false },
        { expression: 'prop > false', obj: { prop: true }, expect: true },
        { expression: 'prop > true', obj: { prop: false }, expect: false },
        { expression: 'prop > \'a\'', obj: { prop: 'b' }, expect: true },
        { expression: 'prop > \'b\'', obj: { prop: 'a' }, expect: false },
        { expression: 'prop > \'b\'', obj: { prop: 'b' }, expect: false },
        { expression: 'prop > \'a\'', obj: { prop: 'a' }, expect: false },

        { expression: 'prop < 1', obj: { prop: 2 }, expect: false },
        { expression: 'prop < 1', obj: { prop: 1 }, expect: false },
        { expression: 'prop < 1', obj: { prop: 0 }, expect: true },
        { expression: 'prop < false', obj: { prop: true }, expect: false },
        { expression: 'prop < true', obj: { prop: false }, expect: true },
        { expression: 'prop < \'a\'', obj: { prop: 'b' }, expect: false },
        { expression: 'prop < \'b\'', obj: { prop: 'a' }, expect: true },
        { expression: 'prop < \'a\'', obj: { prop: 'a' }, expect: false },
        { expression: 'prop < \'b\'', obj: { prop: 'b' }, expect: false },

        { expression: 'prop >= 1', obj: { prop: 2 }, expect: true },
        { expression: 'prop >= 1', obj: { prop: 1 }, expect: true },
        { expression: 'prop >= 1', obj: { prop: 0 }, expect: false },
        { expression: 'prop >= false', obj: { prop: true }, expect: true },
        { expression: 'prop >= true', obj: { prop: true }, expect: true },
        { expression: 'prop >= true', obj: { prop: false }, expect: false },
        { expression: 'prop >= \'a\'', obj: { prop: 'b' }, expect: true },
        { expression: 'prop >= \'b\'', obj: { prop: 'a' }, expect: false },
        { expression: 'prop >= \'b\'', obj: { prop: 'b' }, expect: true },
        { expression: 'prop >= \'a\'', obj: { prop: 'a' }, expect: true },

        { expression: 'prop <= 1', obj: { prop: 0 }, expect: true },
        { expression: 'prop <= 1', obj: { prop: 1 }, expect: true },
        { expression: 'prop <= 1', obj: { prop: 2 }, expect: false },
        { expression: 'prop <= true', obj: { prop: false }, expect: true },
        { expression: 'prop <= true', obj: { prop: true }, expect: true },
        { expression: 'prop <= false', obj: { prop: true }, expect: false },
        { expression: 'prop <= \'b\'', obj: { prop: 'a' }, expect: true },
        { expression: 'prop <= \'a\'', obj: { prop: 'b' }, expect: false },
        { expression: 'prop <= \'b\'', obj: { prop: 'b' }, expect: true },
        { expression: 'prop <= \'a\'', obj: { prop: 'a' }, expect: true },

        { expression: '!prop', obj: { prop: false }, expect: true },
        { expression: '!prop', obj: { prop: true }, expect: false },
        { expression: '!!prop', obj: { prop: false }, expect: false },
        { expression: '!!prop', obj: { prop: true }, expect: true },
        { expression: '!!!prop', obj: { prop: false }, expect: true },
        { expression: '!!!prop', obj: { prop: true }, expect: false },
        { expression: '!prop', obj: { prop: 0 }, expect: true },
        { expression: '!prop', obj: { prop: 1 }, expect: false },
        { expression: '!!prop', obj: { prop: 0 }, expect: false },
        { expression: '!!prop', obj: { prop: 1 }, expect: true },
        { expression: '!!!prop', obj: { prop: 0 }, expect: true },
        { expression: '!!!prop', obj: { prop: 1 }, expect: false },
        { expression: '!prop', obj: { prop: '' }, expect: true },
        { expression: '!prop', obj: { prop: 'str' }, expect: false },
        { expression: '!!prop', obj: { prop: '' }, expect: false },
        { expression: '!!prop', obj: { prop: 'str' }, expect: true },
        { expression: '!!!prop', obj: { prop: '' }, expect: true },
        { expression: '!!!prop', obj: { prop: 'str' }, expect: false },
        { expression: '!prop', obj: { prop: null }, expect: true },
        { expression: '!prop', obj: { prop: {} }, expect: false },
        { expression: '!!prop', obj: { prop: null }, expect: false },
        { expression: '!!prop', obj: { prop: {} }, expect: true },
        { expression: '!!!prop', obj: { prop: null }, expect: true },
        { expression: '!!!prop', obj: { prop: {} }, expect: false },

        { expression: 'prop1 === true && prop2 === true', obj: { prop1: true, prop2: true }, expect: true },
        { expression: 'prop1 === true && prop2 === false', obj: { prop1: true, prop2: true }, expect: false },
        { expression: 'prop1 === false && prop2 === true', obj: { prop1: true, prop2: true }, expect: false },
        { expression: 'prop1 === false && prop2 === false', obj: { prop1: false, prop2: false }, expect: true },
        { expression: 'prop1 === false && prop2 === true', obj: { prop1: false, prop2: false }, expect: false },
        { expression: 'prop1 === true && prop2 === false', obj: { prop1: false, prop2: false }, expect: false },

        { expression: 'prop1 === true || prop2 === true', obj: { prop1: true, prop2: true }, expect: true },
        { expression: 'prop1 === false || prop2 === true', obj: { prop1: true, prop2: true }, expect: true },
        { expression: 'prop1 === true || prop2 === false', obj: { prop1: true, prop2: true }, expect: true },
        { expression: 'prop1 === false || prop2 === false', obj: { prop1: true, prop2: true }, expect: false },
        { expression: 'prop1 === false || prop2 === false', obj: { prop1: false, prop2: false }, expect: true },
        { expression: 'prop1 === true || prop2 === false', obj: { prop1: false, prop2: false }, expect: true },
        { expression: 'prop1 === false || prop2 === true', obj: { prop1: false, prop2: false }, expect: true },
        { expression: 'prop1 === true || prop2 === true', obj: { prop1: false, prop2: false }, expect: false },

        { expression: 'prop1 === true && prop2 === true && prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === true && prop2 === true && prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 === true && prop2 === false && prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 === true && prop2 === false && prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 === false && prop2 === true && prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 === false && prop2 === true && prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 === false && prop2 === false && prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 === false && prop2 === false && prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },

        { expression: 'prop1 !== false && prop2 !== false && prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== false && prop2 !== false && prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 !== false && prop2 !== true && prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 !== false && prop2 !== true && prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 !== true && prop2 !== false && prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 !== true && prop2 !== false && prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 !== true && prop2 !== true && prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 !== true && prop2 !== true && prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },

        { expression: 'prop1 === true || prop2 === true || prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === true || prop2 === true || prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === true || prop2 === false || prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === true || prop2 === false || prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === false || prop2 === true || prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === false || prop2 === true || prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === false || prop2 === false || prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === false || prop2 === false || prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },

        { expression: 'prop1 !== false || prop2 !== false || prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== false || prop2 !== false || prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== false || prop2 !== true || prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== false || prop2 !== true || prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== true || prop2 !== false || prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== true || prop2 !== false || prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== true || prop2 !== true || prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== true || prop2 !== true || prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },

        { expression: 'prop1 === true && prop2 === true || prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === true && prop2 === true || prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === true && prop2 === false || prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === true && prop2 === false || prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 === false && prop2 === true || prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === false && prop2 === true || prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 === false && prop2 === false || prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === false && prop2 === false || prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },

        { expression: 'prop1 !== false && prop2 !== false || prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== false && prop2 !== false || prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== false && prop2 !== true || prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== false && prop2 !== true || prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 !== true && prop2 !== false || prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== true && prop2 !== false || prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 !== true && prop2 !== true || prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== true && prop2 !== true || prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },

        { expression: 'prop1 === true || prop2 === true && prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === true || prop2 === true && prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === true || prop2 === false && prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === true || prop2 === false && prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === false || prop2 === true && prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 === false || prop2 === true && prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 === false || prop2 === false && prop3 === true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 === false || prop2 === false && prop3 === false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },

        { expression: 'prop1 !== false || prop2 !== false && prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== false || prop2 !== false && prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== false || prop2 !== true && prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== false || prop2 !== true && prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== true || prop2 !== false && prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: true },
        { expression: 'prop1 !== true || prop2 !== false && prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 !== true || prop2 !== true && prop3 !== false', obj: { prop1: true, prop2: true, prop3: true }, expect: false },
        { expression: 'prop1 !== true || prop2 !== true && prop3 !== true', obj: { prop1: true, prop2: true, prop3: true }, expect: false },

        { expression: 'prop1 === false && (prop2 === true || prop3 === true)', obj: { prop1: true, prop2: true, prop3: true }, expect: false },

        { expression: 'prop1 === false && (prop2 === false || (prop2 === true || prop3 === false)) || prop5 === false', obj: { prop1: true, prop2: true, prop3: true, prop4: true, prop5: true }, expect: false }
    ]);

    it('should list properties when evaluating', () => {
        const controller = {
            prop1: true,
            prop2: false
        };
        const sut = new ExpressionParser('prop1 === true && prop2 === true', controller);
        const result = sut.evaluate();
        sut.fields.should.be.instanceOf(Array);
        sut.fields[0].should.equal('prop1');
        sut.fields[1].should.equal('prop2');
    });

    it('should throw on invalid comparison', () => {
        const sut = new ExpressionParser('prop => 1', { prop: 2 });
        expect(() => sut.evaluate()).to.throw('Operator [=>] is not valid in expression [prop => 1]');
    });

    it('should throw on invalid logical operator', () => {
        const sut = new ExpressionParser('prop === 1 |& prop2 === 2', { prop: 1, prop2: 2 });
        expect(() => sut.evaluate()).to.throw('Invalid logical operator [|&] in expression [prop === 1 |& prop2 === 2]');
    });

    it('should throw on invalid first operator with logical operators', () => {
        const sut = new ExpressionParser('prop === 1 |& prop2 === 2 || prop3 === 3', { prop: 1, prop2: 2, prop3: 3 });
        expect(() => sut.evaluate()).to.throw('Invalid logical operator [|&] in expression [prop === 1 |& prop2 === 2 || prop3 === 3]');
    });

    it('should throw on invalid second operator with logical operators', () => {
        const sut = new ExpressionParser('prop === 1 || prop2 === 2 |& prop3 === 3', { prop: 1, prop2: 2, prop3: 3 });
        expect(() => sut.evaluate()).to.throw('Invalid logical operator [|&] in expression [prop === 1 || prop2 === 2 |& prop3 === 3]');
    });

    it('should throw on invalid first operator with logical operators with precedence', () => {
        const sut = new ExpressionParser('(prop === 1 |& prop2 === 2) || prop3 === 3', { prop: 1, prop2: 2, prop3: 3 });
        expect(() => sut.evaluate()).to.throw('Invalid logical operator [|&] in expression [(prop === 1 |& prop2 === 2) || prop3 === 3]');
    });

    it('should throw on invalid second operator with logical operators with precedence', () => {
        const sut = new ExpressionParser('prop === 1 || (prop2 === 2 |& prop3 === 3)', { prop: 1, prop2: 2, prop3: 3 });
        expect(() => sut.evaluate()).to.throw('Invalid logical operator [|&] in expression [prop === 1 || (prop2 === 2 |& prop3 === 3)]');
    });

    it('should throw on multiple invalid logical operators with precedence on beginning', () => {
        const sut = new ExpressionParser('(prop === 1 |& prop2 === 2) |& prop3 === 3', { prop: 1, prop2: 2, prop3: 3 });
        expect(() => sut.evaluate()).to.throw('Invalid logical operator [|&] in expression [(prop === 1 |& prop2 === 2) |& prop3 === 3]');
    });

    it('should throw on multiple invalid logical operators with precedence on end', () => {
        const sut = new ExpressionParser('prop === 1 |& (prop2 === 2 |& prop3 === 3)', { prop: 1, prop2: 2, prop3: 3 });
        expect(() => sut.evaluate()).to.throw('Invalid logical operator [|&] in expression [prop === 1 |& (prop2 === 2 |& prop3 === 3)]');
    });

    function executeInvalidExpressionTests(tests: string[]) {
        tests.forEach((t, i) => {
            it(`should throw error when invalid expression [${t}]. (index: ${i})`, () => {
                const sut = new ExpressionParser(t, {});
                expect(() => sut.evaluate()).to.throw(`Invalid expression [${t}]`);
            });
        });
    }
    
    executeInvalidExpressionTests([
        '',
        'prop === 1 prop2 === 2',
        'prop1 === 1 prop',
        'prop1 false',
        'prop1 === 1,',
        'prop1, === 1',
        '&& prop1 === 1',
        'prop1 === 1 ||',
        'prop === 1 |& prop2 === 2 |& prop3 === 3',
        'prop === 1 |& prop2 === 2 |& prop3 === 3 |& prop4 === 4',
        'prop1 === false && (prop2 === true || prop3 === true',
        'prop1 === false && prop2 === true || prop3 === true)',
        '(prop1 === false && (prop2 === true || prop3 === true)',
        '(prop1 === false && (prop2 === true || prop3 === true)))',
        'prop1 === false && (prop2 === true | prop3 === true)',
        'prop1 === false & (prop2 === true || prop3 === true)',
        'prop1 false && (prop2 === true || prop3 === true)'
    ]);
});