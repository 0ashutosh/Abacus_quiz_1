import React from 'react';
import { Question } from '../types';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: number) => void;
  timeLeft: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, onAnswer, timeLeft }) => {
  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-4xl font-bold text-white">
        {question.num1} {question.operation} {question.num2}
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
          >
            {option}
          </button>
        ))}
      </div>
      
      <div className="text-xl text-indigo-300">
        Time remaining: {timeLeft}s
      </div>
    </div>
  );
};

export default QuizQuestion;