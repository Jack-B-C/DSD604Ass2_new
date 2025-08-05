/**
 * Countries Data Module
 * Provides country and capital city data for the quiz application
 * Contains utility functions for question generation and API integration
 */

/**
 * Array of European countries and their capital cities
 * Used as the primary data source for quiz questions and weather API
 */
export const countries = [
  { country: 'France', capital: 'Paris' },
  { country: 'Germany', capital: 'Berlin' },
  { country: 'Italy', capital: 'Rome' },
  { country: 'Spain', capital: 'Madrid' },
  { country: 'Portugal', capital: 'Lisbon' },
  { country: 'Netherlands', capital: 'Amsterdam' },
  { country: 'Belgium', capital: 'Brussels' },
  { country: 'Switzerland', capital: 'Bern' },
  { country: 'Austria', capital: 'Vienna' },
  { country: 'Poland', capital: 'Warsaw' },
  { country: 'Czech Republic', capital: 'Prague' },
  { country: 'Hungary', capital: 'Budapest' },
  { country: 'Romania', capital: 'Bucharest' },
  { country: 'Bulgaria', capital: 'Sofia' },
  { country: 'Greece', capital: 'Athens' },
  { country: 'Croatia', capital: 'Zagreb' },
  { country: 'Slovakia', capital: 'Bratislava' },
  { country: 'Slovenia', capital: 'Ljubljana' },
  { country: 'Estonia', capital: 'Tallinn' },
  { country: 'Latvia', capital: 'Riga' }
];

/**
 * Generates a random country selection for quiz questions
 * @returns {Object} Random country object with country and capital properties
 */
export const getRandomCountry = () => {
  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex];
};

/**
 * Creates multiple choice options for quiz questions
 * Generates 4 options including the correct answer and 3 randomized distractors
 * @param {string} correctAnswer - The correct capital city name
 * @returns {Array} Shuffled array of 4 answer options
 */
export const getMultipleChoiceOptions = (correctAnswer) => {
  // Select 3 random incorrect answers from other countries
  const wrongAnswers = countries
    .filter(country => country.capital !== correctAnswer)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(country => country.capital);
  
  // Combine correct answer with distractors
  const options = [...wrongAnswers, correctAnswer];
  
  // Apply Fisher-Yates shuffle algorithm for proper randomization
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return options;
};

/**
 * Extracts all capital cities for weather API dropdown selection
 * @returns {Array} Array of capital city names
 */
export const getAllCapitals = () => {
  return countries.map(country => country.capital);
};
