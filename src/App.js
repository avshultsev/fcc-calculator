import './App.css';
import { useState } from 'react';

const mathOperation = (left, sign, right = 0) => {
  const numLeft = parseFloat(left);
  const numRight = parseFloat(right);
  switch (sign) {
    case '+':
      return numLeft + numRight;
    case '-':
      return numLeft - numRight;
    case '*':
      return numLeft * numRight;
    case '/':
      return numLeft / numRight;
    default:
      return NaN;
  }
};

const getResult = (operands, signs) => {
  for (const sign of signs) {
    if (sign === '*' || sign === '/') {
      const index = signs.indexOf(sign);
      const left = operands[index];
      const right = operands[index + 1];
      const result = mathOperation(left, sign, right);
      operands.splice(index, 2, [result]);
      signs.splice(index, 1);
    }
  }
  return operands.reduce((acc, e, i) => acc = mathOperation(acc, signs[i - 1], e));
};

const calculate = (str) => {
  const operands = str.match(/(?<=[+\-*/])-\d+\.?\d*|^-*\d+\.?\d*|\d+\.?\d*/g);
  const signs = str.match(/(?<=\d)[+\-*/]/g);
  return getResult(operands, signs);
};

function App() {
  const [state, setState] = useState({ formula: '', current: 0 });
  const dotNumbers = [
    {id: 'one',     value: '1'},
    {id: 'two',     value: '2'},
    {id: 'three',   value: '3'},
    {id: 'four',    value: '4'},
    {id: 'five',    value: '5'},
    {id: 'six',     value: '6'},
    {id: 'seven',   value: '7'},
    {id: 'eight',   value: '8'},
    {id: 'nine',    value: '9'},
    {id: 'zero',    value: '0'},
    {id: 'decimal', value: '.'},
  ];
  const operators = [
    {id: 'add',      value: '+'},
    {id: 'subtract', value: '-'},
    {id: 'multiply', value: '*'},
    {id: 'divide',   value: '/'},
  ];
  const clear  = [{id: 'clear', value: 'AC'}];
  const equals = [{id: 'equals', value: '='}];

  const buttonSet = { dotNumbers, operators, clear, equals };
  const handlers =  {
    dotNumbers: (value) => {
      const cur = state.current.toString();
      if (value === '.' && cur.includes(value)) return; // prevent multiple dots
      if (value === '0' && cur === '0') return;         // prevent multiple zeros at start
      if (state.formula.includes('=')) {                // prevent mutation of calculations result
        setState({ formula: value, current: value });
        return;
      }
      setState({
        formula: cur === '0' && value === '.' 
          ? state.formula + cur + value 
          : state.formula + value,
        current: cur === '0' && value !== '.' 
          ? value 
          : cur + value
      });
    },
    operators: (value) => {
      if (state.current === value && value !== '-') return;
      const formula = state.formula;
      if (formula.endsWith('=')) {                       // for performing operations in chain
        setState({ formula: state.current + value, current: value });
        return;
      };
      const regexp = /[+\-*/]-?$/;
      const match = formula.match(regexp);
      if (!match) {                                      // correct math operators replacement
        setState({ formula: formula + value, current: value });
      } else {
        const length = match[0].length;
        setState({
          formula: length === 2
            ? formula.substring(0, formula.length - length) + value
            : value === '-' 
              ? formula + value 
              : formula.substring(0, formula.length - length) + value,
          current: value
        });
      }
    },
    clear: () => {
      setState({
        formula: '',
        current: 0,
      });
    },
    equals: (value) => {
      if (state.formula.includes('=')) return;           // prevent multiple equals
      const result = calculate(state.formula);
      setState({
        formula: state.formula + value,
        current: result,
      });
    },
  };

  return (
    <main>
      <div id="displayWrapper">
        <div id="formula">{ state.formula }</div>
        <div id="display">{ state.current }</div>
      </div>
      <div id="buttonSet">
        {Object.keys(buttonSet).map(key => {
          const jsxArr = [];
          const arr = buttonSet[key];
          const handler = handlers[key];
          for (const { id, value } of arr) {
            const jsx = (
              <div 
                id={ id } 
                key={ "key-" + value } 
                onClick={ handler.bind(null, value) }
                className='button'>
                  { value }
              </div>
            );
            jsxArr.push(jsx);
          }
          return <div key={ key } className={ key }>{ jsxArr }</div>;
        })}
      </div>
    </main>
  );
}

export default App;