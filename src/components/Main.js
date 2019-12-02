import React from 'react';
import { StyleSheet, View,Text, TouchableOpacity, Linking, Platform } from 'react-native';
import Router from './Router';
import Values from '../common/Values'
import appConstants from '../common/AppConstants'
import Loader from '../common/Loader';
import axios from 'axios';
import AppAsyncStorage from '../common/AppAsyncStorage';
import * as SecureStore from 'expo-secure-store';
import DeviceInfo from 'react-native-device-info';
const LoadingStatus = [
  "Cargando Información",
  "Revisando Actualizaciones",
  "ok"
]
import PushNotification from 'react-native-push-notification';
export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoadingStatusIndex: 0,
      checkVersionStatus: appConstants.appVersion.UNCHECKED
    }
    this._isMounted = false;
    // this.abortController=new AbortController()
  }
  // componentWillUnmount(){
  //   this.abortController.abort();
  // }
  handleNotification(notification) {
    RNNotification=React
    // if (notification.title=="Necesitamos una frase" && notification.message=='Necesitamos una frase para el día de mañana') {
    //   Common.updateLastPhraseInformation(notification.id)
    // }
    if (notification.title == 'Hola tienes un') {
      global.initialRouteName = appConstants.appRoutes.DAILY_MESSAGE;
    }
    if (Platform.OS == 'ios')
      // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
  }
  async onRegister(token) {

    await SecureStore.setItemAsync(appConstants.DEVICE_PUSH_TOKEN, token.token)

  }
  componentWillUnmount() {
    console.log('abandon')
    PushNotification.abandonPermissions();
    this._isMounted = false;
  }
  otherCode() {
    PushNotification.requestPermissions();
    if (this._isMounted)
      PushNotification.configure({
        onRegister: token => { console.log('onRegister'); this.onRegister(token) },
        senderID: '417912701359',
        onNotification: notification => this.handleNotification(notification),
        requestPermissions: true,
      });
    //Aquí vamos a enviar el token para las notificaciones push
    //TODOOOOOO

    if (Platform.OS == 'android') {
      // console.log('oh, es android')
      // Notifications.createChannelAndroidAsync(appConstants.PHRASE_REMINDER, {
      //   name: appConstants.PHRASE_REMINDER,
      //   sound: true,
      //   vibrate: true,
      // });

    }

  }
  async componentDidMount() {
    this._isMounted = true;
    // this.abortController.abort();
    this.otherCode();
    try {
      await this.getContents()
    } catch (error) {
      console.log(error)
    }

    this.setState({
      LoadingStatusIndex: 1
    });

  }

  async getContents() {

    let response = await axios({
      method: 'get',
      url: "https://mymiracle.herokuapp.com/recomendations/api",
      timeout: 1000
    })
    let info = response.data
    let recomendations = info[appConstants.database.recomendation.RECOMENDATIONS];
    let dailyMessage = info.message;
    await AppAsyncStorage.storeData(appConstants.database.recomendation.RECOMENDATIONS, JSON.stringify(recomendations))
    await AppAsyncStorage.storeData(appConstants.database.dailymessage.DAILY_MESSAGE, JSON.stringify(dailyMessage))

  }
  async checkAppVersion() {
    let response = await axios({
      method: 'get',
      url: "https://mymiracle.herokuapp.com/version",
      timeout: 1000
    })
    DeviceInfo.getBuildNumber().then((buildNumber) => {
      if (buildNumber < response.data.version) {
        this.setState({
          checkVersionStatus: appConstants.appVersion.NEEDS_UPDATE
        })
      } else {
        this.setState({
          checkVersionStatus: appConstants.appVersion.UP_TO_DATE
        })
      }
    }).catch(error => {
      console.log("error checking updates: " + error)
      this.setState({
        checkVersionStatus: appConstants.appVersion.UP_TO_DATE
      })
    })
  }
  render() {
    switch (this.state.LoadingStatusIndex) {

      case 0:
        return (
          <Loader message={LoadingStatus[this.state.LoadingStatusIndex]} />
        )
      case 1:
        switch (this.state.checkVersionStatus) {
          case appConstants.appVersion.UNCHECKED:
            this.checkAppVersion();
            return (
              <Loader message={LoadingStatus[this.state.LoadingStatusIndex]} />
            )
          case appConstants.appVersion.NEEDS_UPDATE:
            return (
              <View style={[Values.styles.container, Values.styles.centered]}>
                <Text style={Values.styles.appText}>Necesitamos una actualización :)</Text>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL('https://play.google.com/store/apps/details?id=com.cerezabusiness.mymiracle')
                  }}
                  style={styles.btn}
                >
                  <Text style={Values.styles.appText}>
                    Ir a Google Play
                    </Text>
                </TouchableOpacity>
              </View>
            );
          case appConstants.appVersion.UP_TO_DATE:

            return (
              <Router />
            );


        }
      default:
        break;
    }

  }




}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    margin: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: Values.appPrimaryColor,
    borderRadius: 5,
  }
});