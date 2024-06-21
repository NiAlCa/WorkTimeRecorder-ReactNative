[![Video](https://img.youtube.com/vi/exvXCzcq2BQ/0.jpg)](https://www.youtube.com/watch?v=exvXCzcq2BQ)




 Work time recorder app and API Integration
Overview
This React Native application is designed to scan barcodes using the device's camera, process the scanned data, and interact with 
a specified API to complete a check-in process. The app supports showing success and error messages, handling multiple options
for check-in locations, and storing essential settings using AsyncStorage.

-Features
Camera access to scan barcodes
API integration for check-in
Error and success message handling
Persistent storage of settings
Multiple check-in location options



API Requirements
The API should accept a POST request with the following structure:

{
  "lectura": "scannedData",
  "idTerminal": terminalId,
  "center": "center"
}


