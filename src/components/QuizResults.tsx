import React from 'react';
import { QuizResult, Difficulty } from '../types';

interface QuizResultsProps {
  results: QuizResult[];
  timeTaken: number;
  onRetry: () => void;
  onHome: () => void;
  level: Difficulty;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  results,
  timeTaken,
  onRetry,
  onHome,
  level,
}) => {
  const score = results.filter((r) => r.isCorrect).length;
  const percentage = (score / results.length) * 100;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm fixed inset-0 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-xl max-w-md w-full mx-auto shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6">Quiz Complete!</h2>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="text-2xl text-white mb-2">
            Level {level}
          </div>
          <div className="text-3xl font-bold text-indigo-400 mb-2">
            {score}/100 Correct
          </div>
          <div className="text-xl text-indigo-300">
            {percentage.toFixed(1)}%
          </div>
          <div className="text-gray-400 text-sm mt-2">
            Time: {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onRetry}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Retry Level {level}
          </button>
          <button
            onClick={onHome}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Choose Different Level
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;