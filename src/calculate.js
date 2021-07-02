const equalizeLength = (left, right) => {
  let [leftInt, leftDec] = left.includes('.')
    ? left.split('.')
    : [left, '0'];
  let [rightInt, rightDec] = right.includes('.')
    ? right.split('.')
    : [right, '0'];
  leftInt.length > rightInt.length
    ? rightInt = rightInt.padStart(leftInt.length, '0')
    : leftInt = leftInt.padStart(rightInt.length, '0');
  leftDec.length > rightDec.length
    ? rightDec = rightDec.padEnd(leftDec.length, '0')
    : leftDec = leftDec.padEnd(rightDec.length, '0');
  const eqLeft = leftInt + '.' + leftDec;
  const eqRight = rightInt + '.' + rightDec;
  return [eqLeft, eqRight];
};

export const sum = (left, right) => {
  let isNegative = false;
  if (left.includes('-') && right.includes('-')) {
    left = left.substring(1);
    right = right.substring(1);
    isNegative = true;
  }
  if (left.includes('-'))  return subtract(right, left.substring(1));
  if (right.includes('-')) return subtract(left, right.substring(1));

  const [eqLeft, eqRight] = equalizeLength(left, right);
  let inMind = 0;
  const result = [];
  for (let i = eqLeft.length - 1; i >= 0; i--) {
    if (eqLeft[i] === '.') {
      result.unshift(eqLeft[i]);
      continue;
    }
    let sum = parseInt(eqLeft[i]) + parseInt(eqRight[i]) + inMind;
    result.unshift(sum > 9 ? sum - 10 : sum);
    inMind = sum > 9 ? 1 : 0;
  }
  const res = parseFloat(result.join('')).toString(); // to remove decimals equal to zero ('.0')
  return isNegative ? '-' + res : res;
};

export const subtract = (left, right) => {
  if (left.includes('-') && right.includes('-')) {
    left = left.substring(1);
    right = right.substring(1);
    [left, right] = [right, left];
  }
  if (left.includes('-'))  return '-' + sum(left.substring(1), right);
  if (right.includes('-')) return sum(left, right.substring(1));

  let isNegative = false;
  if (parseFloat(left) < parseFloat(right)) { // f. ex.: 2 - 3 = -(3 - 2)
    [left, right] = [right, left];
    isNegative = true;
  }
  const [eqLeft, eqRight] = equalizeLength(left, right);
  const leftNoDot = eqLeft.replace('.', '').split('');
  const rightNoDot = eqRight.replace('.', '').split('');
  const nums = [];
  for (let i = leftNoDot.length - 1; i >= 0 ; i--) {
    const diff = leftNoDot[i] - rightNoDot[i];
    if (diff < 0) {
      let counter = 1;
      let prev = leftNoDot[i - counter];
      while (prev - 1 < 0) prev = leftNoDot[i - (++counter)];
      leftNoDot[i - (counter--)] = prev - 1;
      while (counter > 0) {
        prev = leftNoDot[i - counter];
        leftNoDot[i - counter] = '1' + prev - 1;
        counter--;
      };
      nums.unshift('1' + leftNoDot[i] - rightNoDot[i]);
    } else {
      nums.unshift(diff);
    }
  }
  const dotIdx = eqLeft.indexOf('.');
  const result = nums.join('');
  const integerPart = result.substring(0, dotIdx);
  const decimalPart = result.substring(dotIdx);
  const resultStr = parseFloat(integerPart + '.' + decimalPart).toString();
  return isNegative ? '-' + resultStr : resultStr;
};

export const multiply = (left, right) => {
  let isNegative = false;
  if (left.includes('-') && right.includes('-')) {
    left = left.substring(1);
    right = right.substring(1);
    isNegative = false;
  }
  if (left.includes('-')) {
    left = left.substring(1);
    isNegative = true;
  }
  if (right.includes('-')) {
    right = right.substring(1);
    isNegative = true;
  }
  if (right.length > left.length) [left, right] = [right, left];
  const leftNoDot  = left.replace('.', '');
  const rightNoDot = right.replace('.', '');
  const leftDecsLength  =  (left.split('.')[1] || '').length;
  const rightDecsLength = (right.split('.')[1] || '').length;
  const resultDecsLength = leftDecsLength + rightDecsLength;
  const numsToSum = [];
  let inMind = 0;
  for (let i = rightNoDot.length - 1; i >= 0; i--) {
    let num = '';
    for (let j = leftNoDot.length - 1; j >= 0; j--) {
      const mult = parseInt(rightNoDot[i]) * parseInt(leftNoDot[j]) + inMind;
      const multStr = mult.toString();
      inMind = mult > 9 ? Number(multStr[0]) : 0;    // f.ex. 9*9 (max values to be multiplied) = 81
      num = (mult > 9 ? multStr[1] : multStr) + num; // so there will be no more than 2 digits
    }
    if (inMind > 0) num = inMind + num;
    inMind = 0;
    const zerosAtEnd = rightNoDot.length - i - 1;
    num = num.padEnd(num.length + zerosAtEnd, '0');
    numsToSum.unshift(num);
  }
  const result = numsToSum.reduce(sum);
  const dotIdx = result.length - resultDecsLength;
  const integerPart = result.substring(0, dotIdx);
  const decimalPart = result.substring(dotIdx);
  const resStr = parseFloat(integerPart + '.' + decimalPart).toString();
  return isNegative ? '-' + resStr : resStr;
};

export const divide = (left, right) => {
  let isNegative = false;
  if (left.includes('-') && right.includes('-')) {
    left = left.substring(1);
    right = right.substring(1);
    isNegative = false;
  }
  if (left.includes('-')) {
    left = left.substring(1);
    isNegative = true;
  }
  if (right.includes('-')) {
    right = right.substring(1);
    isNegative = true;
  }
  const PRECISION = 9;                                     // quantity of digits after the dot
  const dvsrDecs =  (left.split('.')[1] || '').length;     // transform operands:
  const dvntDecs = (right.split('.')[1] || '').length;     // f.ex.: 0.4 / 6.25 = 40 / 625
  const multiplier = Math.pow(10, dvsrDecs >= dvntDecs ? dvsrDecs : dvntDecs).toString();
  let divident = multiply(left, multiplier);
  let divisor = multiply(right, multiplier);

  const result = [];
  let num = '';
  for (let i = 0; i < divident.length; i++) { // computing integer part
    if (divident[i] === '.') result.push(divident[i++]);
    num += divident[i];
    let res = Math.floor(num / divisor);
    if (res < 1) continue;
    result.push(res);
    let diff = subtract(num, multiply(res.toString(), divisor));
    if (Number(diff) === 0) {
      num = '';
      continue;
    };
    num = diff;
  }
  
  num === divident && result.push('0');

  if (num) { // computing decimal part
    result.push('.');
    const dotIdx = result.indexOf('.');
    while (result.slice(dotIdx + 1).length < PRECISION + 1) {
      num += '0';
      let res = Math.floor(num / divisor);
      if (res < 1) {
        result.push('0');
        continue;
      }
      result.push(res);
      let diff = subtract(num, multiply(res.toString(), divisor));
      if (Number(diff) === 0) break;
      num = diff;
    }
  }
  const res = result.join('');
  const resLastDigit = res[res.length - 1]; 
  const resPrevLastDigit = res[res.length - 2];
  const condition = (res.substring(res.indexOf('.') + 1) || '').length >= PRECISION; 
  const rounded = condition && resLastDigit >= 5 // round decimal part if it is of PRECISION length
    ? res.substring(0, res.length - 2) + (parseInt(resPrevLastDigit) + 1)
    : res;
  return isNegative ? '-' + rounded : rounded;
};