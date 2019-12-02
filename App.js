/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Main from './src/components/Main';

const App: () => React$Node = () => {
  return (
    // <View style={[{flex:1}]}>
    <>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={{flex:1}}>
        <Main />
      </SafeAreaView>
    </>
    // </View>
  );
};



export default App;
