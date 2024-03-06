import React from 'react';
import { StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

const CameraScanner = ({ onBarCodeScanned, type }) => {
  return (
    <Camera
    onBarCodeScanned={onBarCodeScanned}
    style={StyleSheet.absoluteFillObject}
    barCodeScannerSettings={{
      barCodeTypes: [Camera.Constants.BarCodeType.qr],
    }}
    type={type}
    />

    
  );
};

export default CameraScanner;
