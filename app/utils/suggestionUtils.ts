// Memory and Performance Efficient Suggestion System
// Uses caching, debouncing, and optimized generation algorithms

interface SuggestionCache {
  suggestions: string[];
  timestamp: number;
}

// Cache for storing generated suggestions
const suggestionCache: Map<string, SuggestionCache> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Maximum number of cached entries
const MAX_SUGGESTIONS = 8; // Reduced for better performance

// Debounce function to prevent excessive API calls
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_DELAY = 150; // Reduced delay for faster response

export const debounce = (func: Function, delay: number) => {
  return (...args: any[]) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(null, args), delay);
  };
};

// Generate suggestions based on game type and current input
export const generateSuggestions = (
  input: string,
  gameType: string,
  maxLength?: number
): string[] => {
  const cacheKey = `${gameType}_${input}_${maxLength || ''}`;
  
  // Check cache first
  const cached = suggestionCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.suggestions;
  }

  let suggestions: string[] = [];

  switch (gameType) {
    case 'SINGLE_DIGIT':
      suggestions = generateSingleDigitSuggestions(input);
      break;
    case 'JODI_DIGIT':
      suggestions = generateJodiDigitSuggestions(input);
      break;
    case 'SINGLE_PANNA':
      suggestions = generatePannaSuggestions(input, 3);
      break;
    case 'DOUBLE_PANNA':
      suggestions = generatePannaSuggestions(input, 3);
      break;
    case 'TRIPLE_PANNA':
      suggestions = generatePannaSuggestions(input, 3);
      break;
    case 'HALF_SANGAM':
      suggestions = generateHalfSangamSuggestions(input);
      break;
    case 'FULL_SANGAM':
      suggestions = generateFullSangamSuggestions(input);
      break;
    case 'AMOUNT':
      suggestions = []; // No suggestions for amount fields
      break;
    default:
      suggestions = generateGenericSuggestions(input, maxLength);
  }

  // Limit suggestions for performance
  suggestions = suggestions.slice(0, MAX_SUGGESTIONS);

  // Cache the result
  cacheSuggestion(cacheKey, suggestions);

  return suggestions;
};

// Generate suggestions for single digit (0-9) - Simple array approach
const generateSingleDigitSuggestions = (input: string): string[] => {
  // Always return the simple array of digits as requested
  return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
};

// Generate suggestions for jodi digit (00-99)
const generateJodiDigitSuggestions = (input: string): string[] => {
  if (input.length >= 2) return [];
  
  const suggestions: string[] = [];
  
  if (input.length === 0) {
    // Generate common jodi patterns
    for (let i = 0; i <= 9; i++) {
      suggestions.push(`${i}${i}`); // Same digits
    }
    // Add some popular combinations
    suggestions.push('12', '23', '34', '45', '56', '67', '78', '89', '90', '01');
  } else if (input.length === 1) {
    // Complete the jodi based on first digit
    const firstDigit = parseInt(input);
    for (let i = 0; i <= 9; i++) {
      suggestions.push(`${input}${i}`);
    }
  }
  
  return suggestions;
};

// Generate suggestions for panna (000-999) with pattern-based approach
const generatePannaSuggestions = (input: string, length: number): string[] => {
  if (input.length >= length) return [];
  
  const suggestions: string[] = [];
  
  if (input.length === 0) {
    // Generate common panna patterns
    for (let i = 0; i <= 9; i++) {
      suggestions.push(`${i}${i}${i}`); // Same digits
    }
    // Add sequential patterns
    suggestions.push('123', '234', '345', '456', '567', '678', '789', '890', '901', '012');
    // Add popular combinations
    suggestions.push('000', '111', '222', '333', '444', '555', '666', '777', '888', '999');
  } else {
    // Pattern-based completion: if user enters "N", show "N123", "N456", etc.
    const base = input;
    const patterns = [
      '123', '456', '789', '012', '345', '678', '901', '234', '567', '890'
    ];
    
    for (const pattern of patterns) {
      const suggestion = base + pattern.substring(input.length);
      if (suggestion.length <= length) {
        suggestions.push(suggestion);
      }
    }
    
    // Also add some random completions
    for (let i = 0; i < 5; i++) {
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const suggestion = base + randomSuffix.substring(input.length);
      if (suggestion.length <= length && !suggestions.includes(suggestion)) {
        suggestions.push(suggestion);
      }
    }
  }
  
  return suggestions;
};

// Generate suggestions for half sangam
const generateHalfSangamSuggestions = (input: string): string[] => {
  const suggestions: string[] = [];
  
  // Common half sangam patterns
  if (input.length === 0) {
    suggestions.push('0-123', '1-234', '2-345', '3-456', '4-567', '5-678', '6-789', '7-890', '8-901', '9-012');
    suggestions.push('123-0', '234-1', '345-2', '456-3', '567-4', '678-5', '789-6', '890-7', '901-8', '012-9');
  } else if (input.includes('-')) {
    // User is typing after the dash
    const parts = input.split('-');
    if (parts.length === 2) {
      const beforeDash = parts[0];
      const afterDash = parts[1];
      
      if (beforeDash.length === 1 && afterDash.length < 3) {
        // Format: digit-panna
        const patterns = ['123', '456', '789', '012', '345', '678', '901', '234', '567', '890'];
        for (const pattern of patterns) {
          const suggestion = `${beforeDash}-${afterDash}${pattern.substring(afterDash.length)}`;
          if (suggestion.length <= 5) { // digit-panna format
            suggestions.push(suggestion);
          }
        }
      } else if (beforeDash.length === 3 && afterDash.length < 1) {
        // Format: panna-digit
        for (let i = 0; i <= 9; i++) {
          suggestions.push(`${beforeDash}-${i}`);
        }
      }
    }
  } else {
    // User is typing before the dash
    if (input.length === 1) {
      // Single digit, suggest panna after dash
      const patterns = ['123', '456', '789', '012', '345', '678', '901', '234', '567', '890'];
      for (const pattern of patterns) {
        suggestions.push(`${input}-${pattern}`);
      }
    } else if (input.length === 3) {
      // Three digits, suggest single digit after dash
      for (let i = 0; i <= 9; i++) {
        suggestions.push(`${input}-${i}`);
      }
    }
  }
  
  return suggestions;
};

// Generate suggestions for full sangam
const generateFullSangamSuggestions = (input: string): string[] => {
  const suggestions: string[] = [];
  
  if (input.length === 0) {
    // Common full sangam patterns
    suggestions.push('000-000', '111-111', '222-222', '333-333', '444-444');
    suggestions.push('123-456', '234-567', '345-678', '456-789', '567-890');
  } else if (input.includes('-')) {
    // User is typing after the dash
    const parts = input.split('-');
    if (parts.length === 2) {
      const beforeDash = parts[0];
      const afterDash = parts[1];
      
      if (beforeDash.length === 3 && afterDash.length < 3) {
        // Complete the second panna with patterns
        const patterns = ['123', '456', '789', '012', '345', '678', '901', '234', '567', '890'];
        for (const pattern of patterns) {
          const suggestion = `${beforeDash}-${afterDash}${pattern.substring(afterDash.length)}`;
          if (suggestion.length <= 7) { // panna-panna format
            suggestions.push(suggestion);
          }
        }
      }
    }
  } else {
    // User is typing before the dash
    if (input.length === 3) {
      // Three digits entered, suggest second panna after dash
      const patterns = ['123', '456', '789', '012', '345', '678', '901', '234', '567', '890'];
      for (const pattern of patterns) {
        suggestions.push(`${input}-${pattern}`);
      }
    }
  }
  
  return suggestions;
};

// Generate generic suggestions for unknown game types
const generateGenericSuggestions = (input: string, maxLength?: number): string[] => {
  const suggestions: string[] = [];
  const length = maxLength || 3;
  
  if (input.length >= length) return [];
  
  // Generate sequential numbers
  for (let i = 0; i < Math.min(10, Math.pow(10, length - input.length)); i++) {
    const suffix = i.toString().padStart(length - input.length, '0');
    suggestions.push(`${input}${suffix}`);
  }
  
  return suggestions;
};

// Cache management
const cacheSuggestion = (key: string, suggestions: string[]) => {
  // Clean old cache entries if cache is too large
  if (suggestionCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = suggestionCache.keys().next().value;
    suggestionCache.delete(oldestKey);
  }
  
  suggestionCache.set(key, {
    suggestions,
    timestamp: Date.now()
  });
};

// Clear expired cache entries
export const clearExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of suggestionCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      suggestionCache.delete(key);
    }
  }
};

// Clear all cache
export const clearAllCache = () => {
  suggestionCache.clear();
};

// Get cache statistics (for debugging)
export const getCacheStats = () => {
  return {
    size: suggestionCache.size,
    maxSize: MAX_CACHE_SIZE,
    duration: CACHE_DURATION
  };
};

// Optimized suggestion generation with debouncing
export const getSuggestionsDebounced = debounce(
  (input: string, gameType: string, maxLength?: number): string[] => {
    return generateSuggestions(input, gameType, maxLength);
  },
  DEBOUNCE_DELAY
); 