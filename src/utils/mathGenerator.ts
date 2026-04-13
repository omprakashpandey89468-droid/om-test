import { Difficulty, Question, TopicId, Flashcard } from '../types';

export const generateQuestion = (topic: TopicId, difficulty: Difficulty): Question => {
  let num1: number, num2: number, question: string, answer: number | string, options: string[], explanation: string;

  const range = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 50 : 100;

  switch (topic) {
    case 'addition':
      num1 = Math.floor(Math.random() * range) + 1;
      num2 = Math.floor(Math.random() * range) + 1;
      question = `${num1} + ${num2} = ?`;
      answer = num1 + num2;
      explanation = `To solve this, add ${num1} and ${num2} together.`;
      break;
    case 'subtraction':
      num1 = Math.floor(Math.random() * range) + range;
      num2 = Math.floor(Math.random() * range) + 1;
      question = `${num1} - ${num2} = ?`;
      answer = num1 - num2;
      explanation = `Subtract ${num2} from ${num1} to get the result.`;
      break;
    case 'multiplication':
      const multRange = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 15 : 20;
      num1 = Math.floor(Math.random() * multRange) + 1;
      num2 = Math.floor(Math.random() * multRange) + 1;
      question = `${num1} × ${num2} = ?`;
      answer = num1 * num2;
      explanation = `Multiply ${num1} by ${num2}. It's like adding ${num1}, ${num2} times.`;
      break;
    case 'division':
      const divRange = difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 10 : 15;
      num2 = Math.floor(Math.random() * divRange) + 1;
      answer = Math.floor(Math.random() * divRange) + 1;
      num1 = num2 * (answer as number);
      question = `${num1} ÷ ${num2} = ?`;
      explanation = `Find how many times ${num2} goes into ${num1}.`;
      break;
    case 'fractions':
      const den = Math.floor(Math.random() * 8) + 2;
      const num = Math.floor(Math.random() * (den - 1)) + 1;
      question = `Which is the decimal equivalent of ${num}/${den}? (Round to 2 decimal places)`;
      answer = (num / den).toFixed(2);
      explanation = `Divide the numerator (${num}) by the denominator (${den}).`;
      break;
    case 'algebra':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      const x = Math.floor(Math.random() * 10) + 1;
      const result = num1 * x + num2;
      question = `Solve for x: ${num1}x + ${num2} = ${result}`;
      answer = x.toString();
      explanation = `Subtract ${num2} from ${result}, then divide by ${num1}.`;
      break;
    default:
      num1 = 0; num2 = 0; question = ''; answer = 0; explanation = '';
  }

  // Generate options
  const correct = answer.toString();
  const distractors = new Set<string>();
  while (distractors.size < 3) {
    let dist: string;
    if (typeof answer === 'number') {
      dist = (answer + (Math.floor(Math.random() * 10) - 5)).toString();
    } else if (topic === 'fractions') {
      dist = (parseFloat(answer) + (Math.random() * 0.4 - 0.2)).toFixed(2);
    } else {
      dist = (parseInt(answer) + (Math.floor(Math.random() * 6) - 3)).toString();
    }
    if (dist !== correct && dist !== 'NaN') distractors.add(dist);
  }

  options = [correct, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

  return {
    id: Math.random().toString(36).substr(2, 9),
    question,
    options,
    correctAnswer: correct,
    explanation,
  };
};

export const generateFlashcards = (topic: TopicId, count: number = 10): Flashcard[] => {
  const cards: Flashcard[] = [];
  for (let i = 0; i < count; i++) {
    const q = generateQuestion(topic, 'Easy');
    cards.push({
      id: q.id,
      front: q.question,
      back: q.correctAnswer,
    });
  }
  return cards;
};
