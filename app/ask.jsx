import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { icons } from '../constants';
import API_BASE_URL from './apiConfig';

const AskAI = () => {
  const [askAiPrompt, setAskAiPrompt] = useState("");
  const [askAiLoading, setAskAiLoading] = useState(false);
  const [askAiError, setAskAiError] = useState("");
  const [askAiResponse, setAskAiResponse] = useState("");

  const handleAskAI = async () => {
    if (!askAiPrompt) return;
    setAskAiLoading(true);
    setAskAiError("");
    setAskAiResponse("");
    try {
      const res = await fetch(`${API_BASE_URL}/askAI`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: askAiPrompt })
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data.error || "Failed to get a response from the AI.";
        throw new Error(message);
      }
      if (data.error) {
        throw new Error(`AI Error: ${data.error}`);
      }
      setAskAiResponse(data.answer);
    } catch (err) {
      setAskAiError(err.message);
    } finally {
      setAskAiLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Image source={icons.leftArrow} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ask AI</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask a question about health, fitness, or nutrition..."
            value={askAiPrompt}
            onChangeText={setAskAiPrompt}
            multiline
          />
          <TouchableOpacity onPress={handleAskAI} style={styles.askButton}>
            <Text style={styles.buttonText}>{askAiLoading ? 'Thinking...' : 'Get Answer'}</Text>
          </TouchableOpacity>
        </View>

        {askAiError ? <Text style={styles.errorText}>{askAiError}</Text> : null}

        {askAiResponse ? (
          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>{askAiResponse}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#161622" },
  container: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 8 },
  backIcon: { width: 24, height: 24, tintColor: '#fff' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  formContainer: { backgroundColor: '#232533', borderRadius: 12, padding: 16 },
  textInput: {
    backgroundColor: '#161622',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  askButton: {
    marginTop: 12,
    backgroundColor: '#FFA001',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: 'red', marginTop: 12, textAlign: 'center' },
  responseContainer: { marginTop: 20, backgroundColor: '#232533', borderRadius: 12, padding: 16 },
  responseText: { color: '#fff', fontStyle: 'italic', lineHeight: 22 },
});

export default AskAI;