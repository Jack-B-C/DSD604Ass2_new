/**
 * Database Operations Module
 * Handles SQLite database interactions for quiz data persistence
 * Manages game results, user answers, and database lifecycle operations
 */
import * as SQLite from 'expo-sqlite';

let db;

/**
 * Establishes and returns database connection
 * Creates database instance if it doesn't exist
 * @returns {Object} SQLite database connection
 */
export function getDBConnection() {
  if (!db) {
    db = SQLite.openDatabaseSync('mydb.db'); // Synchronous database initialization
  }
  return db;
}

/**
 * Creates the incorrect_answers table for legacy compatibility
 * Stores only incorrect user responses with timestamp
 * @returns {Promise} Promise that resolves when table is created
 */

export function createTable() {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      db.execSync(`CREATE TABLE IF NOT EXISTS incorrect_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country TEXT,
        user_answer TEXT,
        correct_answer TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Creates comprehensive answers table for all user responses
 * Stores both correct and incorrect answers with game association
 * @returns {Promise} Promise that resolves when table is created
 */
export function createAllAnswersTable() {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      // Recreate table to ensure proper schema structure
      db.execSync(`DROP TABLE IF EXISTS all_answers;`);
      // Create table with foreign key relationship to game results
      db.execSync(`CREATE TABLE all_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER,
        country TEXT,
        user_answer TEXT,
        correct_answer TEXT,
        is_correct INTEGER,
        question_number INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES game_results (id)
      );`);
      console.log('All answers table created successfully with game_id column');
      resolve();
    } catch (error) {
      console.error('Error creating all answers table:', error);
      reject(error);
    }
  });
}

/**
 * Inserts incorrect answer record for backward compatibility
 * @param {string} country - Country name from the question
 * @param {string} userAnswer - User's selected answer
 * @param {string} correctAnswer - The correct capital city
 * @returns {Promise} Promise that resolves when record is inserted
 */

export function insertIncorrectAnswer(country, userAnswer, correctAnswer) {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      db.runSync(
        `INSERT INTO incorrect_answers (country, user_answer, correct_answer) VALUES (?, ?, ?)`,
        [country, userAnswer, correctAnswer]
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves all incorrect answers from legacy table
 * @returns {Promise<Array>} Promise that resolves to array of incorrect answer records
 */
export function getIncorrectAnswers() {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      const result = db.getAllSync(`SELECT * FROM incorrect_answers ORDER BY timestamp DESC`);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Inserts answer record into comprehensive answers table
 * Stores both correct and incorrect responses with game context
 * @param {number|null} gameId - Associated game session ID
 * @param {string} country - Country name from question
 * @param {string} userAnswer - User's selected answer
 * @param {string} correctAnswer - Correct capital city
 * @param {boolean} isCorrect - Whether the answer was correct
 * @param {number} questionNumber - Question position in game (1-based)
 * @returns {Promise} Promise that resolves when record is inserted
 */
export function insertAnswer(gameId, country, userAnswer, correctAnswer, isCorrect, questionNumber) {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      db.runSync(
        `INSERT INTO all_answers (game_id, country, user_answer, correct_answer, is_correct, question_number) VALUES (?, ?, ?, ?, ?, ?)`,
        [gameId, country, userAnswer, correctAnswer, isCorrect ? 1 : 0, questionNumber]
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves all answer records from current session
 * @returns {Promise<Array>} Promise that resolves to array of all answer records
 */
export function getAllAnswers() {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      const result = db.getAllSync(`SELECT * FROM all_answers ORDER BY timestamp DESC`);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves answer records for a specific game session
 * @param {number} gameId - Game session identifier
 * @returns {Promise<Array>} Promise that resolves to array of game-specific answers
 */
export function getAnswersForGame(gameId) {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      const result = db.getAllSync(
        `SELECT * FROM all_answers WHERE game_id = ? ORDER BY question_number ASC`,
        [gameId]
      );
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Clears all database records from all tables
 * Removes game results, answers, and legacy incorrect answer data
 * @returns {Promise} Promise that resolves when all data is cleared
 */

export function clearDatabase() {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      db.runSync(`DELETE FROM incorrect_answers`);
      db.runSync(`DELETE FROM all_answers`); // Remove comprehensive answer records
      db.runSync(`DELETE FROM game_results`); // Remove game session data
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Creates the game results table for storing completed game sessions
 * Stores game performance metrics and completion timestamps
 * @returns {Promise} Promise that resolves when table is created
 */
export const createGameResultsTable = () => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      db.execSync(`
        CREATE TABLE IF NOT EXISTS game_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          total_questions INTEGER NOT NULL,
          correct_answers INTEGER NOT NULL,
          wrong_answers INTEGER NOT NULL,
          score_percentage REAL NOT NULL,
          game_date TEXT NOT NULL
        );
      `);
      console.log('Game results table created successfully');
      resolve();
    } catch (error) {
      console.error('Error creating game results table:', error);
      reject(error);
    }
  });
};

/**
 * Inserts completed game result record
 * Stores game performance data and returns the generated game ID
 * @param {number} totalQuestions - Number of questions in the game
 * @param {number} correctAnswers - Number of correct responses
 * @param {number} wrongAnswers - Number of incorrect responses
 * @param {number} scorePercentage - Final score as percentage
 * @returns {Promise<number>} Promise that resolves to the new game ID
 */

export const insertGameResult = (totalQuestions, correctAnswers, wrongAnswers, scorePercentage) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      const currentDate = new Date().toISOString();
      const result = db.runSync(
        `INSERT INTO game_results (total_questions, correct_answers, wrong_answers, score_percentage, game_date) VALUES (?, ?, ?, ?, ?)`,
        [totalQuestions, correctAnswers, wrongAnswers, scorePercentage, currentDate]
      );

      console.log('Game result saved successfully'); 
      resolve(result.lastInsertRowId); // Return generated game ID for linking answers
    } catch (error) {
      console.error('Error inserting game result:', error);
      reject(error);
    }
  });
};

/**
 * Retrieves all game result records ordered by date
 * @returns {Promise<Array>} Promise that resolves to array of game result records
 */
export const getGameResults = () => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      const results = db.getAllSync(`SELECT * FROM game_results ORDER BY game_date DESC`);
      resolve(results);
    } catch (error) {
      console.error('Error fetching game results:', error);
      reject(error);
    }
  });
};

/**
 * Associates unlinked answer records with a completed game session
 * Updates answers that don't have a game_id to link them to the specified game
 * @param {number} gameId - Game session identifier to link answers to
 * @returns {Promise} Promise that resolves when answers are linked
 */
export const linkAnswersToGame = (gameId) => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDBConnection();
      // Associate recent answers (null game_id) with this completed game
      db.runSync(
        `UPDATE all_answers SET game_id = ? WHERE game_id IS NULL`,
        [gameId]
      );
      console.log('Answers linked to game ID:', gameId);
      resolve();
    } catch (error) {
      console.error('Error linking answers to game:', error);
      reject(error);
    }
  });
};

