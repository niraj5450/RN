/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  View,
} from 'react-native';
import Exercise from './src/exercise'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Exercise />
    </SafeAreaView>
  );
};

export default App;
