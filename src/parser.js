const chevrotain = require('chevrotain');
const lexer = require('./lexer');

const { CstParser } = chevrotain;
const { Tokens, tokenList } = lexer;

class UlaParser extends CstParser {
  constructor() {
    super(tokenList);

    const $ = this;

    $.RULE('program', () => {
      $.MANY(() => {
        $.SUBRULE($.statement);
      });
    });

    $.RULE('statement', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.ternaryStatement) },
        { ALT: () => $.SUBRULE($.ifStatement) },
        { ALT: () => $.SUBRULE($.whileStatement) },
        { ALT: () => $.SUBRULE($.doStatement) },
        { ALT: () => $.SUBRULE($.blockStatement) },
        { ALT: () => $.SUBRULE($.expressionStatement) },
        { ALT: () => $.SUBRULE($.emptyStatement) },
        { ALT: () => $.SUBRULE($.printStatement) },

      ]);
    });

    $.RULE('ternaryStatement', () => {
      $.CONSUME(Tokens.Ternary);
      $.SUBRULE($.parenExpression);
      $.CONSUME(Tokens.Then);
      $.SUBRULE($.statement);
      $.CONSUME(Tokens.Else);
      $.SUBRULE2($.statement);
    });

    $.RULE('ifStatement', () => {
      $.CONSUME(Tokens.If);
      $.SUBRULE($.parenExpression);
      $.SUBRULE($.statement);
      $.OPTION(() => {
        $.CONSUME(Tokens.Else);
        $.SUBRULE2($.statement);
      });
    });

    $.RULE('whileStatement', () => {
      $.CONSUME(Tokens.While);
      $.SUBRULE($.parenExpression);
      $.SUBRULE($.statement);
    });

    $.RULE('doStatement', () => {
      $.CONSUME(Tokens.Do);
      $.SUBRULE($.statement);
      $.CONSUME(Tokens.While);
      $.SUBRULE($.parenExpression);
      // $.CONSUME(Tokens.SemiColon);
    });

    $.RULE('blockStatement', () => {
      $.CONSUME(Tokens.LCurly);
      $.MANY(() => {
        $.SUBRULE($.statement);
      });
      $.CONSUME(Tokens.RCurly);
    });

    $.RULE('expressionStatement', () => {
      $.SUBRULE($.expression);
    });

    $.RULE('expression', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.assignExpression) },
        { ALT: () => $.SUBRULE($.relationExpression) },
      ]);
    });

    $.RULE('relationExpression', () => {
      $.SUBRULE($.AdditionExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(Tokens.RelationalOperator);
        $.SUBRULE2($.AdditionExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('AdditionExpression', () => {
      // using labels can make the CST processing easier
      $.SUBRULE($.multiplicationExpression, { LABEL: 'lhs' });
      $.MANY(() => {
        // consuming 'AdditionOperator' will consume either Plus or Minus
        $.CONSUME(Tokens.AdditionOperator);
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar
        $.SUBRULE2($.multiplicationExpression, { LABEL: 'rhs' });
      });
    });

    $.RULE('multiplicationExpression', () => {
      $.SUBRULE($.term, { LABEL: 'lhs' });
      $.MANY(() => {
        $.CONSUME(Tokens.MultiplicationOperator);
        //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar
        $.SUBRULE2($.term, { LABEL: 'rhs' });
      });
    });

    $.RULE('assignExpression', () => {
      $.CONSUME(Tokens.ID);
      $.CONSUME(Tokens.Equals);
      $.SUBRULE($.expression);
    });

    $.RULE('term', () => {
      $.OR([
        { ALT: () => $.CONSUME(Tokens.ID) },
        { ALT: () => $.CONSUME(Tokens.INT) },
        { ALT: () => $.SUBRULE($.parenExpression) },
      ]);
    });

    $.RULE('parenExpression', () => {
      $.CONSUME(Tokens.LParen);
      $.SUBRULE($.expression);
      $.CONSUME(Tokens.RParen);
    });

    $.RULE('emptyStatement', () => {
      $.CONSUME(Tokens.SemiColon);
    });

    $.RULE('printStatement', () => {
      $.CONSUME(Tokens.Print);
      $.SUBRULE($.parenExpression);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

const parser = new UlaParser([]);

module.exports = parser;
