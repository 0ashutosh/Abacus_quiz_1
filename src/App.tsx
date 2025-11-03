import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import FloatingAbacus from './components/FloatingAbacus';
import QuizQuestion from './components/QuizQuestion';
import QuizResults from './components/QuizResults';
import { generateQuestion } from './utils/quizLogic';
import { Difficulty, QuizResult } from './types';

function App() {
  const [level, setLevel] = useState<Difficulty | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(generateQuestion(0));
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
    setIsStarted(true);
    setStartTime(Date.now());
    setResults([]);
    setQuestionNumber(1);
    setTimeLeft(30);
    setShowResults(false);
  };

  const handleAnswer = (answer: number) => {
    const result: QuizResult = {
      questionNumber,
      question: `${currentQuestion.num1} ${currentQuestion.operation} ${currentQuestion.num2}`,
      userAnswer: answer,
      correctAnswer: currentQuestion.answer,
      isCorrect: answer === currentQuestion.answer,
    };

    setResults((prev) => [...prev, result]);

    if (questionNumber < 100) {
      setQuestionNumber((prev) => prev + 1);
      setCurrentQuestion(generateQuestion(level || 0));
      setTimeLeft(30);
    } else {
      setShowResults(true);
      setIsStarted(false);
    }
  };

  const handleRetry = () => {
    setIsStarted(false);
    setResults([]);
    setQuestionNumber(1);
    setShowResults(false);
    handleStart();
  };

  const handleHome = () => {
    setLevel(null);
    setIsStarted(false);
    setResults([]);
    setQuestionNumber(1);
    setShowResults(false);
  };

  React.useEffect(() => {
    let timer: number;
    if (isStarted && timeLeft > 0 && !showResults) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResults) {
      handleAnswer(-1); // Wrong answer when time runs out
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft, showResults]);

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

export default App;