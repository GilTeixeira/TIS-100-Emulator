import { Lexer as ChevLexer, createToken } from 'chevrotain'

// the vocabulary will be exported and used in the Parser definition.
let tokenVocabulary: any = {}

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadata
const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z]\w*/
})

const Integer = createToken({
  name: 'Integer',
  pattern: /(0|-?([1-9][0-9][0-9]|[1-9][0-9]|[1-9]))/
})

const Acc = createToken({
  name: 'Acc',
  pattern: /Acc/i,
  longer_alt: Identifier
})

const Nil = createToken({
  name: 'Nil',
  pattern: /Nil/i,
  longer_alt: Identifier
})

const Left = createToken({
  name: 'Left',
  pattern: /Left/i,
  longer_alt: Identifier
})

const Right = createToken({
  name: 'Right',
  pattern: /Right/i,
  longer_alt: Identifier
})

const Up = createToken({
  name: 'Up',
  pattern: /Up/i,
  longer_alt: Identifier
})

const Down = createToken({
  name: 'Down',
  pattern: /Down/i,
  longer_alt: Identifier
})

const Any = createToken({
  name: 'Any',
  pattern: /Any/i,
  longer_alt: Identifier
})

const Last = createToken({
  name: 'Last',
  pattern: /Last/i,
  longer_alt: Identifier
})

const Comment = createToken({
  name: 'Comment',
  pattern: /#.*/,
  group: ChevLexer.SKIPPED
})

const Nop = createToken({
  name: 'Nop',
  pattern: /Nop/i,
  longer_alt: Identifier
})

const Mov = createToken({
  name: 'Mov',
  pattern: /Mov/i,
  longer_alt: Identifier
})

const Swp = createToken({
  name: 'Swp',
  pattern: /Swp/i,
  longer_alt: Identifier
})

const Sav = createToken({
  name: 'Sav',
  pattern: /Sav/i,
  longer_alt: Identifier
})

const Add = createToken({
  name: 'Add',
  pattern: /Add/i,
  longer_alt: Identifier
})

const Sub = createToken({
  name: 'Sub',
  pattern: /Sub/i,
  longer_alt: Identifier
})

const Neg = createToken({
  name: 'Neg',
  pattern: /Neg/i,
  longer_alt: Identifier
})

const Jmp = createToken({
  name: 'Jmp',
  pattern: /Jmp/i,
  longer_alt: Identifier
})

const Jez = createToken({
  name: 'Jez',
  pattern: /Jez/i,
  longer_alt: Identifier
})

const Jnz = createToken({
  name: 'Jnz',
  pattern: /Jnz/i,
  longer_alt: Identifier
})

const Jgz = createToken({
  name: 'Jgz',
  pattern: /Jgz/i,
  longer_alt: Identifier
})

const Jlz = createToken({
  name: 'Jlz',
  pattern: /Jlz/i,
  longer_alt: Identifier
})

const Jro = createToken({
  name: 'Jro',
  pattern: /Jro/i,
  longer_alt: Identifier
})

const Comma = createToken({
  name: 'Comma',
  pattern: /,/,
  group: ChevLexer.SKIPPED
})

const Colon = createToken({
  name: 'Colon',
  pattern: /:/
})

const Newline = createToken({
  name: 'Newline',
  pattern: /(\r\n|\r|\n)/
})

const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t]/,
  group: ChevLexer.SKIPPED
})

// The order of tokens is important
const allTokens = [
  WhiteSpace,
  Acc,
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
  Comment,
  Comma,
  Newline,
  Colon,
  Integer,
  Identifier //  the Identifier Token must appear after ALL the Keyword Tokens
]

const lexer = new ChevLexer(allTokens)

allTokens.forEach(tokenType => {
  tokenVocabulary[tokenType.name] = tokenType
})

function lex(inputText) {
  const lexingResult = lexer.tokenize(inputText)

  if (lexingResult.errors.length > 0) {
    throw Error('Lexing errors detected')
  }
  return lexingResult
}

export { tokenVocabulary, lexer, lex }
