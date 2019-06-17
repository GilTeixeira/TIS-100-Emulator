import { Parser } from './parser'
import { lex, tokenVocabulary } from './lexer'

class SerializedParser extends Parser {
  constructor(serializedGrammar) {
    // Invoke super constructor with serialized grammar in parser config.
    // Passing in serialized grammar without passing it into the parser
    // would cause parser to always use a stale grammar.
    super(tokenVocabulary, { serializedGrammar: serializedGrammar })

    // this.performSelfAnalysis calls will be ignored as well.
    this.performSelfAnalysis()
  }
}

const serializedGrammar = require('./grammar.json')

const parser = new SerializedParser(serializedGrammar)

function parse(text) {
  const lexingResult = lex(text)

  // "input" is a setter which will reset the parser's state.
  parser.input = lexingResult.tokens
  parser.program()

  if (parser.errors.length > 0) {
    throw new Error(parser.errors[0].message)
  }
}

export { parser, parse }
