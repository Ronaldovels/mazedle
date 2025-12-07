// src/App.tsx
import { useGameState } from './hooks/useGameState';
import { ResetTimer } from './components/ResetTimer';
import { CharacterSearch } from './components/CharacterSearch';
import { GuessList } from './components/GuessList';

function App() {
  const { 
    gameState, 
    todaysCharacter, 
    makeGuess, 
    revealAnswer, 
    maxGuesses,
    selectionInfo 
  } = useGameState();

  // IDs dos personagens já tentados para não aparecerem na busca
  const guessedIds = gameState.guesses.map(g => g.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-zinc-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2 tracking-tight">
            MAZEDLE
          </h1>
          <p className="text-stone-400 text-lg font-medium">
            Guess the Glader of the day!
          </p>
          <div className="mt-2 text-stone-500 text-sm italic">
            "WICKED is good... or is it?"
          </div>
        </header>

        {/* Timer */}
        <div className="bg-stone-800/80 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-stone-700 p-6 mb-6 text-center">
          <ResetTimer />
        </div>

        {/* Game Info */}
        <div className="bg-stone-800/80 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-stone-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-stone-200">
              <span className="font-bold text-green-400">Attempts:</span>{' '}
              <span className={`font-mono text-lg ${gameState.guesses.length === maxGuesses ? 'text-red-400' : 'text-green-400'}`}>
                {gameState.guesses.length} / {maxGuesses}
              </span>
            </div>
            <div className="text-sm text-stone-400 font-medium">
              <span className="text-stone-300">Gladers Used:</span> {selectionInfo.usedCount} / {selectionInfo.totalCount}
            </div>
          </div>
        </div>

        {/* Victory Message */}
        {gameState.hasWon && (
          <div className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 backdrop-blur-sm border-2 border-green-500 rounded-lg p-6 mb-6 text-center shadow-2xl animate-pulse">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-3xl font-bold text-green-300 mb-2">
              You escaped the Maze!
            </h2>
            <p className="text-green-200 text-lg mt-2">
              The Glader was <span className="font-bold text-white">{todaysCharacter?.name}</span>
            </p>
            <p className="text-sm text-green-400 mt-3 font-medium">
              Solved in {gameState.guesses.length} attempt{gameState.guesses.length !== 1 ? 's' : ''}!
            </p>
          </div>
        )}

        {/* Defeat Message */}
        {gameState.hasLost && !gameState.hasWon && todaysCharacter && (
          <div className="bg-gradient-to-r from-red-900/80 to-rose-900/80 backdrop-blur-sm border-2 border-red-500 rounded-lg p-6 mb-6 text-center shadow-2xl">
            <div className="text-5xl mb-3">💀</div>
            <h2 className="text-3xl font-bold text-red-300 mb-2">
              The Grievers got you!
            </h2>
            <p className="text-red-200 text-lg mt-2">
              The Glader was <span className="font-bold text-white">{todaysCharacter.name}</span>
            </p>
            <p className="text-sm text-red-400 mt-2 italic">
              Better luck tomorrow, Greenie.
            </p>
          </div>
        )}

        {/* Search Input */}
        {!gameState.hasWon && !gameState.hasLost && (
          <div className="bg-stone-800/80 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-stone-700 p-6 mb-6">
            <label className="block text-sm font-bold text-green-400 mb-3 uppercase tracking-wide">
              Who is the Glader?
            </label>
            <CharacterSearch
              onSelect={makeGuess}
              disabled={gameState.hasWon || gameState.hasLost}
              excludeIds={guessedIds}
            />
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-stone-400">
                Type to search and select a character
              </p>
              <button
                onClick={revealAnswer}
                className="px-5 py-2 text-sm font-semibold bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg transition-all duration-200 border-2 border-stone-600 hover:border-stone-500 shadow-lg"
              >
                Give Up
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-stone-800/80 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-stone-700 p-4 mb-6">
          <h3 className="font-bold mb-3 text-sm text-green-400 uppercase tracking-wide">Legend:</h3>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded border-2 border-green-700 flex items-center justify-center text-white font-bold shadow-lg">
                ✓
              </div>
              <span className="text-stone-300 font-medium">Correct</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 rounded border-2 border-yellow-600 flex items-center justify-center text-white font-bold shadow-lg">
                ~
              </div>
              <span className="text-stone-300 font-medium">Partial Match</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded border-2 border-red-700 flex items-center justify-center text-white font-bold shadow-lg">
                ✗
              </div>
              <span className="text-stone-300 font-medium">Incorrect</span>
            </div>
          </div>
        </div>

        {/* Guesses List */}
        {todaysCharacter && (
          <div className="bg-stone-800/80 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-stone-700 p-6 mb-6">
            <GuessList guesses={gameState.guesses} target={todaysCharacter} />
          </div>
        )}

        {/* Other Games Section */}
        <footer className="mt-12 pt-8 border-t-2 border-stone-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-stone-300 mb-4">
              Try my other games!
            </h3>
            <a
              href="https://breakingbadle.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-stone-700 to-stone-600 hover:from-stone-600 hover:to-stone-500 text-stone-100 font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-stone-500 hover:border-stone-400"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧪</span>
                <div className="text-left">
                  <div className="text-xl">Breaking Badle</div>
                  <div className="text-sm text-stone-300 font-normal">Guess Breaking Bad characters!</div>
                </div>
                <span className="text-xl">→</span>
              </div>
            </a>
            <p className="text-stone-500 text-sm mt-4">
              More character guessing games coming soon...
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;