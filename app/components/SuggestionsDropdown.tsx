import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme';

interface SuggestionsDropdownProps {
  visible: boolean;
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  inputValue: string;
  maxLength?: number;
  isLoading?: boolean;
}

const SuggestionsDropdown = memo(({
  visible,
  suggestions,
  onSelectSuggestion,
  inputValue,
  maxLength,
  isLoading = false,
}: SuggestionsDropdownProps) => {
  // Ensure suggestions is always an array
  const validSuggestions = Array.isArray(suggestions) ? suggestions : [];
  
  if (!visible || (validSuggestions.length === 0 && !isLoading)) {
    return null;
  }

  const handleSuggestionPress = (suggestion: string) => {
    if (suggestion && typeof suggestion === 'string') {
      onSelectSuggestion(suggestion);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading suggestions...</Text>
          </View>
        ) : (
          validSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={`${suggestion}-${index}`}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(suggestion)}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))
        )}
        
        {!isLoading && validSuggestions.length === 0 && inputValue.length > 0 && (
          <View style={styles.noSuggestionsContainer}>
            <Text style={styles.noSuggestionsText}>No suggestions available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
});

SuggestionsDropdown.displayName = 'SuggestionsDropdown';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.md,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollView: {
    maxHeight: 200,
  },
  suggestionItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  suggestionText: {
    fontSize: 16,
    color: theme.colors.black,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  noSuggestionsContainer: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  noSuggestionsText: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
});

export default SuggestionsDropdown; 