/**
 * Game Details Component
 * Displays detailed view of a specific game session including all questions and answers
 */
import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    RefreshControl,
    ScrollView 
} from 'react-native';
import { getAnswersForGame } from "../Operations/DbOperations";
import styles from '../AllStyles/styles';

/**
 * GameDetails component for viewing comprehensive game session data
 * Shows all questions, user answers, and correct answers for a specific game
 */
const GameDetails = ({ route, navigation }) => {
    const { gameData, gameNumber } = route.params; // Game session data from navigation params
    const [answers, setAnswers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    
    /**
     * Loads all answer records for the specific game session
     */
    const loadAnswers = async () => {
        try {
            const data = await getAnswersForGame(gameData.id);
            setAnswers(data);
        } catch (error) {
            console.error("Error loading game answers:", error);
        }
    };
    
    /**
     * Handles pull-to-refresh functionality for answer data
     */
    const handleRefresh = async () => {
        setRefreshing(true);
        await loadAnswers();
        setRefreshing(false);
    };
    
    /**
     * Initialize answer data when component mounts
     */
    useEffect(() => {
        loadAnswers();
    }, []);

    /**
     * Renders individual answer items with question details
     * @param {Object} item - Answer record with question and response data
     */
    
    const renderAnswer = ({ item }) => (
        <View style={[
            styles.gameDetailAnswerItem,
            item.is_correct ? styles.correctAnswerContainer : styles.incorrectAnswerContainer
        ]}>
            <View style={styles.answerHeader}>
                <Text style={styles.questionNumber}>Question {item.question_number}</Text>
                <Text style={[
                    styles.answerStatusText,
                    item.is_correct ? styles.correctStatus : styles.incorrectStatus
                ]}>
                    {item.is_correct ? '✓ CORRECT' : '✗ INCORRECT'}
                </Text>
            </View>
            <Text style={styles.incorrectAnswerText}>
                What is the capital of {item.country}?
            </Text>
            <Text style={styles.incorrectAnswerText}>
                Your answer: {item.user_answer}
            </Text>
            <Text style={styles.correctAnswerText}>
                Correct answer: {item.correct_answer}
            </Text>
        </View>
    );
    
    /**
     * Main component render
     * Displays game details interface with summary and answer history
     */
    return (
        <View style={styles.container}>
            {/* Game session summary header */}
            <View style={styles.gameDetailHeader}>
                <Text style={styles.gameDetailTitle}>
                    Game #{gameNumber} Details
                </Text>
                <View style={styles.gameDetailSummary}>
                    <Text style={styles.gameDetailScore}>
                        Score: {gameData.correct_answers}/{gameData.total_questions} ({gameData.score_percentage}%)
                    </Text>
                    <Text style={styles.gameDetailDate}>
                        {new Date(gameData.game_date).toLocaleString()}
                    </Text>
                </View>
            </View>
            
            {/* Navigation to start new game */}
            <TouchableOpacity 
                style={styles.startNewGameButton} 
                onPress={() => navigation.navigate('Guess The City')}
            >
                <Text style={styles.startNewGameButtonText}>🎯 Start New Game</Text>
            </TouchableOpacity>
            
            {/* Detailed answer list or empty state */}
            {answers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No answers found for this game.</Text>
                </View>
            ) : (
                <FlatList
                    data={answers}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderAnswer}
                    style={styles.resultsLiveListPlaceholder}
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

export default GameDetails;
