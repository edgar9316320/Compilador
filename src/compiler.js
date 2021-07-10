const { lexer } = require('./lexer');
const parser = require('./parser');
const interpreter = require('./interpreter');

module.exports = function compiler(sourceCode) {
// 1. "Tokenizar" la entrada
  const lexerResult = lexer.tokenize(`${sourceCode}`);

  // 2. "Parsear" el vector de tokens
  parser.input = lexerResult.tokens;
  const cst = parser.program();

  if (parser.errors.length > 0) {
    return {
      cst,
      lexErrors: lexerResult.errors,
      parseErrors: parser.errors,
    };
  }

  // 3. Ejecutar analisis semantico usando CstVisitor.
  const value = interpreter.visit(cst);

  return {
    cst,
    lexErrors: lexerResult.errors,
    parseErrors: parser.errors,
    jsCode: value,
  };
};
