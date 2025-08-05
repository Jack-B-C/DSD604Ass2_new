/**
 * Weather Information Component
 * Provides weather data for capital cities using OpenWeatherMap API
 */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { getAllCapitals } from './CountriesData';
import styles from '../AllStyles/styles';

/**
 * Weather API component that displays current weather information
 * for selected capital cities
 */
const Api = () => {
  // State management for weather functionality
  const [selectedCity, setSelectedCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Retrieve available capital cities for selection
  const capitals = getAllCapitals();

  /**
   * Fetches current weather data from OpenWeatherMap API
   * Handles API errors and displays appropriate user feedback
   */
  const fetchWeatherData = async () => {
    if (!selectedCity) {
      Alert.alert('Error', 'Please select a city first');
      return;
    }

    setLoading(true);
    try {
      // OpenWeatherMap API configuration and request
      const API_KEY = '644bdd390ac4ec9cd88ba29474de455b';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`;
      
      const response = await axios.get(url);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Weather API Error:', error);
      
      // Provide specific error messages based on response status
      let errorMessage = 'Failed to fetch weather data.';
      if (error.response?.status === 401) {
        errorMessage = 'Invalid API key. Please check your OpenWeatherMap API key.';
      } else if (error.response?.status === 404) {
        errorMessage = 'City not found. Please try a different city.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Main component render
   * Displays weather interface with city selector and weather information
   */
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Weather Information</Text>
      
      {/* City selection dropdown component */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCity}
          onValueChange={(value) => setSelectedCity(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select a capital city..." value="" />
          {capitals.map((capital, index) => (
            <Picker.Item key={index} label={capital} value={capital} />
          ))}
        </Picker>
      </View>

      {/* Weather data fetch button */}
      <TouchableOpacity 
        style={styles.weatherButton}
        onPress={fetchWeatherData}
        disabled={loading}
      >
        <Text style={styles.weatherButtonText}>
          {loading ? 'Loading...' : 'Get Weather'}
        </Text>
      </TouchableOpacity>

      {/* Loading state indicator */}
      {loading && (
        <Text style={styles.loadingText}>Fetching weather data...</Text>
      )}

      {/* Weather information display */}
      {weatherData && !loading && (
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>
            Weather in {weatherData.name}
          </Text>
          
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherLabel}>Temperature:</Text>
            <Text style={styles.weatherValue}>
              {Math.round(weatherData.main.temp)}°C
            </Text>
          </View>
          
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherLabel}>Feels like:</Text>
            <Text style={styles.weatherValue}>
              {Math.round(weatherData.main.feels_like)}°C
            </Text>
          </View>
          
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherLabel}>Humidity:</Text>
            <Text style={styles.weatherValue}>
              {weatherData.main.humidity}%
            </Text>
          </View>
          
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherLabel}>Pressure:</Text>
            <Text style={styles.weatherValue}>
              {weatherData.main.pressure} hPa
            </Text>
          </View>
          
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherLabel}>Weather:</Text>
            <Text style={styles.weatherValue}>
              {weatherData.weather[0].description}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

/**
 * Export component for use in navigation stack
 */
export default Api;
