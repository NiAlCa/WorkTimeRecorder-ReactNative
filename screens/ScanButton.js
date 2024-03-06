import React from 'react';
import { Button } from 'react-native';

const ScanButton = ({ onPress, text, buttonType }) => {

  const buttonColor = buttonType === 'entrada' ? 'green' : 'red';
  
  return(
     <Button 
       title={text} 
       onPress={onPress}
       color={buttonColor} 
     /> 
  );
};

export default ScanButton;
