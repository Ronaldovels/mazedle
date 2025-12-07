// src/components/CharacterSearch.tsx
import { useState, useRef, useEffect } from 'react';
import { type Character, characters } from '../utils/gameLogic';

interface CharacterSearchProps {
  onSelect: (character: Character) => void;
  disabled?: boolean;
  excludeIds?: number[];
}

export function CharacterSearch({ onSelect, disabled = false, excludeIds = [] }: CharacterSearchProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtra personagens baseado na busca
  const filteredCharacters = characters.filter(char => 
    !excludeIds.includes(char.id) &&
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  // Fecha dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (character: Character) => {
    onSelect(character);
    setSearch('');
    setIsOpen(false);
    setSelectedIndex(0);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && filteredCharacters.length > 0) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
    }

    if (isOpen && filteredCharacters.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCharacters.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCharacters[selectedIndex]) {
            handleSelect(filteredCharacters[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
          setSelectedIndex(0);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Search for a Glader..."
        className="w-full px-4 py-3 text-lg bg-stone-900 text-stone-100 border-2 border-stone-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/50 disabled:bg-stone-800 disabled:cursor-not-allowed placeholder-stone-500 transition-all"
      />
      
      {isOpen && search && filteredCharacters.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-2 bg-stone-900 border-2 border-stone-600 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
        >
          {filteredCharacters.map((char, index) => (
            <button
              key={char.id}
              onClick={() => handleSelect(char)}
              className={`w-full px-4 py-3 text-left text-stone-200 hover:bg-green-900/50 hover:text-green-300 transition-all font-medium ${
                index === selectedIndex ? 'bg-green-900/30 text-green-400' : ''
              } ${index !== filteredCharacters.length - 1 ? 'border-b border-stone-700' : ''}`}
            >
              {char.name}
            </button>
          ))}
        </div>
      )}

      {isOpen && search && filteredCharacters.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-stone-900 border-2 border-stone-600 rounded-lg shadow-2xl p-4 text-stone-400 text-center italic">
          No Glader found in the records
        </div>
      )}
    </div>
  );
}