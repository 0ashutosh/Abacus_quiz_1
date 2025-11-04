import { Operation, Question } from '../types';

const generateNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateOptions = (correctAnswer: number, min: number, max: number): number[] => {
  const options = new Set<number>([correctAnswer]);
  
  while (options.size < 4) {
    let wrong = correctAnswer + generateNumber(-5, 5);
    if (wrong !== correctAnswer && wrong >= min && wrong <= max) {
      options.add(wrong);
    }
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const generateQuestion = (level: number): Question => {
  let num1: number, num2: number, operation: Operation, answer: number;
  
  switch (level) {
    case 0:
      num1 = generateNumber(1, 10);
      num2 = generateNumber(1, 10);
      operation = '+';
      answer = num1 + num2;
      break;
      
    case 1:
      num1 = generateNumber(1, 10);
      num2 = generateNumber(1, 10);
      operation = '+';
      answer = num1 + num2;
      break;
      
    case 2:
      num1 = generateNumber(10, 99);
      num2 = generateNumber(10, 99);
      operation = '+';
      answer = num1 + num2;
      break;
      
    case 3:
      if(Math.random() < 0.5){
        num1 = generateNumber(100, 999);
        num2 = generateNumber(100, 999);
        operation = '+';
        answer = num1 + num2;
      } else {
        num1 = generateNumber(150, 999);
        num2 = generateNumber(99, num1 - 10);
        operation = '-';
        answer = num1 - num2;
      }
      break;
      
    case 4:
      const op4 = Math.random();
      if(op4 < 0.3){
        num1 = generateNumber(100, 999);
        num2 = generateNumber(100, 999);
        operation = '+';
        answer = num1 + num2;
      } else if (op4 >= 0.3 && op4 < 0.6) {
        num1 = generateNumber(150, 999);
        num2 = generateNumber(99, num1 - 10);
        operation = '-';
        answer = num1 - num2;
      } else {
        num1 = generateNumber(1, 9);
        num2 = generateNumber(1, 9);
        operation = '×';
        answer = num1 * num2;
      }
      break;
      
    case 5:
      const op5 = Math.random();
      if(op5 < 0.3){
        num1 = generateNumber(100, 999);
        num2 = generateNumber(100, 999);
        operation = '+';
        answer = num1 + num2;
      } else if (op5 >= 0.3 && op5 < 0.6) {
        num1 = generateNumber(150, 999);
        num2 = generateNumber(99, num1 - 10);
        operation = '-';
        answer = num1 - num2;
      } else {
        num1 = generateNumber(1, 99);
        num2 = generateNumber(1, 99);
        operation = '×';
        answer = num1 * num2;
      }
      break;
      
    case 6:
      const op6 = Math.random();
      if (op6 < 0.25) {
        num1 = generateNumber(100, 999);
        num2 = generateNumber(100, 999);
        operation = '+';
        answer = num1 + num2;
      } else if (op6 >= 0.25 && op6 < 0.5) {
        num1 = generateNumber(150, 999);
        num2 = generateNumber(99, num1 - 10);
        operation = '-';
        answer = num1 - num2;
      } else if (op6 >= 0.5 && op6 < 0.75) {
        num1 = generateNumber(1, 99);
        num2 = generateNumber(1, 99);
        operation = '×';
        answer = num1 * num2;
      } else {
        num2 = generateNumber(2, 10);
        answer = generateNumber(2, 10);
        num1 = num2 * answer;
        operation = '÷';
      }
      break;
      
    case 7:
      const op7 = Math.random();
      if (op7 < 0.25) {
        num1 = generateNumber(100, 999);
        num2 = generateNumber(100, 999);
        operation = '+';
        answer = num1 + num2;
      } else if (op7 >= 0.25 && op7 < 0.5) {
        num1 = generateNumber(150, 999);
        num2 = generateNumber(99, num1 - 10);
        operation = '-';
        answer = num1 - num2;
      } else if (op7 >= 0.5 && op7 < 0.75) {
        num1 = generateNumber(1, 99);
        num2 = generateNumber(1, 99);
        operation = '×';
        answer = num1 * num2;
      } else {
        num2 = generateNumber(10, 99);
        answer = generateNumber(1, 99);
        num1 = num2 * answer;
        operation = '÷';
      }
      break;
      
    default: // Level 8
      const op8 = Math.random();
      if (op8 < 0.2) {
        num1 = generateNumber(100, 999);
        num2 = generateNumber(100, 999);
        operation = '+';
        answer = num1 + num2;
      } else if (op8 >= 0.2 && op8 < 0.4) {
        num1 = generateNumber(150, 999);
        num2 = generateNumber(99, num1 - 10);
        operation = '-';
        answer = num1 - num2;
      } else if (op8 >= 0.4 && op8 < 0.7) {
        num1 = generateNumber(1, 99);
        num2 = generateNumber(1, 99);
        operation = '×';
        answer = num1 * num2;
      } else {
        num2 = generateNumber(10, 99);
        answer = generateNumber(1, 99);
        num1 = num2 * answer;
        operation = '÷';
      }
  }
  
  // Adjust option range for larger numbers
  let optionMin = Math.max(0, answer - 10);
  let optionMax = answer + 10;
  
  if (operation === '×' || operation === '÷') {
    optionMin = Math.max(0, answer - Math.max(num1, num2));
    optionMax = answer + Math.max(num1, num2);
  }
  
  // For larger answers, increase the range
  if (answer > 100) {
    optionMin = Math.max(0, answer - 50);
    optionMax = answer + 50;
  }
  
  const options = generateOptions(answer, optionMin, optionMax);
  
  return { num1, num2, operation, answer, options };
};
