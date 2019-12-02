import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView,TouchableOpacity,Image,Linking } from 'react-native';
import AppContainer from './layout/AppContainer';
import { Formik } from 'formik';
import Values from '../../common/Values';
import { Item, Input, Button } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import * as Yup from 'yup';

import Loader from '../../common/Loader';
import Common from '../../common/Common';
const consultationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'El nombre es muy corto!')
        .max(50, 'El nombre es muy laaargo!!')
        .required('El nombre es requerido'),
    email: Yup.string()
        .email('El email es inválido')
        .required('El email es requerido'),
    consultation: Yup.string()
        .min(5, 'Consulta Muy Corta')
        .required('Tu Consulta es Requerida'),
});
class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSending: false,
        }
    }

    sendInfo(values) {
        this.setState(
            {
                isSending: true,
            }
        )
        Axios.post('https://mymiracle.herokuapp.com/contact/api', values).then(
            (res) => {
                if (res.data.operation) {
                    Common.showAlert('hecho', 'Hemos recibido tu mensaje, te responderemos en menos de 1 día')
                }
                this.setState({
                    isSending: false
                })
                this.props.navigation.navigate('Mi Frase del día');
            }
        )
        setTimeout(
            () => {
                Common.showAlert('hecho', 'Hemos recibido tu mensaje, te responderemos en menos de 1 día')

            }
            , 2000)
        console.log(values)
    }
    render() {
        if (this.state.isSending)
            return <Loader message='Enviando Consulta' />
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
                <AppContainer context={this}>
                    <NavigationEvents
                        onWillFocus={
                            () => {
                                this.forceUpdate()
                            }
                        }
                    />
                    <View style={[styles.main, Values.styles.centered]}>
                        <Formik
                            enableReinitialize={true}
                            initialValues={{
                                name: this.props.navigation.getParam('name'),
                                email: this.props.navigation.getParam('email'),
                                consultation: ''
                            }}

                            onSubmit={values => this.sendInfo(values)}
                            validationSchema={consultationSchema}

                        >
                            {props => (
                                <View>
                                    <Text style={[styles.title]}>
                                        Formulario de Contacto
                                    </Text>
                                    <Item style={[styles.input]}>
                                        <Input
                                            placeholderTextColor={Values.appPrimaryColor}
                                            style={[Values.styles.appText,
                                            { color: Values.appPrimaryColor }]}
                                            onChangeText={props.handleChange('name')}
                                            onBlur={props.handleBlur('name')}
                                            defaultValue={props.values.name}
                                            value={props.values.name}
                                            placeholder={'Tu nombre'} />
                                    </Item>
                                    {
                                        props.errors.name && props.touched.name ?
                                            <Text style={styles.errorText}>{props.errors.name}</Text> :
                                            null
                                    }
                                    <Item style={[styles.input]}>
                                        <Input
                                            placeholderTextColor={Values.appPrimaryColor}
                                            style={[Values.styles.appText,
                                            { color: Values.appPrimaryColor }]}
                                            onChangeText={props.handleChange('email')}
                                            onBlur={props.handleBlur('email')}
                                            value={props.values.email}
                                            placeholder={'Tu correo'} />
                                    </Item>
                                    {
                                        props.errors.email && props.touched.email ?
                                            <Text style={styles.errorText}>{props.errors.email}</Text> :
                                            null
                                    }
                                    <Item style={[styles.input, { height: 150 }]}>
                                        <Input
                                            placeholderTextColor={Values.appPrimaryColor}
                                            style={[Values.styles.appText,
                                            { color: Values.appPrimaryColor }
                                            ]}
                                            multiline
                                            onChangeText={props.handleChange('consultation')}
                                            onBlur={props.handleBlur('consultation')}
                                            value={props.values.consultation}
                                            placeholder={'Tu consulta'} />
                                    </Item>
                                    {
                                        props.errors.consultation && props.touched.consultation ?
                                            <Text style={styles.errorText}>{props.errors.consultation}</Text> :
                                            null
                                    }
                                    <Button onPress={
                                        props.handleSubmit
                                    } style={[styles.btn, styles.btn1]}>
                                        <Text style={[Values.styles.btnText]}>
                                            ENVIAR
                                        </Text>
                                    </Button>
                                </View>
                            )}
                        </Formik>
                        <View style={[styles.socialContainer]}>
                            <TouchableOpacity onPress={() => {
                                Linking.openURL("https://www.facebook.com/Mymiracle.co/")
                            }}>
                                <Image style={styles.socialImage} source={require('./img/facebook.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Linking.openURL("https://www.instagram.com/mymiracle.eu/?hl=es-la")
                            }}>
                                <Image style={styles.socialImage} source={require('./img/instagram.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Linking.openURL("https://wa.me/573208395794")
                            }}>
                                <Image style={styles.socialImage} source={require('./img/wsp.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </AppContainer>
            </KeyboardAvoidingView>
        );
    }
}

export default Contact;

const styles = StyleSheet.create({
    socialImage:{
        width: 40,
        height: 40,
    },
    socialContainer: {
        alignSelf:'stretch',
        marginTop:20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 50,
        marginRight: 50,
    },
    title: {
        marginBottom: 10,
        fontSize: 20,
        fontFamily: 'segoeuil',
        textAlign: 'center',
        color: Values.appPrimaryColor,
    },
    main: {
        flex: 1,
        backgroundColor: '#fff',
    },
    btn: {
        alignSelf: 'center',
        height: 48,
        width: 252,
        borderRadius: 4,
        justifyContent: 'center',
    },
    btn1: {
        marginTop: 10,
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
        marginBottom: 10
    },
    card: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    errorText: {
        marginTop: -10,
        fontFamily: 'Roboto_regular',
        textAlign: 'center',
        color: 'red',
    },
})