// src/hooks/useGameState.ts
import { useState, useEffect } from 'react';
import { type Character, selectRandomCharacter, getSelectionInfo } from '../utils/gameLogic';

interface GameState {
  currentDate: string;
  todaysCharacter: Character | null;
  guesses: Character[];
  hasWon: boolean;
  hasLost: boolean;
  isRevealed: boolean;
}

const MAX_GUESSES = 6;
const STORAGE_KEY_GAME = 'mazedle-game-state';

function getTodayDateString(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split('T')[0];
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GAME);
    const today = getTodayDateString();
    
    if (saved) {
      const state = JSON.parse(saved) as GameState;
      
      // Se é um novo dia, seleciona um novo personagem
      if (state.currentDate !== today) {
        const { character } = selectRandomCharacter();
        return {
          currentDate: today,
          todaysCharacter: character,
          guesses: [],
          hasWon: false,
          hasLost: false,
          isRevealed: false,
        };
      }
      
      return state;
    }
    
    // Primeira vez jogando - seleciona um personagem
    const { character } = selectRandomCharacter();
    return {
      currentDate: today,
      todaysCharacter: character,
      guesses: [],
      hasWon: false,
      hasLost: false,
      isRevealed: false,
    };
  });

  const currentDate = getTodayDateString();

  // Verifica se é um novo dia e seleciona novo personagem
  useEffect(() => {
    if (gameState.currentDate !== currentDate) {
      const { character, wasReset } = selectRandomCharacter();
      const newState: GameState = {
        currentDate,
        todaysCharacter: character,
        guesses: [],
        hasWon: false,
        hasLost: false,
        isRevealed: false,
      };
      setGameState(newState);
      localStorage.setItem(STORAGE_KEY_GAME, JSON.stringify(newState));
      
      if (wasReset) {
        console.log('🔄 Todos os personagens foram usados! Lista resetada.');
      }
    }
  }, [currentDate, gameState.currentDate]);

  // Salva o estado sempre que mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GAME, JSON.stringify(gameState));
  }, [gameState]);

  const makeGuess = (character: Character) => {
    if (gameState.hasWon || gameState.hasLost || !gameState.todaysCharacter) return;

    const newGuesses = [...gameState.guesses, character];
    const hasWon = character.id === gameState.todaysCharacter.id;
    const hasLost = !hasWon && newGuesses.length >= MAX_GUESSES;

    setGameState({
      ...gameState,
      guesses: newGuesses,
      hasWon,
      hasLost,
    });
  };

  const revealAnswer = () => {
    setGameState({
      ...gameState,
      isRevealed: true,
      hasLost: true,
    });
  };

  const resetGame = () => {
    const { character } = selectRandomCharacter();
    const newState: GameState = {
      currentDate,
      todaysCharacter: character,
      guesses: [],
      hasWon: false,
      hasLost: false,
      isRevealed: false,
    };
    setGameState(newState);
  };

  return {
    gameState,
    todaysCharacter: gameState.todaysCharacter,
    makeGuess,
    revealAnswer,
    resetGame,
    maxGuesses: MAX_GUESSES,
    selectionInfo: getSelectionInfo(),
  };
}