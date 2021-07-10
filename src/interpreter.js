/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
// const util = require('util');
const parser = require('./parser');

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

// All our semantics go into the visitor, completly separated from the grammar.
class UlaInterpreter extends BaseCstVisitor {
  constructor() {
    super();
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor();
  }

  program(ctx) {
    // visiting an array is equivalent to visiting its first element.
    let result = '';
    ctx.statement.forEach((element) => {
      result += this.visit(element);
    });
    return result;
  }

  statement(ctx) {
    if (ctx.expressionStatement) {
      return this.visit(ctx.expressionStatement);
    } if (ctx.whileStatement) {
      return this.visit(ctx.whileStatement);
    } if (ctx.ifStatement) {
      return this.visit(ctx.ifStatement);
    } if (ctx.ternaryStatement) {
      return this.visit(ctx.ternaryStatement);
    }if (ctx.printStatement) {
      return this.visit(ctx.printStatement);
    } if (ctx.blockStatement) {
      return this.visit(ctx.blockStatement);
    } if (ctx.emptyStatement) {
      return this.visit(ctx.emptyStatement);
    } if (ctx.doStatement) {
      return this.visit(ctx.doStatement);
    }
    console.log(ctx);
    return 0;
  }

  ternaryStatement(ctx) {
    return `if ${this.visit(ctx.parenExpression)} ${this.visit(ctx.statement[0])} else ${this.visit(ctx.statement[1])}`;
  }

  ifStatement(ctx) {
    if (ctx.Else) {
      return `if ${this.visit(ctx.parenExpression)} ${this.visit(ctx.statement[0])} else ${this.visit(ctx.statement[1])}`;
    }
    return `if ${this.visit(ctx.parenExpression)} ${this.visit(ctx.statement)}`;
  }

  whileStatement(ctx) {
    return `while ${this.visit(ctx.parenExpression)} {${this.visit(ctx.statement)}}`;
  }

  doStatement(ctx) {
    return `do {${this.visit(ctx.statement)}} while${this.visit(ctx.parenExpression)};`;
  }

  blockStatement(ctx) {
    let result = '{';
    ctx.statement.forEach((element) => {
      result += this.visit(element);
    });
    return `${result}}`;
  }

  expressionStatement(ctx) {
    return `${this.visit(ctx.expression)};`;
  }

  expression(ctx) {
    if (ctx.assignExpression) {
      return this.visit(ctx.assignExpression);
    }
    return this.visit(ctx.relationExpression);
  }

  relationExpression(ctx) {
    if (ctx.RelationalOperator) {
      const tokenName = ctx.RelationalOperator[0].tokenType.name;
      let operator = '';
      if (tokenName === 'GreaterThan') {
        operator = '>';
      } else if (tokenName === 'LessThan') {
        operator = '<';
      } else if (tokenName === 'GreaterThanOrEqual') {
        operator = '>=';
      } else if (tokenName === 'LessThanOrEqual') {
        operator = '<=';
      } else {
        operator = '==';
      }
      return `${this.visit(ctx.lhs)} ${operator} ${this.visit(ctx.rhs)}`;
    }
    return this.visit(ctx.lhs);
  }

  AdditionExpression(ctx) {
    if (ctx.AdditionOperator) {
      const operator = ctx.AdditionOperator[0].tokenType.name;
      return `${this.visit(ctx.lhs)} ${operator === 'Plus' ? '+' : '-'} ${this.visit(ctx.rhs)}`;
    }
    return this.visit(ctx.lhs);
  }

  multiplicationExpression(ctx) {
    if (ctx.MultiplicationOperator) {
      const operator = ctx.MultiplicationOperator[0].tokenType.name;
      return `${this.visit(ctx.lhs)} ${operator === 'Multi' ? '*' : '/'} ${this.visit(ctx.rhs)}`;
    }
    return this.visit(ctx.lhs);
  }

  assignExpression(ctx) {
    const id = ctx.ID[0].image;
    return `${id} = ${this.visit(ctx.expression)}`;
  }

  // eslint-disable-next-line class-methods-use-this
  term(ctx) {
    if (ctx.INT) {
      return ctx.INT[0].image;
    }
    return ctx.ID[0].image;
  }

  parenExpression(ctx) {
    return `(${this.visit(ctx.expression)})`;
  }

  // eslint-disable-next-line no-unused-vars
  emptyStatement(ctx) {
    return '';
  }

  printStatement(ctx) {
    return `console.log(${this.visit(ctx.parenExpression)});`;
  }
}

// We only need a single interpreter instance because our interpreter has no state.
const interpreter = new UlaInterpreter();

module.exports = interpreter;
