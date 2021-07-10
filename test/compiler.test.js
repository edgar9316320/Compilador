/* eslint-disable no-undef */
const fs = require('fs');
const compiler = require('../src/compiler');

const fibonacci1 = fs.readFileSync('./examples/fibonacci.ula').toString();
const fibonacci2 = fs.readFileSync('./examples/fibonacci2.ula').toString();
const numerosPares = fs.readFileSync('./examples/numerosPares.ula').toString();
const programa = fs.readFileSync('./examples/programa.ula').toString();

describe('testing ULA compiler', () => {
  it('compiles "programa.ula" without errors', () => {
    const result = compiler(programa);
    expect(result.jsCode).toBeTruthy();
  });

  it('compiles "numerosPares.ula" without errors', () => {
    const result = compiler(numerosPares);
    expect(result.jsCode).toBeTruthy();
  });

  it('compiles "fibonacci.ula" without errors', () => {
    const result = compiler(fibonacci1);
    expect(result.jsCode).toBeTruthy();
  });

  it('compiles "fibonacci2.ula" without errors', () => {
    const result = compiler(fibonacci2);
    expect(result.jsCode).toBeTruthy();
  });
});
