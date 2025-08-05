/**
 * Database Screen Component
 * Displays user's answer history from current game session with management options
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { clearDatabase, getIncorrectAnswers, getAllAnswers } from '../Operations/DbOperations';
import styles from '../AllStyles/styles';

/**
 * Database component for viewing and managing answer history
 * Shows both correct and incorrect answers from the current session
 */
const Database = () => {
  // State management for answer data and UI controls
  const [allAnswers, setAllAnswers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Retrieves all answer records from the database
   * Loads both correct and incorrect answers from current session
   */
  const loadAllAnswers = async () => {
    try {
      const answers = await getAllAnswers();
      setAllAnswers(answers);
    } catch (error) {
      console.error('Error loading all answers:', error);
    }
  };

  /**
   * Handles pull-to-refresh functionality
   * Allows users to manually update the answer list
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllAnswers();
    setRefreshing(false);
  };

  /**
   * Clears all answer records from the current session
   * Prompts user for confirmation before deletion
   */
  const handleClearDatabase = () => {
    Alert.alert(
      'Clear Previous Answers',
      'Are you sure you want to clear all previous answers from this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearDatabase();
              await loadAllAnswers(); // Refresh display after clearing
              Alert.alert('Success', 'Previous answers cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear previous answers');
            }
          }
        }
      ]
    );
  };

  /**
   * Load answer data when component mounts
   */
  useEffect(() => {
    loadAllAnswers();
  }, []);

  /**
   * Renders individual answer items in the list
   * Displays question, user answer, correct answer, and timestamp
   * @param {Object} item - Answer record from database
   */
  const renderAnswer = ({ item }) => (
    <View style={[
      styles.incorrectAnswerItem,
      item.is_correct ? styles.correctAnswerContainer : styles.incorrectAnswerContainer
    ]}>
      <View style={styles.answerHeader}>
        <Text style={[
          styles.answerStatusText,
          item.is_correct ? styles.correctStatus : styles.incorrectStatus
        ]}>
          {item.is_correct ? '✓ CORRECT' : '✗ INCORRECT'}
        </Text>
      </View>
      <Text style={styles.incorrectAnswerText}>
        Question: What is the capital of {item.country}?
      </Text>
      <Text style={styles.incorrectAnswerText}>
        Your answer: {item.user_answer}
      </Text>
      <Text style={styles.correctAnswerText}>
        Correct answer: {item.correct_answer}
      </Text>
      <Text style={styles.timestampText}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  /**
   * Main component render
   * Displays answer history interface with clear functionality
   */
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Previous Answers</Text>
      
      {/* Database management controls */}
      <TouchableOpacity 
        style={styles.clearButton} 
        onPress={handleClearDatabase}
      >
        <Text style={styles.clearButtonText}>Clear Previous Answers</Text>
      </TouchableOpacity>

      {/* Answer list or empty state display */}
      {allAnswers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No previous answers from this session.</Text>
          <Text style={styles.emptySubtext}>
            All your answers from the current game will appear here and will be cleared when you start a new game.
          </Text>
        </View>
      ) : (
        /* Scrollable list of all answer records */
        <FlatList
          data={allAnswers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderAnswer}
          style={styles.answersList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Database;
