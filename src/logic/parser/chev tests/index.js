const chevrotain = require("chevrotain")
const Lexer = chevrotain.Lexer
const createToken = chevrotain.createToken
const CstParser = require("chevrotain").CstParser


const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ })
// We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
// See: https://github.com/SAP/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js
const Select = createToken({
    name: "Select",
    pattern: /SELECT/,
    longer_alt: Identifier
})
const From = createToken({
    name: "From",
    pattern: /FROM/,
    longer_alt: Identifier
})
const Where = createToken({
    name: "Where",
    pattern: /WHERE/,
    longer_alt: Identifier
})

const Comma = createToken({ name: "Comma", pattern: /,/ })

const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ })

const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ })

const LessThan = createToken({ name: "LessThan", pattern: /</ })

const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: chevrotain.Lexer.SKIPPED
})

const allTokens = [
    WhiteSpace,
    Select,
    From,
    Where,
    Comma,
    Identifier,
    Integer,
    GreaterThan,
    LessThan
]

let SelectLexer = new Lexer(allTokens)

class SelectParser extends CstParser {
    constructor() {
        super(allTokens)

        const $ = this

        $.RULE("selectStatement", () => {
            $.SUBRULE($.selectClause)
            $.SUBRULE($.fromClause)
            $.OPTION(() => {
                $.SUBRULE($.whereClause)
            })
        })

        $.RULE("selectClause", () => {
            $.CONSUME(Select)
            $.AT_LEAST_ONE_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME(Identifier)
                }
            })
        })

        $.RULE("fromClause", () => {
            $.CONSUME(From)
            $.CONSUME(Identifier)
        })

        $.RULE("whereClause", () => {
            $.CONSUME(Where)
            $.SUBRULE($.expression)
        })

        // The "rhs" and "lhs" (Right/Left Hand Side) labels will provide easy
        // to use names during CST Visitor (step 3a).
        $.RULE("expression", () => {
            $.SUBRULE($.atomicExpression, { LABEL: "lhs" })
            $.SUBRULE($.relationalOperator)
            $.SUBRULE2($.atomicExpression, { LABEL: "rhs" }) // note the '2' suffix to distinguish
            // from the 'SUBRULE(atomicExpression)'
            // 2 lines above.
        })

        $.RULE("atomicExpression", () => {
            $.OR([
                { ALT: () => $.CONSUME(Integer) },
                { ALT: () => $.CONSUME(Identifier) }
            ])
        })

        $.RULE("relationalOperator", () => {
            $.OR([
                { ALT: () => $.CONSUME(GreaterThan) },
                { ALT: () => $.CONSUME(LessThan) }
            ])
        })

        this.performSelfAnalysis()
    }
}



const parser = new SelectParser([])

function parseInput(text) {
    const lexingResult = SelectLexer.tokenize(text)
    // "input" is a setter which will reset the parser's state.
    parser.input = lexingResult.tokens
    parser.selectStatement()

    if (parser.errors.length > 0) {
        throw new Error("sad sad panda, Parsing errors detected")
    }
}

const inputText = "SELECT column1 FROM table2"
parseInput(inputText)
