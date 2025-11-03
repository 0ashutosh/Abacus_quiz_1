export type Difficulty = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Operation = '+' | '-' | '×' | '÷';

export type Question = {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  options: number[];
};

export type QuizResult = {
  questionNumber: number;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
};