// const util = require('util');
const fs = require('fs');
const compiler = require('./src/compiler');

const sourceCode = fs.readFileSync(process.argv[2]).toString();

const result = compiler(sourceCode);

if (result.lexErrors.length > 0) {
  console.error(result.lexErrors[0]);
  process.exit(1);
}
if (result.parseErrors.length > 0) {
  console.error(result.parseErrors[0]);
  process.exit(1);
}

eval(result.jsCode);
