import React, { Component } from 'react';
import { View,ScrollView, Image, StyleSheet, Text } from 'react-native';
import Values from '../../common/Values';
import { NavigationEvents } from 'react-navigation';
import { Button } from 'native-base';
import appConstants from '../../common/AppConstants';
import * as SecureStore from 'expo-secure-store'
import Loader from '../../common/Loader';
const loadingStatus = ["Cargando datos del usuario", 'ok']
class EntryPoint extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: null//navigation.getParam('otherParam', 'Home')
        }

    };
    constructor(props) {
        super(props);
        this.state = {
            loadingStatusIndex:0
        }
        this.checkUserData();
    }
    async checkUserData() {
        let userInfo = JSON.parse(await SecureStore.getItemAsync(appConstants.USER_INFO));
        if (userInfo != null && userInfo.user) {
            this.goTo(appConstants.appRoutes.DRAWER_HOME);
        } else {
            this.setState({
                loadingStatusIndex: 1
            })
        }
    }
    goTo(page, params = {}) {
        this.props.navigation.navigate(page, params)
    }
    render() {
        if (this.state.loadingStatusIndex == 0) {
            return (
                <View style={[Values.styles.container]}>
                    <NavigationEvents
                       
                        onDidFocus={() => {this.checkUserData()}}
                        
                    />
                    <Loader message={loadingStatus[this.state.loadingStatusIndex]} />
                </View>)
        }
        return (<ScrollView style={[Values.styles.container]}>
            <Image style={styles.logo} source={require('./img/my_miracle.png')} />
            <Image style={styles.img1} source={require('./img/img1.png')} />
            <Button onPress={
                () => {
                    this.goTo(appConstants.appRoutes.LOGIN)
                }
            } style={[styles.btn, styles.btn1]}>
                <Text style={[Values.styles.btnText]}>
                    YA TENGO UNA CUENTA
                </Text>
            </Button>
            <Button
                onPress={
                    () => {
                        this.goTo(appConstants.appRoutes.REGISTER_QR)
                    }
                }
                style={[styles.btn, styles.btn2]}>
                <Text style={[Values.styles.btnText]}>
                    CREAR UNA CUENTA
                </Text>
            </Button>
        </ScrollView>);
    }
}

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        height: 124,
        width: 168,
        marginTop: 49
    },
    img1: {
        alignSelf: 'center',
        height: 238.19,
        width: 261.07,
        marginTop: 32.36
    },
    btn: {
        alignSelf: 'center',
        height: 48,
        width: 252,
        borderRadius: 4,
        justifyContent: 'center',
    },
    btn1: {
        marginTop: 40,
        backgroundColor: '#36B1BF'
    },
    btn2: {
        marginTop: 19,
        backgroundColor: '#4AD9D9',
        marginBottom: 50
    }
})

export default EntryPoint;