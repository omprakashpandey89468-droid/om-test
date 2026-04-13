import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Minus, X, Divide, Percent, Variable, 
  Trophy, BookOpen, Brain, Settings, ChevronRight, 
  CheckCircle2, XCircle, RefreshCcw, LayoutDashboard,
  ArrowLeft, ArrowRight, RotateCw, Timer, Play, Pause, Square
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TOPICS, TOPIC_CONTENT } from './constants';
import { TopicId, Difficulty, UserProgress, Question, Flashcard } from './types';
import { generateQuestion, generateFlashcards } from './utils/mathGenerator';
import { ChatBot } from './components/ChatBot';

// --- Components ---

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <motion.div 
      className="bg-blue-600 h-2.5 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1 }}
    />
  </div>
);

const DifficultySelector = ({ selected, onSelect }: { selected: Difficulty, onSelect: (d: Difficulty) => void }) => (
  <div className="flex gap-2 mb-6">
    {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
      <button
        key={level}
        onClick={() => onSelect(level)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          selected === level 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        {level}
      </button>
    ))}
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'dashboard' | 'learning' | 'quiz' | 'flashcards'>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<TopicId | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [progress, setProgress] = useState<UserProgress>({
    completedLessons: [],
    scores: { addition: 0, subtraction: 0, multiplication: 0, division: 0, fractions: 0, algebra: 0 },
    totalQuestions: { addition: 0, subtraction: 0, multiplication: 0, division: 0, fractions: 0, algebra: 0 },
    streak: 0,
    lastActive: new Date().toISOString(),
  });

  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Flashcard State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Timer State
  const [time, setTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isTimerActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, time]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Load progress from local storage
  useEffect(() => {
    const saved = localStorage.getItem('math_master_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  // Save progress
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('math_master_progress', JSON.stringify(newProgress));
  };

  const startQuiz = (topicId: TopicId) => {
    const questions = Array.from({ length: 5 }, () => generateQuestion(topicId, difficulty));
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setView('quiz');
    // Start timer automatically when quiz starts
    setTime(0);
    setIsTimerActive(true);
  };

  const startFlashcards = (topicId: TopicId) => {
    setFlashcards(generateFlashcards(topicId));
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setView('flashcards');
    // Start timer automatically when flashcards start
    setTime(0);
    setIsTimerActive(true);
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const correct = option === quizQuestions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setQuizScore(prev => prev + 1);
      // Play sound (optional)
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setQuizFinished(true);
      if (selectedTopic) {
        const newProgress = { ...progress };
        newProgress.scores[selectedTopic] += quizScore;
        newProgress.totalQuestions[selectedTopic] += quizQuestions.length;
        if (!newProgress.completedLessons.includes(selectedTopic) && quizScore >= 3) {
          newProgress.completedLessons.push(selectedTopic);
        }
        saveProgress(newProgress);
        if (quizScore >= 4) confetti();
      }
      setIsTimerActive(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Plus': return <Plus className="w-6 h-6" />;
      case 'Minus': return <Minus className="w-6 h-6" />;
      case 'X': return <X className="w-6 h-6" />;
      case 'Divide': return <Divide className="w-6 h-6" />;
      case 'Percent': return <Percent className="w-6 h-6" />;
      case 'Variable': return <Variable className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
              setView('dashboard');
              setIsTimerActive(false);
            }}>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Brain className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">MathMaster</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">
                  {(Object.values(progress.scores) as number[]).reduce((a, b) => a + b, 0)} Pts
                </span>
              </div>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
                  <p className="text-gray-500 mt-1">Ready to master some math today?</p>
                </div>
                <DifficultySelector selected={difficulty} onSelect={setDifficulty} />
              </header>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lessons Completed</p>
                    <p className="text-2xl font-bold">{progress.completedLessons.length} / {TOPICS.length}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Score</p>
                    <p className="text-2xl font-bold">{(Object.values(progress.scores) as number[]).reduce((a, b) => a + b, 0)}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                    <LayoutDashboard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Accuracy</p>
                    <p className="text-2xl font-bold">
                      {Math.round(((Object.values(progress.scores) as number[]).reduce((a, b) => a + b, 0) / 
                        ((Object.values(progress.totalQuestions) as number[]).reduce((a, b) => a + b, 0) || 1)) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Assistant Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Brain className="w-32 h-32" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                  <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                    <Brain className="w-10 h-10" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold mb-1">Confused about a topic?</h2>
                    <p className="text-blue-100">Ask our AI Math Assistant for help in Hinglish!</p>
                  </div>
                  <button className="sm:ml-auto px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
                    Chat with AI
                  </button>
                </div>
              </motion.div>

              {/* Topics Grid */}
              <section>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Learning Path
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {TOPICS.map((topic) => (
                    <motion.div
                      key={topic.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group cursor-pointer"
                      onClick={() => {
                        setSelectedTopic(topic.id);
                        setView('learning');
                      }}
                    >
                      <div className={`h-2 ${topic.color}`} />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`${topic.color} bg-opacity-10 p-3 rounded-xl text-gray-900`}>
                            {getIcon(topic.icon)}
                          </div>
                          {progress.completedLessons.includes(topic.id) && (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                        <h3 className="text-lg font-bold mb-2">{topic.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{topic.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {progress.completedLessons.includes(topic.id) ? 'Completed' : 'In Progress'}
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'learning' && selectedTopic && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <button 
                onClick={() => {
                  setView('dashboard');
                  setIsTimerActive(false);
                }}
                className="flex-items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </button>

              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`${TOPICS.find(t => t.id === selectedTopic)?.color} p-4 rounded-2xl text-white`}>
                    {getIcon(TOPICS.find(t => t.id === selectedTopic)?.icon || '')}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{TOPICS.find(t => t.id === selectedTopic)?.title}</h1>
                    <p className="text-gray-500">Lesson & Practice</p>
                  </div>
                </div>

                <div className="prose prose-blue max-w-none">
                  <h3 className="text-xl font-bold text-gray-900">What is it?</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {TOPIC_CONTENT[selectedTopic].explanation}
                  </p>

                  <h3 className="text-xl font-bold text-gray-900 mt-8">Examples</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {TOPIC_CONTENT[selectedTopic].examples.map((ex, i) => (
                      <div key={i} className="bg-blue-50 p-4 rounded-xl border border-blue-100 font-mono text-blue-700 text-center text-xl font-bold">
                        {ex}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Brain className="w-6 h-6 text-blue-600" />
                      <p className="text-sm font-medium text-gray-700">Still confused? Ask our AI Assistant for a simpler explanation!</p>
                    </div>
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                    >
                      Ask AI
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
                  <button 
                    onClick={() => startQuiz(selectedTopic)}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    <Brain className="w-5 h-5" /> Start Quiz
                  </button>
                  <button 
                    onClick={() => startFlashcards(selectedTopic)}
                    className="flex items-center justify-center gap-2 bg-white text-blue-600 border-2 border-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all"
                  >
                    <RotateCw className="w-5 h-5" /> Flashcards
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'quiz' && quizQuestions.length > 0 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              {!quizFinished ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </span>
                    <span className="text-sm font-bold text-gray-400">
                      Score: {quizScore}
                    </span>
                  </div>
                  
                  <ProgressBar progress={((currentQuestionIndex + 1) / quizQuestions.length) * 100} />

                  <div className="text-center py-8">
                    <h2 className="text-4xl font-bold text-gray-900">{quizQuestions[currentQuestionIndex].question}</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {quizQuestions[currentQuestionIndex].options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionSelect(option)}
                        disabled={selectedOption !== null}
                        className={`p-5 rounded-2xl text-left text-lg font-semibold border-2 transition-all ${
                          selectedOption === option
                            ? isCorrect
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : 'bg-red-50 border-red-500 text-red-700'
                            : selectedOption !== null && option === quizQuestions[currentQuestionIndex].correctAnswer
                              ? 'bg-green-50 border-green-500 text-green-700'
                              : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {selectedOption === option && (
                            isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedOption && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 p-6 rounded-2xl border border-gray-100"
                    >
                      <p className="text-sm font-bold text-gray-400 uppercase mb-2">Explanation</p>
                      <p className="text-gray-600">{quizQuestions[currentQuestionIndex].explanation}</p>
                      <button 
                        onClick={nextQuestion}
                        className="w-full mt-6 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all"
                      >
                        {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center space-y-8">
                  <div className="inline-block bg-blue-100 p-6 rounded-full text-blue-600 mb-4">
                    <Trophy className="w-16 h-16" />
                  </div>
                  <h2 className="text-4xl font-bold">Quiz Completed!</h2>
                  <div className="space-y-2">
                    <p className="text-6xl font-black text-blue-600">{quizScore} / {quizQuestions.length}</p>
                    <p className="text-gray-500 text-xl">
                      {quizScore === quizQuestions.length ? 'Perfect Score! 🌟' : 
                       quizScore >= 3 ? 'Great Job! 👍' : 'Keep Practicing! 💪'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-8">
                    <button 
                      onClick={() => selectedTopic && startQuiz(selectedTopic)}
                      className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={() => {
                        setView('dashboard');
                        setIsTimerActive(false);
                      }}
                      className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'flashcards' && flashcards.length > 0 && (
            <motion.div
              key="flashcards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto space-y-8"
            >
              <button 
                onClick={() => {
                  setView('learning');
                  setIsTimerActive(false);
                }}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Lesson
              </button>

              <div className="relative h-96 w-full perspective-1000">
                <motion.div
                  className="w-full h-full relative preserve-3d cursor-pointer"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  {/* Front */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl border-2 border-blue-100 shadow-xl flex flex-col items-center justify-center p-8 text-center">
                    <span className="absolute top-6 text-xs font-bold text-blue-400 uppercase tracking-widest">Question</span>
                    <h3 className="text-5xl font-bold text-gray-900">{flashcards[currentCardIndex].front}</h3>
                    <p className="mt-8 text-sm text-gray-400 flex items-center gap-2">
                      <RefreshCcw className="w-4 h-4" /> Click to flip
                    </p>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-blue-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center rotate-y-180">
                    <span className="absolute top-6 text-xs font-bold text-blue-200 uppercase tracking-widest">Answer</span>
                    <h3 className="text-7xl font-bold text-white">{flashcards[currentCardIndex].back}</h3>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <button 
                  onClick={() => {
                    setCurrentCardIndex(prev => Math.max(0, prev - 1));
                    setIsFlipped(false);
                  }}
                  disabled={currentCardIndex === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 py-4 rounded-2xl font-bold border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" /> Previous
                </button>
                <div className="text-gray-400 font-bold">
                  {currentCardIndex + 1} / {flashcards.length}
                </div>
                <button 
                  onClick={() => {
                    if (currentCardIndex < flashcards.length - 1) {
                      setCurrentCardIndex(prev => prev + 1);
                      setIsFlipped(false);
                    } else {
                      setView('learning');
                      setIsTimerActive(false);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  {currentCardIndex === flashcards.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Timer - Bottom for Dashboard/Learning, Top for Quiz/Flashcards */}
      <AnimatePresence>
        {((view === 'quiz' && !quizFinished) || view === 'flashcards' || view === 'dashboard' || view === 'learning') && (
          <div className={`fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${
            (view === 'quiz' || view === 'flashcards') ? 'top-20' : 'bottom-6'
          }`}>
            <motion.div 
              layout
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className={`bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full px-6 py-3 flex items-center gap-6 ${
                (view === 'quiz' || view === 'flashcards') ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
          <div className="flex items-center gap-2">
            <Timer className={`w-5 h-5 ${isTimerActive ? 'text-blue-600 animate-pulse' : 'text-gray-400'}`} />
            <span className="font-mono text-xl font-bold text-gray-900 min-w-[60px]">
              {formatTime(time)}
            </span>
          </div>
          
          <div className="h-6 w-px bg-gray-200" />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerActive(!isTimerActive)}
              className={`p-2 rounded-full transition-all ${
                isTimerActive 
                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
              title={isTimerActive ? "Pause Timer" : "Start Timer"}
            >
              {isTimerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => {
                setIsTimerActive(false);
                setTime(0);
              }}
              className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-all"
              title="Reset Timer"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
          
          <div className="hidden sm:block text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">
            Practice Timer
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

  <footer className="bg-white border-t border-gray-200 py-12 mt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="text-blue-600 w-6 h-6" />
            <span className="text-xl font-bold text-gray-900">MathMaster</span>
          </div>
          <p className="text-gray-500 text-sm">Empowering students through interactive mathematics.</p>
          <div className="mt-8 flex justify-center gap-6 text-gray-400">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <ChatBot />

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
