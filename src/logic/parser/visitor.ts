import { lex } from './lexer'
import { parser } from './serialized_parser'

// The base visitor class can be accessed via the a parser instance.
const BaseVisitor = parser.getBaseCstVisitorConstructor()

class AstVisitor extends BaseVisitor {
  constructor() {
    super()
    this.validateVisitor()
  }

  program(ctx) {
    if (!ctx.line) return []

    const lines = ctx.line.map(line => this.visit(line))
    return lines
  }

  line(ctx) {
    const label = this.visit(ctx.label) || {}

    let instruction = this.visit(ctx.instruction) || {}
    const line = (label.line || instruction.line) - 1
    delete instruction.line

    return {
      type: 'LINE',
      label: label.name,
      instruction: instruction,
      line: line
    }
  }

  label(ctx) {
    return {
      name: ctx.Identifier[0].image.toUpperCase(),
      line: ctx.Identifier[0].startLine
    }
  }

  instruction(ctx) {
    if (ctx.nullOp) return this.visit(ctx.nullOp)
    else if (ctx.unaryOp) return this.visit(ctx.unaryOp)
    else if (ctx.binaryOp) return this.visit(ctx.binaryOp)
    else if (ctx.jumpOp) return this.visit(ctx.jumpOp)
  }

  nullOp(ctx) {
    const op = ctx.Nop || ctx.Swp || ctx.Sav || ctx.Neg

    return {
      operator: op[0].image.toUpperCase(),
      line: op[0].startLine
    }
  }

  unaryOp(ctx) {
    const op = ctx.Sub || ctx.Add
    const operand = this.visit(ctx.operand)

    return {
      operator: op[0].image.toUpperCase(),
      lhs: operand,
      line: op[0].startLine
    }
  }

  binaryOp(ctx) {
    const op = ctx.Mov
    const lhs = this.visit(ctx.lhs)
    const rhs = this.visit(ctx.rhs)

    return {
      operator: op[0].image.toUpperCase(),
      lhs: lhs,
      rhs: rhs,
      line: op[0].startLine
    }
  }

  jumpOp(ctx) {
    const operator = this.visit(ctx.jumpOps)

    return {
      operator: operator,
      lhs: ctx.Identifier[0].image.toUpperCase(),
      line: ctx.Identifier[0].startLine
    }
  }

  operand(ctx) {
    if (ctx.Integer)
      return {
        type: 'Integer',
        value: parseInt(ctx.Integer[0].image)
      }
    else if (ctx.register) return this.visit(ctx.register)
    else if (ctx.port) return this.visit(ctx.port)
  }

  port(ctx) {
    const port =
      ctx.Left || ctx.Right || ctx.Up || ctx.Down || ctx.Any || ctx.Last

    return {
      type: 'Port',
      value: port[0].image.toUpperCase()
    }
  }

  register(ctx) {
    const reg = ctx.Nil || ctx.Acc

    return {
      type: 'Register',
      value: reg[0].image.toUpperCase()
    }
  }

  jumpOps(ctx) {
    const jump = ctx.Jmp || ctx.Jez || ctx.Jnz || ctx.Jgz || ctx.Jlz || ctx.Jro
    return jump[0].image.toUpperCase()
  }
}

// Our visitor has no state, so a single instance is sufficient.
const toAstVisitorInstance = new AstVisitor()

function toAst(inputText) {
  // Lex
  const lexResult = lex(inputText)
  parser.input = lexResult.tokens

  // Automatic CST created when parsing
  const cst = parser.program()
  if (parser.errors.length > 0) {
    throw parser.errors[0]
  }

  // Visit
  const ast = toAstVisitorInstance.visit(cst)
  return ast
}

export { toAst }
