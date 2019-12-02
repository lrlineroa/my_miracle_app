import React, { Component } from 'react';
import Values from "../../common/Values";
import { ScrollView, Alert, View, Text, StyleSheet, Image, KeyboardAvoidingView } from 'react-native';
import { Item, Label, Input, Right, Icon, Button as Btn, Button } from 'native-base';
import appConstants from '../../common/AppConstants';
import Loader from '../../common/Loader';
import * as SecureStore from 'expo-secure-store';
import Validation from '../../common/Validation';
import HandleInput from '../../common/HandleInput';
import Axios from 'axios';


class RegisterUserData extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }

    };
    constructor(props) {
        super(props);
        this.state = {
            secureInputText: true,
            userData: {
                name: '',
                email: '',
                phone_number: '',
                password: '',
            },
            isLoading: false,
        }
    }
    onChangeText(value, field) {
        let userDataCopy = {}
        Object.assign(userDataCopy, this.state.userData);
        userDataCopy[field] = value;
        this.setState({
            userData: userDataCopy
        })
    }
    async doRegister() {
        let validationMessage = this.validateFields()
        switch (validationMessage) {
            case appConstants.validation.OK:
                this.setState({
                    isLoading: true
                })
                try {
                    let data2Send = this.state.userData
                    data2Send.email = data2Send.email.toLocaleLowerCase().trim();
                    data2Send[appConstants.database.user.PUSH_TOKEN]=await SecureStore.getItemAsync(appConstants.DEVICE_PUSH_TOKEN);
                    let response = await Axios.post('https://mymiracle.herokuapp.com/users/api'
                        , data2Send)
                    if (response.data.token) {
                        await SecureStore.setItemAsync(appConstants.USER_INFO, JSON.stringify(response.data))
                        this.showAlert('Super!', 'Te registraste')
                        this.setState({
                            isLoading: false
                        })
                        this.goTo(appConstants.appRoutes.DRAWER_HOME)
                    }
                } catch (error) {
                    console.log(error)
                }
                break;

            default:
                this.showAlert('Lo sentimos', validationMessage)
                break;
        }
    }
    validateFields() {
        if (1 == 8)
            return appConstants.validation.TESTING
        let data = this.state.userData;
        if (data.name == '')
            return appConstants.validation.required.NAME
        if (data.email == '')
            return appConstants.validation.required.EMAIL
        if (data.phone_number == '')
            return appConstants.validation.required.PHONE_NUMBER
        if (data.password == '')
            return appConstants.validation.required.PASSWORD
        let validateEmailMessage = Validation.validateEmail(data.email);
        if (validateEmailMessage == appConstants.validation.invalid.EMAIL)
            return validateEmailMessage
        return Validation.validatePhone(data.phone_number)
    }
    goTo(page) {
        this.props.navigation.navigate(page);
    }
    showAlert(title, message) {
        Alert.alert(title, message, [{ text: 'Continuar' }])
    }
    render() {
        if (this.state.isLoading) {
            return (<Loader message='Registrandote...' />)
        }
        return (
            <KeyboardAvoidingView style={[Values.styles.container]} behavior="padding" enabled>
                <ScrollView style={[{ flex: 1 }, styles.container]}>
                    <Image style={Values.styles.logo} source={require('./img/my_miracle.png')} />
                    <Text style={[Values.styles.appText, { textAlign: 'center', marginTop: 5 }]}>
                        REGÍSTRATE PARA EMPEZAR A DISFRUTAR
                    </Text>
                    <Item style={[styles.input]}>
                        <Input
                            placeholderTextColor={Values.appPrimaryColor}
                            style={[Values.styles.appText,
                            { color: Values.appPrimaryColor }]}
                            onChangeText={(text) => HandleInput.onChangeText(this, text, 'name')}
                            value={this.state.userData.name}
                            placeholder={'Nombre'} />
                    </Item>
                    <Item style={[styles.input]}>
                        <Input
                            placeholderTextColor={Values.appPrimaryColor}
                            style={[Values.styles.appText,
                            { color: Values.appPrimaryColor }]}
                            onChangeText={(text) => HandleInput.onChangeText(this, text, 'email')}
                            value={this.state.userData.email}
                            placeholder={'Correo Electrónico'} />
                    </Item>
                    <Item style={[styles.input]}>
                        <Input
                            placeholderTextColor={Values.appPrimaryColor}
                            style={[Values.styles.appText,
                            { color: Values.appPrimaryColor }]}
                            onChangeText={(text) => HandleInput.onChangeText(this, text, 'phone_number')}
                            value={this.state.userData.phone_number}
                            placeholder={'Teléfono'} />
                    </Item>

                    <Item style={[styles.input]}>
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
                            this.doRegister()
                        }
                    } style={[styles.btn, styles.btn1]}>
                        <Text style={[Values.styles.btnText]}>
                            REGISTRARME
                        </Text>
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
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
        marginTop: 20,
    },

})

export default RegisterUserData;