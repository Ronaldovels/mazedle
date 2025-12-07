// src/components/GuessList.tsx
import { type Character } from '../utils/gameLogic';
import { GuessComparison } from './GuessComparison';

interface GuessListProps {
  guesses: Character[];
  target: Character;
}

export function GuessList({ guesses, target }: GuessListProps) {
  if (guesses.length === 0) {
    return (
      <div className="text-center text-stone-400 py-8 italic">
        Make your first guess, Greenie...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4 text-green-400 uppercase tracking-wide">Your Attempts:</h2>
      {guesses.map((guess, index) => (
        <div key={index} className="animate-fade-in">
          <div className="text-sm text-stone-400 mb-2 font-medium">
            Attempt #{index + 1}
          </div>
          <GuessComparison guess={guess} target={target} />
        </div>
      ))}
    </div>
  );
}