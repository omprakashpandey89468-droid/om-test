import { Topic } from './types';

export const TOPICS: Topic[] = [
  {
    id: 'addition',
    title: 'Addition',
    description: 'Combining numbers to find the total sum.',
    icon: 'Plus',
    color: 'bg-blue-500',
  },
  {
    id: 'subtraction',
    title: 'Subtraction',
    description: 'Taking one number away from another.',
    icon: 'Minus',
    color: 'bg-green-500',
  },
  {
    id: 'multiplication',
    title: 'Multiplication',
    description: 'Repeated addition of the same number.',
    icon: 'X',
    color: 'bg-purple-500',
  },
  {
    id: 'division',
    title: 'Division',
    description: 'Splitting a number into equal parts.',
    icon: 'Divide',
    color: 'bg-orange-500',
  },
  {
    id: 'fractions',
    title: 'Fractions',
    description: 'Understanding parts of a whole.',
    icon: 'Percent',
    color: 'bg-red-500',
  },
  {
    id: 'algebra',
    title: 'Algebra',
    description: 'Using symbols and letters to represent numbers.',
    icon: 'Variable',
    color: 'bg-indigo-500',
  },
];

export const TOPIC_CONTENT: Record<string, { explanation: string; examples: string[] }> = {
  addition: {
    explanation: "Addition is the process of calculating the total of two or more numbers or amounts. It's like putting things together in a group.",
    examples: ["2 + 3 = 5", "10 + 15 = 25", "100 + 200 = 300"],
  },
  subtraction: {
    explanation: "Subtraction is taking one number away from another. It tells us what is left when some items are removed from a group.",
    examples: ["5 - 2 = 3", "20 - 7 = 13", "50 - 25 = 25"],
  },
  multiplication: {
    explanation: "Multiplication is a quick way of doing repeated addition. For example, 3 times 4 means adding 3 four times (3 + 3 + 3 + 3).",
    examples: ["3 × 4 = 12", "5 × 6 = 30", "10 × 10 = 100"],
  },
  division: {
    explanation: "Division is splitting a large group into smaller, equal groups. It's the opposite of multiplication.",
    examples: ["12 ÷ 3 = 4", "20 ÷ 5 = 4", "100 ÷ 10 = 10"],
  },
  fractions: {
    explanation: "A fraction represents a part of a whole. It consists of a numerator (top) and a denominator (bottom).",
    examples: ["1/2 (One half)", "3/4 (Three quarters)", "1/4 + 1/4 = 1/2"],
  },
  algebra: {
    explanation: "Algebra uses letters (like x or y) to represent unknown numbers in equations. It helps us solve problems where some information is missing.",
    examples: ["x + 5 = 10 (x = 5)", "2x = 8 (x = 4)", "y - 3 = 7 (y = 10)"],
  },
};
