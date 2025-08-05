/**
 * Application Styles Module
 * Comprehensive stylesheet for all components with responsive design considerations
 */
import { StyleSheet, Dimensions } from 'react-native';

// Device dimensions for responsive layout calculations
const { width, height } = Dimensions.get('window');

/**
 * Centralized stylesheet containing all component styles
 * Organized by component and functionality for maintainability
 */
export default StyleSheet.create({
  // Base container and layout styles
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  
  // Typography and header styles
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },

  // Quiz game component styles
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  scoreContainer: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  questionCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  countryText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  
  optionsContainer: {
    marginBottom: 20,
  },
  
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  
  optionButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  
  optionButtonCorrect: {
    borderColor: '#28a745',
    backgroundColor: '#d4edda',
  },
  
  optionButtonIncorrect: {
    borderColor: '#dc3545',
    backgroundColor: '#f8d7da',
  },
  
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  optionTextCorrect: {
    color: '#155724',
    fontWeight: 'bold',
  },
  
  optionTextIncorrect: {
    color: '#721c24',
    fontWeight: 'bold',
  },
  
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  feedbackContainer: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  
  feedbackCorrect: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  
  feedbackIncorrect: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  
  feedbackText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  feedbackTextCorrect: {
    color: '#155724',
  },
  
  feedbackTextIncorrect: {
    color: '#721c24',
  },

  // Database screen styles
  clearButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  
  answersList: {
    flex: 1,
  },
  
  incorrectAnswerItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  
  incorrectAnswerText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  
  correctAnswerText: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  timestampText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },

  // New styles for all answers display
  correctAnswerContainer: {
    borderLeftColor: '#28a745',
    borderLeftWidth: 4,
  },
  
  incorrectAnswerContainer: {
    borderLeftColor: '#dc3545',
    borderLeftWidth: 4,
  },
  
  answerHeader: {
    marginBottom: 8,
  },
  
  answerStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  
  correctStatus: {
    color: '#28a745',
  },
  
  incorrectStatus: {
    color: '#dc3545',
  },

  // API screen styles
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  picker: {
    height: 50,
  },
  
  weatherButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  
  weatherButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  weatherCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  weatherTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  
  weatherInfo: {
    marginBottom: 10,
  },
  
  weatherLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  
  weatherValue: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Navigation button styles
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 20,
  },
  
  navButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
  },
  
  navButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Results screen styles
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  statItem: {
    alignItems: 'center',
  },
  
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  
  startNewGameButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  startNewGameButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  gameResultItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  
  gameResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  gameNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  
  scorePercentage: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  goodScore: {
    color: '#28a745',
  },
  
  poorScore: {
    color: '#dc3545',
  },
  
  gameResultScore: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  
  gameResultDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  
  resultsLiveListPlaceholder: {
    flex: 1,
  },
  
  // GameDetails screen styles
  gameDetailHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  gameDetailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  gameDetailSummary: {
    alignItems: 'center',
  },
  
  gameDetailScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  
  gameDetailDate: {
    fontSize: 14,
    color: '#666',
  },
  
  gameDetailAnswerItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  
  // Clear history button
  clearHistoryButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  clearHistoryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Tap to view details text
  tapToViewDetails: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
    textAlign: 'right',
    marginTop: 8,
  },
});
