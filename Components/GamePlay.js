/**
 * Main Quiz Game Component
 * Handles capital cities quiz gameplay with scoring and data persistence
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { countries, getRandomCountry, getMultipleChoiceOptions } from './CountriesData';
import { 
  createTable, 
  insertIncorrectAnswer, 
  createGameResultsTable, 
  insertGameResult, 
  clearDatabase,
  createAllAnswersTable,
  insertAnswer,
  linkAnswersToGame
} from '../Operations/DbOperations';
import styles from '../AllStyles/styles';

/**
 * GamePlay component - Main quiz interface
 * Manages quiz state, question generation, and user interactions
 */
const GamePlay = ({ navigation }) => {
  // Quiz state management
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState([]); // Prevent duplicate questions within a game
  const [currentGameId, setCurrentGameId] = useState(null); // Link answers to specific game sessions

  /**
   * Generates a new quiz question from available countries
   * Ensures no duplicate questions within the same game session
   */
  const generateNewQuestion = () => {
    console.log('Generating new question...');
    
    // Filter out previously used countries in current game
    const availableCountries = countries.filter(country => 
      !usedQuestions.includes(country.country)
    );
    
    // Reset used questions if all countries have been used
    if (availableCountries.length === 0) {
      console.log('All countries used, resetting...');
      setUsedQuestions([]);
      availableCountries.push(...countries);
    }
    
    // Select random country from available options
    const randomIndex = Math.floor(Math.random() * availableCountries.length);
    const randomCountry = availableCountries[randomIndex];
    
    // Track used questions to prevent duplicates
    setUsedQuestions(prev => [...prev, randomCountry.country]);
    
    const questionOptions = getMultipleChoiceOptions(randomCountry.capital);
    
    console.log('Question generated:', randomCountry);
    console.log('Options:', questionOptions);
    console.log('Used questions:', [...usedQuestions, randomCountry.country]);
    
    setCurrentQuestion(randomCountry);
    setOptions(questionOptions);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  };

  /**
   * Initializes a new game session
   * Resets all game state and clears previous session data
   */
  const startNewGame = async () => {
    setScore(0);
    setQuestionCount(0);
    setUsedQuestions([]); // Reset question history for new game
    setCurrentGameId(null); // Clear previous game ID
    generateNewQuestion();
  };

  /**
   * Processes user answer selection
   * Updates score, saves answer data, and manages game progression
   * @param {string} answer - The selected answer from multiple choice options
   */
  const handleAnswerSelection = async (answer) => {
    if (selectedAnswer) return; // Prevent multiple answer selections
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.capital;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Debug logging for answer validation
    console.log('Answer selected:', answer);
    console.log('Correct answer:', currentQuestion.capital);
    console.log('Is correct:', correct);
    console.log('Current score before update:', score);
    
    // Persist all answers (correct and incorrect) to database
    try {
      await insertAnswer(
        null, // Game ID will be assigned when game completes
        currentQuestion.country,
        answer,
        currentQuestion.capital,
        correct,
        questionCount + 1 // 1-based question numbering
      );
      console.log('Answer saved to database:', { correct, answer, questionNumber: questionCount + 1 });
    } catch (error) {
      console.error('Error saving answer to database:', error);
    }
    
    if (correct) {
      setScore(score + 1);
      console.log('Score updated to:', score + 1);
    } else {
      // Maintain backward compatibility by saving incorrect answers separately
      try {
        await insertIncorrectAnswer(
          currentQuestion.country,
          answer,
          currentQuestion.capital
        );
      } catch (error) {
        console.error('Error saving incorrect answer:', error);
      }
    }
    
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    
    // Handle game completion after 10 questions
    setTimeout(async () => {
      if (newQuestionCount >= 10) {
        const finalScore = correct ? score + 1 : score;
        const wrongAnswers = 10 - finalScore;
        const scorePercentage = (finalScore / 10) * 100;
        
        // Save complete game results and link answers to this game session
        insertGameResult(10, finalScore, wrongAnswers, scorePercentage)
          .then((gameId) => {
            console.log('Game result saved:', { 
              gameId: gameId,
              score: finalScore, 
              percentage: scorePercentage 
            });
            // Associate recent answers with this completed game
            return linkAnswersToGame(gameId);
          })
          .then(() => {
            console.log('Answers linked to game successfully');
          })
          .catch((error) => {
            console.error('Error saving game result or linking answers:', error);
          });
        
        Alert.alert(
          'Quiz Complete!',
          `Your final score: ${finalScore}/10`,
          [
            {
              text: 'Play Again',
              onPress: () => {
                setScore(0);
                setQuestionCount(0);
                setUsedQuestions([]); // Reset question history for new game
                startNewGame(); // Initialize fresh game session
              }
            },
            {
              text: 'View Results',
              onPress: () => navigation.navigate('Results')
            }
          ]
        );
      } else {
        generateNewQuestion();
      }
    }, 2000);
  };

  /**
   * Component initialization
   * Sets up database tables and starts the first quiz question
   */
  useEffect(() => {
    console.log('GamePlay component mounted, initializing...');
    const initializeGame = async () => {
      try {
        console.log('Creating database tables...');
        await createTable();
        await createAllAnswersTable(); // Table for comprehensive answer tracking
        await createGameResultsTable();
        console.log('Database tables created successfully');
        startNewGame(); // Begin fresh game session
      } catch (error) {
        console.error('Error initializing database:', error);
        // Continue with game initialization even if database setup fails
        startNewGame();
      }
    };
    initializeGame();
  }, []);


  /**
   * Loading state component
   * Displays while question data is being prepared
   */
  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading question...</Text>
      </View>
    );
  }

  /**
   * Main quiz interface render
   * Displays question, multiple choice options, score, and feedback
   */
  return (
    <View style={styles.container}>
      {/* Current progress and score display */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>
          Question {questionCount + 1}/10 | Score: {score}/10
        </Text>
      </View>

      {/* Quiz question presentation */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>
          What is the capital of
        </Text>
        <Text style={styles.countryText}>
          {currentQuestion.country}?
        </Text>
      </View>

      {/* Multiple choice answer options */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          let buttonStyle = [styles.optionButton];
          let textStyle = [styles.optionText];
          
          // Apply visual feedback based on answer correctness
          if (selectedAnswer) {
            if (option === currentQuestion.capital) {
              buttonStyle.push(styles.optionButtonCorrect);
              textStyle.push(styles.optionTextCorrect);
            } else if (option === selectedAnswer) {
              buttonStyle.push(styles.optionButtonIncorrect);
              textStyle.push(styles.optionTextIncorrect);
            }
          } else if (selectedAnswer === option) {
            buttonStyle.push(styles.optionButtonSelected);
          }
          
          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => handleAnswerSelection(option)}
              disabled={selectedAnswer !== null}
            >
              <Text style={textStyle}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Answer feedback display */}
      {showFeedback && (
        <View style={[
          styles.feedbackContainer,
          isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect
        ]}>
          <Text style={[
            styles.feedbackText,
            isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextIncorrect
          ]}>
            {isCorrect 
              ? 'Correct! Well done!' 
              : `Incorrect. The correct answer is ${currentQuestion.capital}.`
            }
          </Text>
        </View>
      )}

      {/* Navigation and game control buttons */}
      <View style={styles.navigationContainer}>        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('Results')}
        >
          <Text style={styles.navButtonText}>Game Results</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={startNewGame}
        >
          <Text style={styles.navButtonText}>Start New Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('Weather')}
        >
          <Text style={styles.navButtonText}>Weather</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Export component for navigation integration
 */
export default GamePlay;
