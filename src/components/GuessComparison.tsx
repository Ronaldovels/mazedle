// src/components/GuessComparison.tsx
import { type Character } from '../utils/gameLogic';

type ComparisonResult = 'correct' | 'incorrect' | 'partial';

interface GuessComparisonProps {
  guess: Character;
  target: Character;
}

interface AttributeComparison {
  label: string;
  value: string | number;
  result: ComparisonResult;
}

function compareAttribute(
  guessValue: string | number,
  targetValue: string | number,
  allowPartial: boolean = false
): ComparisonResult {
  if (guessValue === targetValue) {
    return 'correct';
  }
  
  // Para atributos que podem ter correspondência parcial
  if (allowPartial && typeof guessValue === 'string' && typeof targetValue === 'string') {
    const guessLower = guessValue.toLowerCase();
    const targetLower = targetValue.toLowerCase();
    
    // Verifica se há alguma palavra em comum
    const guessWords = guessLower.split(/[\s,()]+/).filter(w => w.length > 0);
    const targetWords = targetLower.split(/[\s,()]+/).filter(w => w.length > 0);
    const hasCommonWord = guessWords.some(word => targetWords.includes(word));
    
    if (hasCommonWord) {
      return 'partial';
    }
  }
  
  return 'incorrect';
}

export function GuessComparison({ guess, target }: GuessComparisonProps) {
  const comparisons: AttributeComparison[] = [
    {
      label: 'Name',
      value: guess.name,
      result: compareAttribute(guess.name, target.name),
    },
    {
      label: 'Gender',
      value: guess.gender,
      result: compareAttribute(guess.gender, target.gender),
    },
    {
      label: 'Age',
      value: guess.age,
      result: compareAttribute(guess.age, target.age),
    },
    {
      label: 'First Appearance',
      value: guess.firstAppearence,
      result: compareAttribute(guess.firstAppearence, target.firstAppearence),
    },
    {
      label: 'Role',
      value: guess.role,
      result: compareAttribute(guess.role, target.role, true),
    },
    {
      label: 'Group',
      value: guess.group,
      result: compareAttribute(guess.group, target.group, true),
    },
    {
      label: 'Status',
      value: guess.status,
      result: compareAttribute(guess.status, target.status),
    },
    {
      label: 'Survival',
      value: guess.survival,
      result: compareAttribute(guess.survival, target.survival),
    },
  ];

  const getColorClass = (result: ComparisonResult): string => {
    switch (result) {
      case 'correct':
        return 'bg-green-600 text-white border-green-700';
      case 'partial':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'incorrect':
        return 'bg-red-600 text-white border-red-700';
    }
  };

  const getIcon = (result: ComparisonResult): string => {
    switch (result) {
      case 'correct':
        return '✓';
      case 'partial':
        return '~';
      case 'incorrect':
        return '✗';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 p-4 bg-stone-900/50 rounded-lg border-2 border-stone-700">
      {comparisons.map((comp, index) => (
        <div
          key={index}
          className={`${getColorClass(comp.result)} p-3 rounded-md text-center transition-all duration-300 transform hover:scale-105 border-2 shadow-lg`}
        >
          <div className="text-xs font-bold mb-1 opacity-90 uppercase tracking-wide">
            {comp.label}
          </div>
          <div className="font-bold text-sm break-words">
            {comp.value}
          </div>
          <div className="text-xl mt-1">
            {getIcon(comp.result)}
          </div>
        </div>
      ))}
    </div>
  );
}