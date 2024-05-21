import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Button } from "react-native";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

const Main = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanResult, setScanResult] = useState("");
  const [camera, setCamera] = useState(true);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [terminal, setTerminal] = useState("");
  const [time, setTime] = useState("");
  const [terminalId, setTerminalId] = useState("");
  const [opciones, setOpciones] = useState([]);
  const [nombre, setNombre] = useState("");
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(showSuccessMessage);
  const [scanningPaused, setScanningPaused] = useState(false);

  const apiToken =
    "";

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      const storedTime = await AsyncStorage.getItem("time");
      if (storedTime) {
        setTime(parseInt(storedTime, 10) * 1000);
      }

      const storedTerminal = await AsyncStorage.getItem("terminal");
      if (storedTerminal) {
        setTerminal(storedTerminal);
      }
      const storedTerminalId = await AsyncStorage.getItem("terminalId");
      if (storedTerminalId) {
        setTerminalId(parseInt(storedTerminalId, 10));
      }

      const storedUrl = await AsyncStorage.getItem("url");
      if (storedUrl) {
        setUrl(storedUrl);
      }
    })();
    let timer;
    let timer2;
    let timer3;
    if (showSuccessMessage) {
      setShowSuccessMessage(true);
      timer = setTimeout(() => {
        setShowSuccessMessage(false);
        setNombre("");
      }, 1500);
    }

    if (showErrorMessage) {
      setShowErrorMessage(true);
      timer = setTimeout(() => {
        setShowErrorMessage(false);
        setNombre("");
      }, 1500);
    }

    if (opciones && opciones.length > 0) {
      timer2 = setTimeout(() => {
        setOpciones([]);
        setNombre("");
      }, time);
    }

    if (scanningPaused === true)
      setTimeout(() => {
        timer3 = setScanningPaused(false);
      }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [showSuccessMessage, opciones]);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const storedUrl = await AsyncStorage.getItem("url");
        const storedTime = await AsyncStorage.getItem("time");

        const terminalStored = await AsyncStorage.getItem("terminal");
        const terminalIdStored = await AsyncStorage.getItem("terminalId");
        if (terminalStored) setTerminal(terminalStored);
        if (storedTime) {
          setTime(parseInt(storedTime, 10) * 1000);
        }
        if (terminalIdStored) {
          setTerminalId(parseInt(terminalIdStored, 10));
        }
        if (storedUrl) setUrl(storedUrl);
      };

      loadData();

      let isActive = true;

      if (isActive) {
        setCamera(false);
        setTimeout(() => {
          setCamera(true);
        }, 1);
      }

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleReset = () => {
    setMostrarOpciones(false);
    setOpciones([]);
    setNombre("");
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanningPaused(true);
    setScanResult(data);
    if (timerId) {
      clearTimeout(timerId);
    }

    setShowErrorMessage(false);

    setShowSuccessMessage(false);

    try {
      const response = await axios.post(
        url,
        {
          lectura: data,
          idTerminal: terminalId,
        },
        {
          headers: {
            APIToken: apiToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.finalizado === false) {
        setOpciones(response.data.opciones);
        setNombre(response.data.nombre);
        setMostrarOpciones(true);
      } else {
        setScanningPaused(true);
        console.log("Éxito", "Fichaje completado con éxito.");
        setShowSuccessMessage(true);
      }
    } catch (error) {
      console.log(`Error", "Ocurrió un error al fichar. ${error.message}`);
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
      setShowErrorMessage(true);
      setScanningPaused(true);
    }
  };

  const handleOptionPress = async (opcion) => {
    clearTimeout(timerId);

    try {
      const response = await axios.post(
        url,
        {
          lectura: scanResult,
          idTerminal: terminalId,
          centro: opcion,
        },
        {
          headers: {
            APIToken: apiToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.finalizado) {
        console.log("Éxito", "Fichaje completado con éxito.");
        setShowSuccessMessage(true);
        setOpciones([]);
        setScanResult("HAS FICHADO CON EXITO");
        setNombre("");
      } else {
        console.log(
          `Error", "No se pudo completar el fichaje.  ${error.message}`
        );
      }
    } catch (error) {
      console.log(
        `Error", "Ocurrió un error al seleccionar la opción. ${error.message}`
      );
      setShowErrorMessage(true);
      setScanningPaused(true);
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se ha concedido acceso a la cámara</Text>;
  }


  const getColorForButton = (index) => {
    const colors = ["orange"];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperSection}>
        <Text style={[styles.upperSectionTermianl, styles.alignCenter]}>
          {terminal}
        </Text>
        <Text style={[styles.upperSectionId, styles.alignRight]}>
          {terminalId}
        </Text>
      </View>

      {hasPermission && (
        <View style={styles.lowerSection}>
          <View style={styles.cameraContainer} key={camera}>
            {scanningPaused === false && (
              <Camera
                style={{ flex: 1 }}
                type={type}
                onBarCodeScanned={handleBarCodeScanned}
              />
            )}
          </View>
          <View style={styles.resultContainer}>
            {!showSuccessMessage && (
              <Text style={styles.resultContainerText}>{`${nombre}`}</Text>
            )}

            {showSuccessMessage && (
              <View style={styles.successMessageContainer}>
                <Text style={styles.successMessageText}>
                  HAS FICHADO CON ÉXITO
                </Text>
              </View>
            )}

            {showErrorMessage && (
              <View style={styles.errorMessageContainer}>
                <Text style={styles.successMessageText}>¡Error!</Text>
              </View>
            )}

            <View style={styles.opcionesContainer}>
              {opciones.length >= 1 && (
                  <Text style={styles.resultContainerText}>{`${nombre}`}</Text>
                ) &&
                opciones.map((opcion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      { backgroundColor: getColorForButton(index) },
                    ]}
                    onPress={() => {
                      handleOptionPress(opcion);
                    }}
                  >
                    <Text style={styles.buttonText}>{opcion}</Text>
                  </TouchableOpacity>
                ))}

              {/* {opciones.length >= 1 && (
                <TouchableOpacity style={styles.reset} onPress={handleReset}>
                  <Text style={styles.buttonText}>Salir fichaje</Text>
                </TouchableOpacity>
              )}*/}
            </View>
          </View>
        </View>
      )}

      {hasPermission === null && <Text>Solicitando permiso de cámara...</Text>}
      {hasPermission === false && (
        <Text>No se ha concedido acceso a la cámara</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperSection: {
    flex: 2,
    flexDirection: "row",
    gap: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  upperSectionTermianl: {
    fontSize: 40,
  },
  upperSectionId: {
    fontSize: 40,
  },

  lowerSection: {
    flex: 9,
    flexDirection: "row",
  },
  cameraContainer: {
    backgroundColor: "#000",
    flex: 1,
  },
  resultContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  resultContainerText: {
    marginTop: 10,
    fontSize: 30,
  },
  opcionesContainer: {
    flex: 10,
    justifyContent: "center",
    gap: 100,
  },
  button: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    width: 500,
    height: 70,
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontSize: 26,
  },
  successMessageContainer: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    height: "100%",
    width: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  errorMessageContainer: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    height: "110%",
    width: 500,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  successMessageText: {
    textAlign: "center",
    color: "white",
    fontSize: 50,
  },

  reset: {
    backgroundColor: "red",
    color: "white",
    height: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Main;

