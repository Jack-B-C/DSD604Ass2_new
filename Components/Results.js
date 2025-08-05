/**
 * Game Results Component
 * Displays historical game performance data with statistics and management options
 */
import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    RefreshControl,
    ScrollView,
    Alert 
} from 'react-native';
import { getGameResults, clearDatabase } from "../Operations/DbOperations";
import styles from '../AllStyles/styles';

/**
 * Results component for displaying game history and statistics
 * Provides game performance analytics and navigation options
 */
const Results = ({ navigation }) => {
    // State management for game results and UI controls
    const [gameResults, setGameResults] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    
    /**
     * Loads game results from database
     * Retrieves all completed game sessions with scores and statistics
     */
    const loadGameResults = async () => {
        try {
            const data = await getGameResults();
            setGameResults(data);
        } catch (error) {
            console.error("Error loading game results:", error);
        }
    };
    
    /**
     * Handles pull-to-refresh functionality for game results
     */
    const handleRefresh = async () => {
        setRefreshing(true);
        await loadGameResults();
        setRefreshing(false);
    };
    
    /**
     * Initialize results data when component mounts
     */
    useEffect(() => {
        loadGameResults();
    }, []);
    
    /**
     * Navigates to main game screen to start a new quiz session
     */
    const startNewGame = () => {
        navigation.navigate('Guess The City');
    };
    
    /**
     * Clears all game history and answer data
     * Prompts user for confirmation before deletion
     */
    const clearAllHistory = () => {
        Alert.alert(
            'Clear All History',
            'Are you sure you want to clear all game results and answers? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await clearDatabase();
                            await loadGameResults(); // Refresh the display
                            Alert.alert('Success', 'All history cleared successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear history');
                            console.error('Error clearing history:', error);
                        }
                    }
                }
            ]
        );
    };
    
    /**
     * Navigates to detailed view of a specific game session
     * @param {Object} gameData - Game result data to display
     * @param {number} gameNumber - Sequential game number for display
     */
    const viewGameDetails = (gameData, gameNumber) => {
        navigation.navigate('GameDetails', { gameData, gameNumber });
    };
    
    // Performance statistics calculations
    const totalGames = gameResults.length;
    const averageScore = totalGames > 0 
        ? (gameResults.reduce((sum, game) => sum + parseFloat(game.score_percentage), 0) / totalGames).toFixed(1)
        : 0;
    const bestScore = totalGames > 0 
        ? Math.max(...gameResults.map(game => parseFloat(game.score_percentage)))
        : 0;

    /**
     * Renders individual game result items
     * Displays game summary with score and navigation option
     * @param {Object} item - Game result data
     * @param {number} index - Array index for game numbering
     */
    
    const renderGameResult = ({ item, index }) => (
        <TouchableOpacity 
            style={styles.gameResultItem}
            onPress={() => viewGameDetails(item, totalGames - index)}
        >
            <View style={styles.gameResultHeader}>
                <Text style={styles.gameNumber}>Game #{totalGames - index}</Text>
                <Text style={[
                    styles.scorePercentage,
                    parseFloat(item.score_percentage) >= 70 ? styles.goodScore : styles.poorScore
                ]}>
                    {item.score_percentage}%
                </Text>
            </View>
            <Text style={styles.gameResultScore}>
                Score: {item.correct_answers}/{item.total_questions}
            </Text>
            <Text style={styles.gameResultDate}>
                {new Date(item.game_date).toLocaleString()}
            </Text>
            <Text style={styles.tapToViewDetails}>
                Tap to view all questions →
            </Text>
        </TouchableOpacity>
    );

    /**
     * Main component render
     * Displays game results interface with statistics and history
     */
    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Game Results</Text>
            
            {/* Performance statistics summary */}
            {totalGames > 0 && (
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalGames}</Text>
                        <Text style={styles.statLabel}>Games Played</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{averageScore}%</Text>
                        <Text style={styles.statLabel}>Average Score</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{bestScore}%</Text>
                        <Text style={styles.statLabel}>Best Score</Text>
                    </View>
                </View>
            )}
            
            {/* Game management controls */}
            <TouchableOpacity 
                style={styles.startNewGameButton} 
                onPress={startNewGame}
            >
                <Text style={styles.startNewGameButtonText}>🎯 Start New Game</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.clearHistoryButton} 
                onPress={clearAllHistory}
            >
                <Text style={styles.clearHistoryButtonText}>🗑️ Clear All History</Text>
            </TouchableOpacity>
            
            {/* Game results list or empty state */}
            {gameResults.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No game results yet.</Text>
                    <Text style={styles.emptySubtext}>
                        Complete a full game to see your results here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={gameResults}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderGameResult}
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

export default Results;
