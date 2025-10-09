class MiniMaple {
  constructor() {
    this.variable = "x";
    this.currentIndex = 0;
    this.lexsequence = [];
  }

  setVariable(v) {
    this.variable = v;
    return this;
  }

  lex(initialstring) {
    this.lexsequence = [];
    const cleaned = initialstring;
    let i = 0;
    while (i < cleaned.length) {
      const char = cleaned[i];
      //Handle operators and parenthesis
      if (char == '+' || char == '-' || char == '*' || char == '/' || char == '^' || char == '(' || char == ')' || char == ',') { this.lexsequence.push(char); i++; }
      //Handle numbers
      else if (char <= '9' && char >= '0') {
        let number = '';
        while ((i < cleaned.length) && (cleaned[i] <= '9') && (cleaned[i] >= '0') || (cleaned[i] === '.')) {
          number += cleaned[i];
          i++;
        }
        this.lexsequence.push(parseFloat(number));
      }
      //Handle functions and variables
      else if (char >= 'a' && char <= 'z') {
        let nam = ''
        while (i < cleaned.length && cleaned[i] >= 'a' && cleaned[i] <= 'z') {
          nam += cleaned[i];
          i++;
        }
        this.lexsequence.push(nam);
      }
    }
    return this.lexsequence;
  }

  isText(string)
  {
    return /^[a-zA-Z]+$/.test(string);
  }

  consume(expected = null) {
    if (expected && this.currentToken() !== expected) {
      throw new Error(`Expected ${expected}, got ${this.currentToken()}`);
    }
    const token = this.currentToken();
    this.currentIndex++;
    return token;
  }

  currentToken() { return this.lexsequence[this.currentIndex]; }

  parse() {
    return this.parseAddition();
  }

  parseAddition() {
    let left = this.parseMultiplication();
    while (this.currentIndex < this.lexsequence.length &&
      (this.currentToken() === '+' || this.currentToken() === '-')) {
      const operator = this.consume();
      const right = this.parseMultiplication();
      left = [operator, left, right];
    }

    return left;
  }

  parseMultiplication() {
    let left = this.parseExponentiation();

    while (this.currentIndex < this.lexsequence.length &&
      (this.currentToken() === '*' || this.currentToken() === '/')) {
      const operator = this.consume();
      const right = this.parseExponentiation();
      left = [operator, left, right];
    }

    return left;
  }

  parseExponentiation() {
    let left = this.parseFunct();

    while (this.currentIndex < this.lexsequence.length && this.currentToken() === '^') {
      const operator = this.consume();
      const right = this.parseFunct();
      left = [operator, left, right];
    }

    return left;
  }

  parseFunct() {
    const token = this.currentToken();

    if (typeof token === 'number') {
      this.consume();
      return token;
    }

    if (typeof token === 'string') {
      if (token == 'cos' || token == 'sin' || token == 'tan' || token == 'ctg' || token == 'ln' || token == 'log') {
        const funcName = this.consume();
        this.consume('(');

        const args = [];
        if (this.currentToken() !== ')') {
          args.push(this.parse());

          while (this.currentIndex < this.lexsequence.length && this.currentToken() === ',') {
            this.consume(',');
            args.push(this.parse());
          }
        }

        this.consume(')');
        return [funcName, ...args];
      } else if (token === '(') {
        this.consume('(');
        const expr = this.parse();
        this.consume(')');
        return expr;
      } else if (token === '-') {
        this.consume('-');
        const operand = this.parseFunct();
        return ['-', operand];
      }
      else {
        this.consume();
        return token;
      }
    }
  }


  differentiate(expression) {
    if (typeof expression === "number") return 0;

    if (typeof expression === "string") {
      if (expression === this.variable) return 1;
      return 0;
    }

    if (Array.isArray(expression)) {
      const [operator, ...operands] = expression;
      return this.differentiateOperation(operator, operands);
    }
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
          throw new Error('Product requires exactly 2 operands');
        else return ['+', ['*', difOpers[0], operands[1]], ['*', operands[0], difOpers[1]]];;

      case "/":
        if (operands.length !== 2)
          throw new Error('Division requires exactly 2 operands');
        else return ['/', ['-', ['*', difOpers[0], operands[1]], ['*', operands[0], difOpers[1]]], ['^', operands[1], 2]];

      case "^":
        if (operands.length !== 2) throw new Error('Power requires exactly 2 operands');
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
        if (operands.length !== 1) throw new Error(`Sin requires exactly 1 operand`);
        else return ["*", ["cos", operands[0]], difOpers[0]];

      case "cos":
        if (operands.length !== 1) throw new Error(`Cos requires exactly 1 operand`);
        else return ["-", ["*", ["sin", operands[0]], difOpers[0]]];

      case "tan":
        if (operands.length !== 1) throw new Error(`Tan requires exactly 1 operand`);
        else return ["/", difOpers[0], ["^", ["sin", operands[0]], 2]];

      case "ctg":
        if (operands.length !== 1) throw new Error(`Ctg requires exactly 1 operand`);
        else return ["-", ["/", difOpers[0], ["^", ["cos", operands[0]], 2]]];

      case "ln":
        if (operands.length !== 1) throw new Error(`Ln requires exactly 1 operand`);
        else return ["/", difOpers[0], operands[0]];

      case "log":
        if (operands.length !== 2) throw new Error(`Log requires exactly 2 operands`);
        else if (typeof operands[1] === Number) return ["/", difOpers[0], ["*", operands[0], ["ln", operands[1]]]]
        else return this.differentiateOperation("/", [["ln", operands[0]], ["ln", operands[1]]]);

      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  simplify(expression) {
    if (typeof expression === 'number') return expression;
    if (typeof expression === 'string')
      if (this.isText(expression)) return expression;
      else throw new Error(`This should not be here: ${expression}`);

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
        if (typeof operands[0] === 'number' && typeof operands[1] === 'number') return operands[0] + operands[1];
        return [operator, ...nonZeroAdd];

      case '-':
        if (operands.length === 2 && typeof operands[0] === 'number' && typeof operands[1] === 'number') return operands[0] - operands[1];
        if (operands.length === 2 && operands[0] === 0) 
          if (typeof operands[1] === 'number')
            return -1*operands[1]
          else
            return ['-',operands[1]];
        if (operands.length === 2 && operands[1] === 0) return operands[0];
        if (operands.length === 1 && typeof operands[0] === 'number') return -1*operands[0];
        return [operator, ...operands]

      case '*':
        if (operands.includes(0)) return 0;
        const nonOneMult = operands.filter(op => op !== 1);
        if (nonOneMult.length === 0) return 1;
        if (nonOneMult.length === 1) return nonOneMult[0];
        if (typeof operands[0] === 'number' && typeof operands[1] === 'number') return operands[0] * operands[1];
        return [operator, ...nonOneMult];

      case '/':
        if (operands[0] === 0) return 0;
        if (typeof operands[0] === 'number' && typeof operands[1] === 'number') return operands[0] / operands[1];
        if (operands[1] === 0) throw new Error('Division by zero error')
        return [operator, ...operands];

      case '^':
        if (operands[1] === 0) return 1;
        if (typeof operands[0] === 'number' && typeof operands[1] === 'number') return Math.pow(operands[0],operands[1]);
        return [operator, ...operands];

      case 'sin':
        if (typeof operands[0] === 'number') return Math.sin(operands[0]);
        return [operator, ...operands];

      case 'cos':
        if (typeof operands[0] === 'number') return Math.cos(operands[0]);
        return [operator, ...operands];

      case 'tan':
        if (typeof operands[0] === 'number') return Math.tan(operands[0]);
        return [operator, ...operands];

      case 'ctg':
        if (typeof operands[0] === 'number') return 1/Math.tan(operands[0]);
        return [operator, ...operands];

      case 'ln':
        if (typeof operands[0] === 'number') return Math.log(operands[0]);
        return [operator, ...operands];

      case 'log':
        if (typeof operands[0] === 'number' && typeof operands[1] === 'number') return Math.log(operands[0])/Math.log(operands[1]);
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
          return `(${operands.map(op => this.toString(op)).join(`${operator}`)})`;
          
        case '/':
          return `(${this.toString(operands[0])}/${this.toString(operands[1])})`;

        case '^':
          return `(${this.toString(operands[0])}^${this.toString(operands[1])})`;

        default:
          return `${operator}(${operands.map(op => this.toString(op)).join(', ')})`;
      }
    }

    return expression.toString();
  }
}

export { MiniMaple }