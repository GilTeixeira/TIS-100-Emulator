const assert = require("assert")
const toAstVisitor = require("./visitor").toAst


let inputText = "SELECT column1, column2 FROM table2 WHERE column2 > 3"

let astFromVisitor = toAstVisitor(inputText)

console.log(JSON.stringify(astFromVisitor, null, "\t"))
