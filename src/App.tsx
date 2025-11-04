import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Calculator } from 'lucide-react';

type Difficulty = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Operation = '+' | '-' | '×' | '÷';

interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  options: number[];
}

interface QuizResult {
  questionNumber: number;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}

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

const generateQuestion = (level: number): Question => {
  let num1: number, num2: number, operation: Operation, answer: number;
  
  switch (true) {
    case level <= 1:
      num1 = generateNumber(1, level === 0 ? 10 : 20);
      num2 = generateNumber(1, level === 0 ? 10 : 20);
      operation = '+';
      answer = num1 + num2;
      break;
      
    case level <= 2:
      num1 = generateNumber(10, 30);
      num2 = generateNumber(10, 30);
      operation = '+';
      answer = num1 + num2;
      break;
      
    case level <= 4:
      num1 = generateNumber(10, 50);
      num2 = generateNumber(10, Math.min(num1, 50));
      operation = Math.random() < 0.5 ? '+' : '-';
      answer = operation === '+' ? num1 + num2 : num1 - num2;
      break;
      
    case level <= 6:
      if (Math.random() < 0.5) {
        num1 = generateNumber(10, 50);
        num2 = generateNumber(10, 50);
        operation = Math.random() < 0.5 ? '+' : '-';
        if (operation === '-' && num1 < num2) [num1, num2] = [num2, num1];
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
      
    default: // Level 7-8
      const op = Math.random();
      if (op < 0.5) {
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

const FloatingAbacus: React.FC = () => {
  const abacuses = Array.from({ length: 15 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {abacuses.map((_, index) => (
        <div
          key={index}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${10 + Math.random() * 10}s linear infinite`,
            animationDelay: `-${Math.random() * 10}s`,
            opacity: 0.1,
          }}
        >
          <Calculator
            size={24 + Math.random() * 24}
            className="text-white transform rotate-12"
          />
        </div>
      ))}
    </div>
  );
};

const QuizQuestion: React.FC<{
  question: Question;
  onAnswer: (answer: number) => void;
  timeLeft: number;
}> = ({ question, onAnswer, timeLeft }) => {
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

const QuizResults: React.FC<{
  results: QuizResult[];
  timeTaken: number;
  onRetry: () => void;
  onHome: () => void;
  level: Difficulty;
}> = ({ results, timeTaken, onRetry, onHome, level }) => {
  const score = results.filter((r) => r.isCorrect).length;
  const percentage = (score / results.length) * 100;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm fixed inset-0 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-xl max-w-md w-full mx-auto shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6">Quiz Complete!</h2>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="text-2xl text-white mb-2">Level {level}</div>
          <div className="text-3xl font-bold text-indigo-400 mb-2">
            {score}/100 Correct
          </div>
          <div className="text-xl text-indigo-300">{percentage.toFixed(1)}%</div>
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

export default function App() {
  const [level, setLevel] = useState<Difficulty | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(generateQuestion(0));
  const [questionNumber, setQuestionNumber] = useState(1);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleLevelSelect = (selectedLevel: Difficulty) => {
    setLevel(selectedLevel);
    setCurrentQuestion(generateQuestion(selectedLevel));
    setShowResults(false);
  };

  const handleStart = () => {
    if (level === null) return;
    setIsStarted(true);
    setStartTime(Date.now());
    setResults([]);
    setQuestionNumber(1);
    setTimeLeft(30);
    setShowResults(false);
    setCurrentQuestion(generateQuestion(level));
  };

  const handleAnswer = useCallback((answer: number) => {
    if (!currentQuestion || level === null) return;
    
    const result: QuizResult = {
      questionNumber,
      question: `${currentQuestion.num1} ${currentQuestion.operation} ${currentQuestion.num2}`,
      userAnswer: answer,
      correctAnswer: currentQuestion.answer,
      isCorrect: answer === currentQuestion.answer,
    };

    setResults((prev) => [...prev, result]);

    if (questionNumber < 100) {
      const nextQuestion = generateQuestion(level);
      setQuestionNumber((prev) => prev + 1);
      setCurrentQuestion(nextQuestion);
      setTimeLeft(30);
    } else {
      setShowResults(true);
      setIsStarted(false);
    }
  }, [currentQuestion, level, questionNumber]);

  const handleRetry = () => {
    if (level === null) return;
    setIsStarted(true);
    setStartTime(Date.now());
    setResults([]);
    setQuestionNumber(1);
    setShowResults(false);
    setTimeLeft(30);
    setCurrentQuestion(generateQuestion(level));
  };

  const handleHome = () => {
    setLevel(null);
    setIsStarted(false);
    setResults([]);
    setQuestionNumber(1);
    setShowResults(false);
  };

  // Timer effect
  useEffect(() => {
    if (!isStarted || showResults) return;
    
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isStarted, showResults, timeLeft, handleAnswer]);

  if (!level) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <FloatingAbacus />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Brain className="w-20 h-20 mx-auto mb-8 text-indigo-500" />
            <h1 className="text-4xl font-bold mb-8">Math Master Challenge</h1>
            <p className="text-gray-400 mb-12">
              Test your math skills with our adaptive difficulty quiz system.
              Choose your level to begin!
            </p>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleLevelSelect(i as Difficulty)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-lg transition-colors duration-200"
                >
                  Level {i}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const timeTaken = Math.floor((Date.now() - (startTime || 0)) / 1000);
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <QuizResults
          results={results}
          timeTaken={timeTaken}
          onRetry={handleRetry}
          onHome={handleHome}
          level={level}
        />
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <FloatingAbacus />
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Level {level}</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            You'll have 30 seconds per question.
            There are 100 questions in total.
          </p>
          <button
            onClick={handleStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl py-4 px-12 rounded-lg transition-colors duration-200"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-indigo-400 mb-2">Level {level}</div>
          <div className="text-white text-lg">
            Question {questionNumber} of 100
          </div>
        </div>
        <QuizQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  );
}
