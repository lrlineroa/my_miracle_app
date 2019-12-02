import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, Linking, TouchableOpacity } from 'react-native';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import * as SecureStore from 'expo-secure-store';
import appConstants from './AppConstants';
import Values from './Values';
import Common from './Common';
import { Icon } from 'native-base';
import AppAsyncStorage from './AppAsyncStorage';
const CustomDrawerContentComponent = props => (
  <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      {/* <DrawerItems {...props} /> */}
      <TouchableOpacity
        style={[styles.item]}
        onPress={() => { props.navigation.navigate('Mi Frase del día') }}>
        <Text style={[styles.itemText]} > Mi Frase del día </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item]}
        onPress={() => { props.navigation.navigate('Mis Frases de Poder') }}>
        <Text style={[styles.itemText]} > Mis Frases de Poder </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item]}
        onPress={async () => { 
          props.navigation.navigate('Mensaje diario') }}>
        <Text style={[styles.itemText]} > Mensaje diario </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item]}
        onPress={() => { props.navigation.navigate('Recomendaciones') }}>
        <Text style={[styles.itemText]} > Recomendaciones </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item]}
        onPress={() => { Linking.openURL('https://www.youtube.com/watch?v=qVmVB76aoyo') }}>
        <Text style={[styles.itemText]}> La Rueda de la Vida </Text>
      </TouchableOpacity>
      <View style={{ backgroundColor: '#ccc', height: 1 }}>
      </View>
      <TouchableOpacity
        style={[styles.item, { flexDirection: 'row' }]}
        onPress={() => { Linking.openURL('http://mymiracle.co/que-es-my-miracle.pdf') }}>
        <Icon style={styles.icon} name='star-outline' />
        <Text style={[styles.itemText, { marginLeft: 10 }]}> Qué es My Miracle </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.item, { flexDirection: 'row' }]}
        onPress={async () => {
          let data = JSON.parse(await SecureStore.getItemAsync(appConstants.USER_INFO))
          props.navigation.navigate('Contacto', {
            name: data.user.name,
            email: data.user.email,
          })
        }}>
        <Icon style={styles.icon} name='paper-plane' />
        <Text style={[styles.itemText, { marginLeft: 10 }]}> Contacto </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.item, { flexDirection: 'row' }, { backgroundColor: Values.buttonColor }]}
        onPress={
          () => {
            SecureStore.deleteItemAsync(appConstants.USER_INFO)
            Common.clearAllNotifications()
            props.navigation.dangerouslyGetParent().navigate(appConstants.appRoutes.ENTRY_POINT);
          }
        }>
        <Icon style={[styles.icon, { color: 'white' }]} name='power' />
        <Text style={[styles.itemText, { marginLeft: 10 }, { color: 'white' }]}> Cerrar Sesión </Text>
      </TouchableOpacity>


    </SafeAreaView>

  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: 'white',
    paddingTop: 14,
    paddingBottom: 14,
  },
  itemText: {
    fontFamily: 'segoeuil',
    fontSize: 20,
    marginLeft: 20,
  },
  icon: {
    fontSize: 25,
    color: 'gray',
    marginLeft: 20,
    marginTop: 5
  },
});

export default CustomDrawerContentComponent;