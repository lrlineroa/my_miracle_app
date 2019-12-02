import React, { Component } from 'react';
import { ScrollView,View, Text, Alert, StyleSheet, Image, KeyboardAvoidingView } from 'react-native';
import Values from '../../common/Values';
import appConstants from '../../common/AppConstants';
import { Button, Item, Input, Icon } from 'native-base';
import HandleInput from '../../common/HandleInput';
import * as SecureStore from 'expo-secure-store'
import Validation from '../../common/Validation';
import Axios from 'axios';

class Login extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: null//navigation.getParam('otherParam', 'Home')
        }

    };
    constructor(props) {
        super(props);
        this.state = {
            userData: {
                email: '',
                password: '',
            },
            secureInputText: true
        }
        
    }

    
    goTo(page, params = {}) {
        const { navigate } = this.props.navigation;
        navigate(page, params)
    }

    validateFields() {
        let data = this.state.userData;
        if (data.email == '')
            return appConstants.validation.required.EMAIL
        if (data.password == '')
            return appConstants.validation.required.PASSWORD
        return Validation.validateEmailAndPhone(data.email)
    }
    async login() {
        let validationMessage = this.validateFields()
        switch (validationMessage) {
            case appConstants.validation.OK:
                this.setState({
                    isLoading: true
                })
                try {
                    let data2Send= this.state.userData
                    data2Send.email=data2Send.email.toLocaleLowerCase().trim();
                    data2Send[appConstants.database.user.PUSH_TOKEN]=await SecureStore.getItemAsync(appConstants.DEVICE_PUSH_TOKEN);
                    let response = await Axios.post('https://mymiracle.herokuapp.com/users/api/auth/signin'
                        , data2Send)
                    if (response.data.token) {
                        //Descomentar estooo
                        await SecureStore.setItemAsync(appConstants.USER_INFO, JSON.stringify(response.data))
                        this.showAlert('Bienvenido ',
                            response.data.user.name + ", disfruta My Miracle",
                        )

                        this.setState({
                            isLoading: false,
                            userData: {
                                email: '',
                                password: '',
                            },
                        })
                        this.goTo(appConstants.appRoutes.DRAWER_HOME)
                    }
                } catch (error) {
                    console.log(error)
                    if (error.response) {
                        /*
                         * The request was made and the server responded with a
                         * status code that falls out of the range of 2xx
                         */
                        // console.log(error.response.data);
                        // console.log(error.response.status);
                        // console.log(error.response.headers);
                        switch (error.response.status) {
                            case 400:
                                this.showAlert('Lo sentimos'
                                    , 'No Hemos encontrado coincidencias'
                                );
                                this.setState({
                                    userData: {
                                        email: '',
                                        password: '',
                                    }
                                })
                                break;
                            default:
                                this.showAlert('Opps', 'un error ha ocurrido');
                                break;
                        }
                    } else if (error.request) {
                        /*
                         * The request was made but no response was received, `error.request`
                         * is an instance of XMLHttpRequest in the browser and an instance
                         * of http.ClientRequest in Node.js
                         */
                        //console.log(error.request.response);
                        this.showAlert('Lo sentimos', 'No estás conectado a internet');
                        this.setState({
                            userData: {
                                email: '',
                                password: '',
                            }
                        })
                    } else {
                        // Something happened in setting up the request and triggered an Error
                        console.log('Error', error.message);
                    }
                    console.log(error.config);

                }
                break;

            default:
                this.showAlert('Lo sentimos', validationMessage)
                break;
        }
    }

    showAlert(title, message, btns = []) {
        btns = btns.length == 0 ? [{ text: 'Continuar' }] : btns;
        Alert.alert(title, message, btns)
    }

    render() {
        return (
            <KeyboardAvoidingView
                style={[Values.styles.container]}
                behavior="height" enabled>
                <ScrollView style={{ flex: 1 }}>
                    <Image style={styles.logo} source={require('./img/my_miracle.png')} />
                    <Item style={[styles.input, styles.input1]}>
                        <Input
                            placeholderTextColor={Values.appPrimaryColor}
                            style={[Values.styles.appText,
                            { color: Values.appPrimaryColor }]}
                            onChangeText={(text) => HandleInput.onChangeText(this, text, 'email')}
                            value={this.state.userData.email}
                            placeholder={'Correo electrónico'} />
                    </Item>
                    <Item style={[styles.input, styles.input2]}>
                        <Input
                            placeholderTextColor={Values.appPrimaryColor}
                            style={[Values.styles.appText,
                            { color: Values.appPrimaryColor }]}
                            onChangeText={(text) => HandleInput.onChangeText(this, text, 'password')}
                            value={this.state.userData.password}
                            secureTextEntry={this.state.secureInputText}
                            placeholder={'Contraseña'} />
                        <Icon
                            style={{ color: Values.appPrimaryColor }}
                            onPress={
                                () => {
                                    this.setState({
                                        secureInputText: !this.state.secureInputText
                                    })
                                }
                            } active
                            name={this.state.secureInputText ? 'eye' : 'eye-off'}
                        />
                    </Item>
                    <Button onPress={
                        () => {
                            this.login()
                        }
                    } style={[styles.btn, styles.btn1]}>
                        <Text style={[Values.styles.btnText]}>
                            INGRESAR
                        </Text>
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        height: 124,
        width: 168,
        marginTop: 49
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
        backgroundColor: Values.appPrimaryColor
    },
    input: {
        width: 328,
        height: 56,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Values.appPrimaryColor,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderRadius: 4,
        padding: 16,
    },
    input1: {
        marginTop: 110
    },
    input2: {
        marginTop: 28
    },
})

export default Login;