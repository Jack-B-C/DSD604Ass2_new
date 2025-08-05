/**
 * Main Application Component
 * Configures navigation stack and provides global context for the quiz application
 */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import GamePlay from "./Components/GamePlay";
import Api from "./Components/Api";
import { ContextProvider } from "./Operations/Context";
import Results from "./Components/Results";
import GameDetails from "./Components/GameDetails";

const Stack = createStackNavigator();

/**
 * Root application component with navigation configuration
 * Sets up stack navigation between quiz screens and context providers
 */
const App = () => {
  return (
    <ContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Guess The City"
          screenOptions={{
            headerStyle: { backgroundColor: "#1976d2" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen name="Guess The City" component={GamePlay} />
          <Stack.Screen name="Weather" component={Api} />
          <Stack.Screen name="Results" component={Results} />
          <Stack.Screen name="GameDetails" component={GameDetails} options={{ title: "Game Details" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
};

export default App;
