import React, { useState, useRef, forwardRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSuggestions } from '../hooks/useSuggestions';
import SuggestionsDropdown from './SuggestionsDropdown';
import { theme } from '../theme';

interface SuggestiveInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  maxLength?: number;
  editable?: boolean;
  gameType: string;
  style?: any;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  returnKeyType?: 'done' | 'next' | 'search';
  onSubmitEditing?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
}

const SuggestiveInput = forwardRef<TextInput, SuggestiveInputProps>(({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = theme.colors.textTertiary,
  keyboardType = 'default',
  maxLength,
  editable = true,
  gameType,
  style,
  onFocus,
  onBlur,
  autoFocus = false,
  returnKeyType = 'done',
  onSubmitEditing,
  multiline = false,
  numberOfLines = 1,
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const {
    suggestions,
    isLoading,
    updateInput,
    selectSuggestion,
    clearSuggestions,
  } = useSuggestions({
    gameType,
    maxLength,
    enabled: editable && isFocused,
  });

  const handleTextChange = (text: string) => {
    onChangeText(text);
    updateInput(text);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setShowSuggestions(false);
      clearSuggestions();
    }, 200);
    onBlur?.();
  };

  const handleSuggestionSelect = (suggestion: string) => {
    if (suggestion && typeof suggestion === 'string') {
      onChangeText(suggestion);
      selectSuggestion(suggestion);
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    onChangeText('');
    clearSuggestions();
  };

  // Only show suggestions if we have valid suggestions and input is focused
  const shouldShowSuggestions = showSuggestions && isFocused && suggestions.length > 0;

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, style]}>
        <TextInput
          ref={ref}
          style={[styles.input, { color: theme.colors.text }]}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus={autoFocus}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {value.length > 0 && editable && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
      
      <SuggestionsDropdown
        visible={shouldShowSuggestions}
        suggestions={suggestions}
        onSelectSuggestion={handleSuggestionSelect}
        inputValue={value}
        maxLength={maxLength}
        isLoading={isLoading}
      />
    </View>
  );
});

SuggestiveInput.displayName = 'SuggestiveInput';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
});

export default SuggestiveInput; 