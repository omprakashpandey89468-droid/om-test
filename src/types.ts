export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type TopicId = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'fractions' | 'algebra';

export interface Topic {
  id: TopicId;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserProgress {
  completedLessons: TopicId[];
  scores: Record<TopicId, number>;
  totalQuestions: Record<TopicId, number>;
  streak: number;
  lastActive: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}
