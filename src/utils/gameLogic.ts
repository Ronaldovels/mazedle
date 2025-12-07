// src/utils/gameLogic.ts
export interface Character {
  id: number;
  name: string;
  gender: string;
  age: number;
  firstAppearence: string;
  role: string; // Glader, Runner, Med-jack, Builder, etc.
  group: string; // Group A, Group B, Right Arm, WICKED
  status: string; // Immune, Not Immune, Crank
  survival: string; // Survived, Deceased
}

// Sua lista expandida de personagens
export const characters: Character[] = [
  {
    id: 1,
    name: "Thomas",
    gender: "Male",
    age: 18,
    firstAppearence: "The Maze Runner",
    role: "Runner",
    group: "Group A (Glade)",
    status: "Immune",
    survival: "Survived",
  },
  {
    id: 2,
    name: "Newt",
    gender: "Male",
    age: 18,
    firstAppearence: "The Maze Runner",
    role: "Second-in-Command",
    group: "Group A (Glade)",
    status: "Not Immune",
    survival: "Deceased",
  },
  {
    id: 3,
    name: "Teresa Agnes",
    gender: "Female",
    age: 18,
    firstAppearence: "The Maze Runner",
    role: "Trigger",
    group: "Group A (Glade)",
    status: "Immune",
    survival: "Deceased",
  },
  {
    id: 4,
    name: "Minho",
    gender: "Male",
    age: 20,
    firstAppearence: "The Maze Runner",
    role: "Keeper of the Runners",
    group: "Group A (Glade)",
    status: "Immune",
    survival: "Survived",
  },
  {
    id: 5,
    name: "Gally",
    gender: "Male",
    age: 19,
    firstAppearence: "The Maze Runner",
    role: "Builder",
    group: "Group A (Glade)",
    status: "Immune",
    survival: "Survived",
  },
  {
    id: 6,
    name: "Alby",
    gender: "Male",
    age: 19,
    firstAppearence: "The Maze Runner",
    role: "Leader",
    group: "Group A (Glade)",
    status: "Not Immune",
    survival: "Deceased",
  },
  {
    id: 7,
    name: "Chuck",
    gender: "Male",
    age: 13,
    firstAppearence: "The Maze Runner",
    role: "Slopper",
    group: "Group A (Glade)",
    status: "Unknown",
    survival: "Deceased",
  },
  {
    id: 8,
    name: "Frypan",
    gender: "Male",
    age: 18,
    firstAppearence: "The Maze Runner",
    role: "Cook",
    group: "Group A (Glade)",
    status: "Immune",
    survival: "Survived",
  },
  {
    id: 9,
    name: "Brenda",
    gender: "Female",
    age: 19,
    firstAppearence: "The Scorch Trials",
    role: "Guide",
    group: "Right Arm",
    status: "Immune",
    survival: "Survived",
  },
  {
    id: 10,
    name: "Jorge",
    gender: "Male",
    age: 45,
    firstAppearence: "The Scorch Trials",
    role: "Pilot",
    group: "Right Arm",
    status: "Unknown",
    survival: "Survived",
  },
  {
    id: 11,
    name: "Aris Jones",
    gender: "Male",
    age: 17,
    firstAppearence: "The Scorch Trials",
    role: "Subject",
    group: "Group B",
    status: "Immune",
    survival: "Survived",
  },
  {
    id: 12,
    name: "Sonya",
    gender: "Female",
    age: 18,
    firstAppearence: "The Scorch Trials",
    role: "Leader",
    group: "Group B",
    status: "Immune",
    survival: "Survived",
  },
  {
    id: 13,
    name: "Harriet",
    gender: "Female",
    age: 18,
    firstAppearence: "The Scorch Trials",
    role: "Second-in-Command",
    group: "Group B",
    status: "Immune",
    survival: "Survived",
  },
  {
    id: 14,
    name: "Ava Paige",
    gender: "Female",
    age: 50,
    firstAppearence: "The Maze Runner",
    role: "Chancellor",
    group: "WICKED",
    status: "Unknown",
    survival: "Deceased",
  },
  {
    id: 15,
    name: "Janson (Rat Man)",
    gender: "Male",
    age: 48,
    firstAppearence: "The Scorch Trials",
    role: "Assistant Director",
    group: "WICKED",
    status: "Not Immune",
    survival: "Deceased",
  },
  {
    id: 16,
    name: "Vince",
    gender: "Male",
    age: 42,
    firstAppearence: "The Scorch Trials",
    role: "Leader",
    group: "Right Arm",
    status: "Immune",
    survival: "Survived",
  },
];

interface CharacterSelectionState {
  selectedIds: number[];
  lastResetDate: string;
}

const STORAGE_KEY_SELECTION = 'mazedle-character-selection';

/**
 * Retorna a data atual no formato YYYY-MM-DD
 */
function getTodayDateString(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split('T')[0];
}

/**
 * Carrega o estado de seleção do localStorage
 */
function loadSelectionState(): CharacterSelectionState {
  const saved = localStorage.getItem(STORAGE_KEY_SELECTION);
  if (saved) {
    const state = JSON.parse(saved) as CharacterSelectionState;
    
    // Se passou 24h desde o último reset, não reseta automaticamente
    // apenas retorna o estado atual
    return state;
  }
  
  return {
    selectedIds: [],
    lastResetDate: getTodayDateString(),
  };
}

/**
 * Salva o estado de seleção no localStorage
 */
function saveSelectionState(state: CharacterSelectionState): void {
  localStorage.setItem(STORAGE_KEY_SELECTION, JSON.stringify(state));
}

/**
 * Seleciona um personagem aleatório que ainda não foi usado
 * Se todos foram usados, reseta a lista e escolhe um novo
 */
export function selectRandomCharacter(): { character: Character; wasReset: boolean } {
  let state = loadSelectionState();
  let wasReset = false;
  
  // Se todos os personagens já foram selecionados, reseta a lista
  if (state.selectedIds.length >= characters.length) {
    state = {
      selectedIds: [],
      lastResetDate: getTodayDateString(),
    };
    wasReset = true;
  }
  
  // Filtra personagens ainda não selecionados
  const availableCharacters = characters.filter(
    char => !state.selectedIds.includes(char.id)
  );
  
  // Seleciona um aleatório dos disponíveis
  const randomIndex = Math.floor(Math.random() * availableCharacters.length);
  const selectedCharacter = availableCharacters[randomIndex];
  
  // Atualiza o estado com o novo personagem selecionado
  state.selectedIds.push(selectedCharacter.id);
  state.lastResetDate = getTodayDateString();
  saveSelectionState(state);
  
  return { character: selectedCharacter, wasReset };
}

/**
 * Retorna informações sobre o estado atual da seleção
 */
export function getSelectionInfo() {
  const state = loadSelectionState();
  return {
    usedCount: state.selectedIds.length,
    totalCount: characters.length,
    remainingCount: characters.length - state.selectedIds.length,
    lastResetDate: state.lastResetDate,
  };
}

/**
 * Reseta manualmente a lista de personagens selecionados
 */
export function resetCharacterSelection(): void {
  const state: CharacterSelectionState = {
    selectedIds: [],
    lastResetDate: getTodayDateString(),
  };
  saveSelectionState(state);
}

/**
 * Retorna a data/hora do próximo reset (meia-noite)
 */
export function getNextResetTime(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

/**
 * Calcula o tempo restante até o próximo reset
 */
export function getTimeUntilReset(): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const nextReset = getNextResetTime();
  const diff = nextReset.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
}