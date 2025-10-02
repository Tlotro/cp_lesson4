class MiniMaple {
  /*constructor() {
    this.variable = "x";
  }

  constructor(v) {
    this.variable = v;
  }

  setVariable(v) {
    this.variable = v;
    return this;
  }

  differentiate(expression) {
    if (typeof expression === "number") return 0;

    if (typeof expression === "string") {
      if (expression === this.variable)  return 1;
      return 0;
    }

    if (Array.isArray(expression)) {
      const [operator, ...operands] = expression;
      return this.differentiateOperation(operator, operands);
    }

    alert(`Unknown expression type: ${expression}`);
  }

  differentiateOperation(operator, operands) {

    const difOpers = operands.map(op => this.differentiate(op)); //This assumes that the derivation depth is finite... hope it is.

    switch (operator) {
      case "+":
        return ["+", ...difOpers];

      case "-":
        if (operands.length === 1) return ["-", difOpers[0]];
        return ["-", difOpers[0], difOpers[1]];

      case "*":
        if (operands.length !== 2)
          alert('Product requires exactly 2 operands');
        else return ['+', ['*', difOpers[0], operands[1]], ['*', operands[0], difOpers[1]]];;

      case "/":
        if (operands.length !== 2)
          alert('Division requires exactly 2 operands');
        else return ['/', ['-', ['*', difOpers[0], operands[1]], ['*', operands[0], difOpers[1]]], ['^', operands[1], 2]];

      case "^":
        if (operands.length !== 2) alert('Power requires exactly 2 operands');
        //Thanks AI, very cool. 
        //y = u(x)^v(x)
        //y' = u(x)^v(x) * [v'(x) * ln(u(x)) + (v(x) * u'(x)) / u(x)]
        //This should be taught in school (after explaining both (a^x)' and (x^a)') as to show that they are both simplified verions of this general rule.
        else return ['*',
          ['^', operands[0], operands[1]],
          ['+',
            ['*', difOpers[1], ['ln', operands[0]]], // when the power is a number, this is zero
            ['/', ['*', operands[1], difOpers[0]], operands[0]] // when the  base is a number, this is zero. I'm so glad this doesn't solve and this will be simplified away.
          ]
        ];


      case "sin":
        if (operands.length !== 1) alert(`Sin requires exactly 1 operand`);
        else return ["*", ["cos", operands[0]], difOpers[0]];

      case "cos":
        if (operands.length !== 1) alert(`Cos requires exactly 1 operand`);
        else return ["-", ["*", ["sin", operands[0]], difOpers[0]]];

      case "tan":
        if (operands.length !== 1) alert(`Tan requires exactly 1 operand`);
        else return ["/", difOpers[0], ["pow", ["sin", operands[0]], 2]];

      case "ctg":
        if (operands.length !== 1) alert(`Ctg requires exactly 1 operand`);
        else return ["-", ["/", difOpers[0], ["pow", ["cos", operands[0]], 2]]];

      case "ln":
        if (operands.length !== 1) alert(`Ln requires exactly 1 operand`);
        else return ["/", difOpers[0], operands[0]];

      case "log":
        if (operands.length !== 2) alert(`Log requires exactly 2 operands`);
        else if (typeof operands[1] === Number) return ["/", difOpers[0], ["*", operands[0], ["ln", operands[1]]]]
        else return differentiateOperation("/", [["ln", operands[0]], ["ln", operands[1]]]);

      default:
        alert("Unknown operator: ${operator}");
    }
  }

  simplify(expression) {
    if (typeof expression === 'number' || typeof expression === 'string') return expression;

    if (Array.isArray(expression)) {
      const [operator, ...operands] = expression;
      const simplifiedOperands = operands.map(op => this.simplify(op));
      return this.simplifyOperation(operator, simplifiedOperands);
    }
    return expression;
  }

  simplifyOperation(operator, operands) {
    switch (operator) {
      case '+':
        const nonZeroAdd = operands.filter(op => op !== 0);
        if (nonZeroAdd.length === 0) return 0;
        if (nonZeroAdd.length === 1) return nonZeroAdd[0];
        return [operator, ...nonZeroAdd];

      case '*':
        if (operands.includes(0)) return 0;
        const nonOneMult = operands.filter(op => op !== 1);
        if (nonOneMult.length === 0) return 1;
        if (nonOneMult.length === 1) return nonOneMult[0];
        return [operator, ...nonOneMult];

      case '/':
        if (operands[0] === 0) return 0;
        return [operator, ...operands];

      case '^':
        if (operands[1] === 0) return 1;
        if (operands[1] === 1) return operands[0];
        return [operator, ...operands];

      default:
        return [operator, ...operands];
    }
  }

  toString(expression) {
    if (typeof expression === 'number') {
      return expression.toString();
    }

    if (typeof expression === 'string') {
      return expression;
    }

    if (Array.isArray(expression)) {
      const [operator, ...operands] = expression;

      switch (operator) {
        case '+':
        case '-':
        case '*':
        case '/':
          return `(${operands.map(op => this.toString(op)).join(` ${operator} `)})`;

        case '^':
          return `(${this.toString(operands[0])}^${this.toString(operands[1])})`;

        default:
          return `${operator}(${operands.map(op => this.toString(op)).join(', ')})`;
      }
    }

    return expression.toString();
  }*/
}

export { MiniMaple }