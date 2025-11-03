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
  
  switch (true) {
    case level <= 1: // Simple addition (1-10 for level 0, 1-20 for level 1)
      num1 = generateNumber(1, level === 0 ? 10 : 20);
      num2 = generateNumber(1, level === 0 ? 10 : 20);
      operation = '+';
      answer = num1 + num2;
      break;
      
    case level <= 2: // Larger addition (10-30)
      num1 = generateNumber(10, 30);
      num2 = generateNumber(10, 30);
      operation = '+';
      answer = num1 + num2;
      break;
      
    case level <= 4: // Addition and subtraction (10-50)
      num1 = generateNumber(10, 50);
      num2 = generateNumber(10, Math.min(num1, 50)); // Ensure no negative results
      operation = Math.random() < 0.5 ? '+' : '-';
      answer = operation === '+' ? num1 + num2 : num1 - num2;
      break;
      
    case level <= 6: // All operations
      if (Math.random() < 0.5) {
        num1 = generateNumber(10, 50);
        num2 = generateNumber(10, 50);
        operation = Math.random() < 0.5 ? '+' : '-';
        answer = operation === '+' ? num1 + num2 : num1 - num2;
      } else {
        num1 = generateNumber(2, 12);
        num2 = generateNumber(2, 10);
        operation = Math.random() < 0.5 ? '×' : '÷';
        if (operation === '÷') {
          answer = num2;
          num1 = num1 * num2;
        } else {
          answer = num1 * num2;
        }
      }
      break;
      
    default: // Advanced multiplication and division (levels 7-8)
      if (Math.random() < 0.5) {
        num1 = generateNumber(5, 20);
        num2 = generateNumber(5, 15);
        operation = '×';
        answer = num1 * num2;
      } else {
        num2 = generateNumber(2, 12);
        answer = generateNumber(2, 12);
        num1 = num2 * answer;
        operation = '÷';
      }
  }
  
  const options = generateOptions(answer, Math.max(0, answer - 10), answer + 10);
  
  return { num1, num2, operation, answer, options };
};