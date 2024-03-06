import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SettingsScreen from './screens/SettingsScreen';
import MainScreen from './screens/Main';
import { TouchableOpacity, View, TextInput, Button, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

const Stack = createStackNavigator();

const App = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [currentNavigation, setCurrentNavigation] = useState(null);

  const toggleModal = (navigation = null) => {
    setModalVisible(!isModalVisible);
    if (navigation) setCurrentNavigation(navigation);   };

  const handleSettingsNavigation = (navigation) => {
    toggleModal(navigation); 
  };

  const checkPasswordAndNavigate = (passwordInput, navigation) => {
    if (passwordInput === "XQbRX8") { 
      navigation.navigate('Settings');
      toggleModal(); 
      setPassword("");
    } else {
      alert("Incorrect Password");}
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Escanea tu codigo"
          component={MainScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => handleSettingsNavigation(navigation)}>
                <Ionicons name="settings" size={50} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
      <Modal isVisible={isModalVisible}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.modalContent}>
            <Text>Please enter your password:</Text>
            <TextInput
              secureTextEntry
              style={styles.input}
              onChangeText={setPassword}
              value={password}
            />
            <View style={styles.passwordButtons}>
              <Button title="Confirm" onPress={() => checkPasswordAndNavigate(password, currentNavigation)} />
              <Button title="Cancel" onPress={() => toggleModal()} />
            </View>
          </View>
        </View>
      </Modal>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: 200,
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
  },
  passwordButtons:{
    display: 'flex',
    flexDirection: 'row',
    gap: 100,
  },
});

export default App;
