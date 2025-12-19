import React from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";

import { icons } from "../../constants";
// import useAppwrite from "../../lib/useAppwrite";
import API_BASE_URL from "../apiConfig";
import { /* getUserPosts, */ signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox.jsx";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  // No posts: Appwrite removed

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  const handleGetPremiumPress = () => {
    Alert.alert("Redirecting to Get Premium Plans");
    // You can replace this with navigation to a premium plans page if needed
  };

  const handleListModels = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/models`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch models.');
      }
      const modelNames = data.models.join('\n');
      Alert.alert("Available Models", `The following models support 'generateContent':\n\n${modelNames}\n\nPlease update the URL in 'api/generateDiet.js' and 'api/askAI.js' with one of these model names (e.g., 'models/gemini-1.5-flash').`);
    } catch (error) {
      Alert.alert("Error", `Failed to list models: ${error.message}`);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[]}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Plans yet"
            subtitle="Don't worry, We are cooking something for you! and enjoy full daily plans with diet planner PREMIUM Plans"
          />
        )}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={logout}
              style={styles.logoutButton}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                style={styles.logoutIcon}
              />
            </TouchableOpacity>

            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: user?.avatar || undefined }}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username || user?.email || "Guest"}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <TouchableOpacity 
              onPress={handleGetPremiumPress}
              style={styles.getPremiumButton}
            >
              <Text style={styles.buttonText}>Get Premium</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleListModels}
              style={[styles.getPremiumButton, { backgroundColor: '#555', marginTop: 10 }]}
            >
              <Text style={styles.buttonText}>List Available AI Models</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#161622",
    height: "100%",
  },
  headerContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  logoutButton: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    marginBottom: 40,
  },
  logoutIcon: {
    width: 24,
    height: 24,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderColor: "#FFD700",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "90%",
    height: "90%",
    borderRadius: 8,
  },
  getPremiumButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#FFD700",
    borderRadius: 8,
    shadowColor: "#FFD700",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
});

export default Profile;
