import { useState, useEffect, useCallback, useMemo } from 'react';
import { generateSuggestions } from '../utils/suggestionUtils';

interface UseSuggestionsProps {
  gameType: string;
  maxLength?: number;
  enabled?: boolean;
}

interface UseSuggestionsReturn {
  suggestions: string[];
  isLoading: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  updateInput: (input: string) => void;
  selectSuggestion: (suggestion: string) => void;
  clearSuggestions: () => void;
}

export const useSuggestions = ({
  gameType,
  maxLength,
  enabled = true
}: UseSuggestionsProps): UseSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentInput, setCurrentInput] = useState('');

  // Memoize the game type to prevent unnecessary re-renders
  const memoizedGameType = useMemo(() => gameType, [gameType]);

  // Update input and generate suggestions
  const updateInput = useCallback((input: string) => {
    setCurrentInput(input);
    
    if (!enabled) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // For single digit, always show suggestions regardless of input length
    if (memoizedGameType === 'SINGLE_DIGIT') {
      setIsLoading(true);
      setShowSuggestions(true);
      
      try {
        const newSuggestions = generateSuggestions(input, memoizedGameType, maxLength);
        setSuggestions(newSuggestions || []);
        setIsLoading(false);
            } catch (error) {
        setSuggestions([]);
        setIsLoading(false);
      }
      return;
    }

    // Don't show suggestions if input is empty or at max length (for other game types)
    if (!input.trim() || (maxLength && input.length >= maxLength)) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    setShowSuggestions(true);

    // Use immediate suggestion generation for better performance
    try {
      const newSuggestions = generateSuggestions(input, memoizedGameType, maxLength);
      setSuggestions(newSuggestions || []);
      setIsLoading(false);
    } catch (error) {
        setSuggestions([]);
        setIsLoading(false);
      }
  }, [enabled, maxLength, memoizedGameType]);

  // Select a suggestion
  const selectSuggestion = useCallback((suggestion: string) => {
    if (suggestion && typeof suggestion === 'string') {
      setCurrentInput(suggestion);
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  }, []);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowSuggestions(false);
    setIsLoading(false);
  }, []);

  // Auto-hide suggestions when input changes to empty
  useEffect(() => {
    if (!currentInput.trim()) {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [currentInput]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    };
  }, []);

  return {
    suggestions: suggestions || [],
    isLoading,
    showSuggestions,
    setShowSuggestions,
    updateInput,
    selectSuggestion,
    clearSuggestions,
  };
}; 