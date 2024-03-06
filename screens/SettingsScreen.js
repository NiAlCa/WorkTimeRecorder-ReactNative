import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [terminal, setTerminal] = useState('');
  const [time, setTime] = useState('');
  const [url, setUrl] = useState('');
  const [terminalId, setTerminalId] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const terminalStored = await AsyncStorage.getItem('terminal');
        const timeStored = await AsyncStorage.getItem('time');
        const urlStored = await AsyncStorage.getItem('url');
        const terminalIdStored = await AsyncStorage.getItem('terminalId');
        if (terminalStored) setTerminal(terminalStored);
        if (timeStored) setTime(timeStored);
        if (urlStored) setUrl(urlStored);
        if (terminalIdStored) setTerminalId(terminalIdStored);
      } catch (e) {
        console.error('Failed to load the data from storage', e);
      }
    };
    loadData();
  }, []);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('terminal', terminal);
      await AsyncStorage.setItem('time', time);
      await AsyncStorage.setItem('url', url);
      await AsyncStorage.setItem('terminalId', terminalId);
      alert('Datos guardados correctamente');
    } catch (e) {
      console.error('Failed to save the data to the storage', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Terminal:</Text>
      <TextInput
        style={styles.input}
        value={terminal}
        onChangeText={setTerminal}
      />
      <Text>Tiempo:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={time}
        onChangeText={setTime}
      />
      <Text>URL:</Text>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
      />
      <Text>ID Terminal:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={terminalId}
        onChangeText={text => setTerminalId(text.replace(/[^0-9]/g, ''))}
      />
      <Button
        title="Guardar"
        onPress={saveData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default SettingsScreen;
