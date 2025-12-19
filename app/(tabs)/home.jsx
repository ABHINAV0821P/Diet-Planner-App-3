
import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Image, ActivityIndicator, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import API_BASE_URL from "../apiConfig";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// Use a working mock API endpoint with the correct data structure
const API_URL = "https://mocki.io/v1/2e7e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e";


const Home = () => {
  const { user } = useGlobalContext();
  // AI Diet Generation Form State
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("");
  const [preference, setPreference] = useState("");
  const [allergies, setAllergies] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiDiet, setAiDiet] = useState(null);

  // ...existing code for API diet (optional, can keep or remove if only AI is needed)...

  // Handler for AI Diet Generation
  const handleGenerateAIDiet = async () => {
    setAiLoading(true);
    setAiError("");
    setAiDiet(null);
    try {
      const res = await fetch(`${API_BASE_URL}/generateDiet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age, weight, height, goal, preference, allergies })
      });
      const data = await res.json();
      if (!res.ok) {
        // If the server returns an error, it's in the `error` property of the JSON
        const message = data.error || "Failed to generate diet plan.";
        throw new Error(message);
      }
      if (data.error) {
        throw new Error(`AI Error: ${data.error}`);
      }
      setAiDiet(data);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>Welcome Back,</Text>
            <Text style={styles.usernameText}>{user?.username}</Text>
            <Text style={styles.teamText}>Created by Team Gabbar</Text>
          </View>
          <Image
            source={images.logoSmall}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>AI Diet Generator</Text>
          <TextInput style={styles.searchInput} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
          <TextInput style={styles.searchInput} placeholder="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
          <TextInput style={styles.searchInput} placeholder="Height (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" />
          <TextInput style={styles.searchInput} placeholder="Goal (e.g. lose weight)" value={goal} onChangeText={setGoal} />
          <TextInput style={styles.searchInput} placeholder="Preference (vegetarian/nonVegetarian)" value={preference} onChangeText={setPreference} />
          <TextInput style={styles.searchInput} placeholder="Allergies (comma separated)" value={allergies} onChangeText={setAllergies} />
          <TouchableOpacity onPress={handleGenerateAIDiet} style={[styles.planButton, { marginTop: 10 }]}> 
            <Text style={styles.buttonText}>{aiLoading ? 'Generating...' : 'Generate AI Diet Plan'}</Text>
          </TouchableOpacity>
          {aiError ? <Text style={{ color: 'red', marginTop: 8 }}>{aiError}</Text> : null}
        </View>
        {aiDiet && typeof aiDiet === 'object' && !aiDiet.error && (
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Your AI Diet Plan</Text>
            {Object.keys(aiDiet).map((day) => (
              <View key={day} style={{ marginBottom: 12 }}>
                <Text style={{ fontWeight: 'bold', color: '#FFA001', fontSize: 16 }}>{day}</Text>
                {Array.isArray(aiDiet[day]) && aiDiet[day].map((meal, idx) => (
                  <View key={idx} style={{ marginLeft: 10, marginBottom: 4 }}>
                    <Text style={{ fontWeight: 'bold' }}>{meal.meal}</Text>
                    {Array.isArray(meal.items) && meal.items.map((item, i) => (
                      <Text key={i} style={{ color: '#232533' }}>- {item}</Text>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

      </ScrollView>
      {/* Floating Action Button for "Ask AI" */}
      <TouchableOpacity
        onPress={() => router.push('/ask')}
        style={styles.fab}>
        <Text style={styles.fabIcon}>?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
//
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#778899" // Light grey background for a clean look
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 20 
  },
  backButton: { 
    padding: 2 
  },
  headerTextContainer: { 
    flex: 1, 
    alignItems: "center" 
  },
  welcomeText: { 
    fontSize: 25, 
    fontWeight: "700", 
    color: "#000000" 
  },
  usernameText: { 
    fontSize: 20, 
    color: "#ffffff" 
  },
  teamText: { 
    fontSize: 14, 
    color: "#c0c0c0" 
  },
  logo: { 
    width: 120, 
    height: 120 
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  searchInput: { 
    flex: 1, 
    padding: 12, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 8, 
    marginBottom: 10,
  },
  searchButton: { 
    padding: 12, 
    backgroundColor: '#000', 
    borderRadius: 8 
  },
  buttonContainer: { 
    flexDirection: "row", 
    justifyContent: "space-evenly", 
    marginVertical: 15 
  },
  planButton: { 
    flex: 1, 
    marginHorizontal: 5, 
    paddingVertical: 12, 
    backgroundColor: "#000000", // Primary color
    borderRadius: 8, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4 
  },
  activeButton: { 
    backgroundColor: "#FF5733" // Active button color
  },
  buttonText: { 
    textAlign: "center", 
    color: "#ffffff", 
    fontSize: 16 
  },
  dayContainer: { 
    marginBottom: 20 
  },
  dayText: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 10 
  },
  dietItem: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F6F6F8",
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1
  },
  mealText: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
    color: "#FFA001"
  },
  foodItemText: {
    fontSize: 15,
    color: "#232533"
  },
  separator: { 
    height: 1, 
    backgroundColor: "#cccccc" 
  },
  listContent: { 
    paddingBottom: 20 
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#FFA001',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
  }
});

export default Home;
