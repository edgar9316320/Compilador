const chevrotain = require('chevrotain');

const { Lexer } = chevrotain;

// Definición de Tokens

const allTokens = [];

// Utility to avoid manually building the allTokens array
function createToken(options) {
  const newToken = chevrotain.createToken(options);
  allTokens.push(newToken);
  return newToken;
}

const AdditionOperator = createToken({ name: 'AdditionOperator', pattern: Lexer.NA });
const MultiplicationOperator = createToken({ name: 'MultiplicationOperator', pattern: Lexer.NA });
const RelationalOperator = createToken({ name: 'RelationalOperator', pattern: Lexer.NA });
const ID = chevrotain.createToken({ name: 'ID', pattern: /[a-zA-Z0-9]+/ });

const Tokens = {
  WhiteSpace: createToken({ name: 'WhiteSpace', pattern: /\s+/, group: Lexer.SKIPPED }),
  Comment: createToken({ name: 'Comment', pattern: /\/\*.*?\*\//, group: Lexer.SKIPPED }),
  Then: createToken({ name: 'Then', pattern: /([?])/ }),
  Ternary: createToken({ name: 'Ternary', pattern: /ternario/ }),
  If: createToken({ name: 'If', pattern: /si/, longer_alt: ID }),
  Else: createToken({ name: 'Else', pattern: /contrario|:/ }),
  While: createToken({ name: 'While', pattern: /mientras/ }),
  Print: createToken({ name: 'Print', pattern: /mostrar/ }),
  Do: createToken({ name: 'Do', pattern: /hacer/ }),
  LCurly: createToken({ name: 'LCurly', pattern: /{/ }),
  RCurly: createToken({ name: 'RCurly', pattern: /}/ }),
  LParen: createToken({ name: 'LParen', pattern: /\(/ }),
  RParen: createToken({ name: 'RParen', pattern: /\)/ }),
  SemiColon: createToken({ name: 'SemiColon', pattern: /;/ }),
  LessThanOrEqual: createToken({ name: 'LessThanOrEqual', pattern: /<=|es menor igual que|menor igual que/, categories: RelationalOperator }),
  GreaterThanOrEqual: createToken({ name: 'GreaterThanOrEqual', pattern: />=|es mayor igual que|mayor igual que/, categories: RelationalOperator }),
  LessThan: createToken({ name: 'LessThan', pattern: /<|es menor que|menor que/, categories: RelationalOperator }),
  GreaterThan: createToken({ name: 'GreaterThan', pattern: />|es mayor que|mayor que/, categories: RelationalOperator }),
  IsEqual: createToken({ name: 'IsEqual', pattern: /==|es igual que|igual que/, categories: RelationalOperator }),
  Equals: createToken({ name: 'Equals', pattern: /=|igual a|igual/ }),
  Plus: createToken({ name: 'Plus', pattern: /\+|mas/, categories: AdditionOperator }),
  Minus: createToken({ name: 'Minus', pattern: /-|menos/, categories: AdditionOperator }),
  Multi: createToken({ name: 'Multi', pattern: /\*|por/, categories: MultiplicationOperator }),
  Div: createToken({ name: 'Div', pattern: /\/|entre/, categories: MultiplicationOperator }),
  INT: createToken({ name: 'INT', pattern: /[0-9]+/ }),
  // TODO: resolve ambiguity keywords vs identifiers
  ID,
  MultiplicationOperator,
  AdditionOperator,
  RelationalOperator,
};

allTokens.push(ID);

const lexer = new Lexer(allTokens);

module.exports = {
  lexer,
  Tokens,
  tokenList: allTokens,
};
