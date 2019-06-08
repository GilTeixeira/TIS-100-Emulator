// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step1_lexing.md

// Tutorial Step 1:
// Implementation of A lexer for a simple SELECT statement grammar

import { Lexer, createToken } from "chevrotain";


// the vocabulary will be exported and used in the Parser definition.
let tokenVocabulary: any = {}

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadata

const Integer = createToken({
    name: "Number",
    pattern: /(0|-?([1-9][0-9][0-9]|[1-9][0-9]|[1-9]))/
})

const Acc = createToken({
    name: "Acc",
    pattern: /Acc/i
})

const Bak = createToken({
    name: "Bak",
    pattern: /Bak/i
})

const Nil = createToken({
    name: "Nil",
    pattern: /Nil/i
})

const Left = createToken({
    name: "Left",
    pattern: /Left/i
})

const Right = createToken({
    name: "Right",
    pattern: /Right/i
})

const Up = createToken({
    name: "Up",
    pattern: /Up/i
})

const Down = createToken({
    name: "Down",
    pattern: /Down/i
})

const Any = createToken({
    name: "Any",
    pattern: /Any/i
})

const Last = createToken({
    name: "Last",
    pattern: /Last/i
})

const Comment = createToken({
    name: "Comment",
    pattern: /#.*/
})

const Label = createToken({
    name: "Label",
    pattern: /[A-Za-z0-9\-\_]+:/
})

const Nop = createToken({
    name: "Nop",
    pattern: /Nop/i
})

const Mov = createToken({
    name: "Mov",
    pattern: /Mov/i
})

const Swp = createToken({
    name: "Swp",
    pattern: /Swp/i
})

const Sav = createToken({
    name: "Sav",
    pattern: /Sav/i
})

const Add = createToken({
    name: "Add",
    pattern: /Add/i
})

const Sub = createToken({
    name: "Sub",
    pattern: /Sub/i
})

const Neg = createToken({
    name: "Neg",
    pattern: /Neg/i
})

const Jmp = createToken({
    name: "Jmp",
    pattern: /Jmp/i
})

const Jez = createToken({
    name: "Jez",
    pattern: /Jez/i
})

const Jnz = createToken({
    name: "Jnz",
    pattern: /Jnz/i
})

const Jgz = createToken({
    name: "Jgz",
    pattern: /Jgz/i
})

const Jlz = createToken({
    name: "Jlz",
    pattern: /Jlz/i
})

const Jro = createToken({
    name: "Jro",
    pattern: /Jro/i
})

const Comma = createToken({
    name: "Comma",
    pattern: /,/,
    group: Lexer.SKIPPED
})

const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED
})

// The order of tokens is important
const allTokens = [
    WhiteSpace,
    Acc,
    Bak,
    Nil,
    Left,
    Right,
    Up,
    Down,
    Any,
    Last,
    Nop,
    Mov,
    Swp,
    Sav,
    Add,
    Sub,
    Neg,
    Jmp,
    Jez,
    Jnz,
    Jgz,
    Jlz,
    Jro,
    Label,
    Comment,
    Comma,
    Integer
]

const SelectLexer = new Lexer(allTokens)

allTokens.forEach(tokenType => {
    tokenVocabulary[tokenType.name] = tokenType
})
/*
export { tokenVocabulary

    lex : function (inputText) {
        const lexingResult = SelectLexer.tokenize(inputText)

        if (lexingResult.errors.length > 0) {
            throw Error("Sad Sad Panda, lexing errors detected")
        }

        return lexingResult
    }
}
*/

function lex(inputText) {
    const lexingResult = SelectLexer.tokenize(inputText)

    if (lexingResult.errors.length > 0) {
        throw Error("Sad Sad Panda, lexing errors detected")
    }

    return lexingResult
}

export {
    tokenVocabulary,
    lex
}