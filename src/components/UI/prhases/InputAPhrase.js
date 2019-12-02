import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, Alert, KeyboardAvoidingView,Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Values from '../../../common/Values';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Container, Header, Left, Button, Icon, Body, Title, Card, CardItem, Item, Input, Label } from 'native-base';
import Loader from '../../../common/Loader';
import * as SecureStore from 'expo-secure-store';
import appConstants from '../../../common/AppConstants';
import AppAsyncStorage from '../../../common/AppAsyncStorage';
import Toast, { DURATION } from 'react-native-easy-toast';
import * as Permissions from 'expo-permissions';

import moment from 'moment';
import Common from '../../../common/Common';
const loadingMessages = ['Cargando Datos', 'Guardando frase']
class InputAPhrase extends Component {

    constructor(props) {
        super(props);
        this.toast = null;
        this.state = {
            phrase: '',
            isDateTimePickerVisible: false,
            isLoading: false,
            loadingMessagesIndex: 0,
            userData: {},
            isDayOfSavePhrase: false,
        }

    }
    async componentDidMount() {
        let userData = JSON.parse(await SecureStore.getItemAsync(appConstants.USER_INFO))
        this.setState({
            userData,
            isLoading: false
        })
    }
    showDateTimePicker = () => {

        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        //TODO poner a notificar el día siguiente
        this.savePhrase(moment(date).add(1, appConstants.REPS_INTERVAL).toDate())//)//.add(1,'day'))
        this.hideDateTimePicker();
    };
    async savePhrase(date) {
        let data = await AppAsyncStorage.retrieveData(appConstants.USER_PHRASES)
        let allUserPhrases = data ? JSON.parse(data) : []
        let currentUserPhrases = allUserPhrases.find(
            (d) => {
                return d.user_id == this.state.userData.user._id
            }
        )
        if (!currentUserPhrases) {
            currentUserPhrases = {
                user_id: this.state.userData.user._id,
                phrases: []
            }
            allUserPhrases.push(currentUserPhrases)
        }
        let notificationId=Math.floor(1000*Math.random()+1);
        
        Common.scheduleNotification('Tu frase de poder',this.state.phrase, date,''+notificationId)

        let phrase = {};
        phrase[appConstants.phrase.PHRASE] = this.state.phrase
        phrase[appConstants.phrase.NEXT_REMINDER] = date
        phrase[appConstants.phrase.CREATED_AT] = moment().toDate()
        phrase[appConstants.phrase.NOTIFICATION_ID] = notificationId
        phrase[appConstants.phrase.REPS] = 0




        // this.showAlert('Perfecto', moment(date).format('dddd DD-MMMM-YY hh:mm a'))
        currentUserPhrases.phrases.push(phrase)
        await AppAsyncStorage.storeData(appConstants.USER_PHRASES, JSON.stringify(allUserPhrases))
        this.toast.show('Frase Guardada', 500, () => {
            this.setState({
                isLoading: false,
                loadingMessagesIndex: 0,
                hasNotificationPermission: false,
                phrase: ''
            })
            this.props.proccessOk()
        })
    }

    showAlert(title, message, btns = []) {
        btns = btns.length == 0 ? [{ text: 'Continuar' }] : btns;
        Alert.alert(title, message, btns)
    }
    async setNotification() {
        this.setState({
            isLoading: true,
            loadingMessagesIndex: 1
        })

        const { status } = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (status === 'granted') {
            this.showAlert('¡Qué bien!', '🤗Agenda la hora perfecta para tu recordatorio diario',
                [{
                    text: 'Continuar', onPress: () => {

                        this.showDateTimePicker()
                    }
                }])
        } else {
            this.showAlert('Upps', 'La frase No se Guardó');
            this.setState({
                isLoading: false,
                loadingMessagesIndex: 0
            })
        }

    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1 }}>
                    <Loader message={loadingMessages[this.state.loadingMessagesIndex]} />
                    <Toast ref={
                        ref => {
                            this.toast = ref
                        }
                    } />
                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                        mode='time'
                    />
                </View>
            )
        }

        return (
            // <ScrollView style={[styles.container]}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='height' enabled>
                <View style={[{ flex: 1 }]}>
                    <Toast ref={
                        ref => {
                            this.toast = ref
                        }
                    } />
                    <LinearGradient
                        style={[styles.main]}
                        colors={[Values.appSecondaryColor, Values.appThirdColor]}
                    >
                        <ScrollView>
                            <Text style={[styles.title]}>
                                Hola, necesitamos una Frase para el recordatorio de mañana
                            </Text>

                            <Card style={[styles.card]}>
                                <CardItem style={[styles.cardItemHeader]}>
                                    <Text style={[Values.styles.appSecondaryText, { color: Values.appPrimaryColor }]}>
                                        Crea tu Frase de Poder
                                </Text>
                                </CardItem>
                                <CardItem style={[styles.cardItemBody]} cardBody>
                                    <Item floatingLabel>
                                        <Label style={[{ textAlign: 'center' }, styles.input]}> Escribe aquí... </Label>
                                        <Input style={styles.input} multiline value={this.state.phrase} onChangeText={
                                            (text) => {
                                                if (text.length <= 150) {
                                                    this.setState({
                                                        phrase: text
                                                    })
                                                }
                                            }
                                        } />
                                    </Item>
                                    <Text style={{ fontFamily: 'segoeuil', fontSize: 12 }}>{this.state.phrase.length}/150</Text>
                                </CardItem>
                                <CardItem style={[Values.styles.paddingZero, { flexDirection: 'column' }]}>
                                    <Button onPress={
                                        () => {

                                            if (this.state.phrase == '') {
                                                this.showAlert('Lo sentimos', 'No has ingresado la frase')
                                            } else {
                                                this.setNotification();
                                            }
                                        }
                                    } style={styles.btn}>
                                        <Text style={[Values.styles.appSecondaryText, { color: 'white' }]}>
                                            Guardar y agendar
                                    </Text>
                                    </Button>
                                </CardItem>
                            </Card>
                        </ScrollView>

                    </LinearGradient>
                </View>
            </KeyboardAvoidingView>
            // </ScrollView>
        );
    }
}

export default InputAPhrase;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cardItemHeader: {
        backgroundColor: Values.appThirdColor,
        paddingTop: 27,
        paddingBottom: 27,
        justifyContent: 'center',
    },
    cardItemBody: {
        paddingLeft: 40,
        paddingRight: 40,
        height: 240,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    title: {
        marginTop: 33,
        fontSize: 20,
        fontFamily: 'segoeuir',
        alignSelf: 'center',
        color: 'white',
        textAlign: 'center'
    },
    main: {
        flex: 1
    },
    card: {
        marginTop: 45,
        marginRight: 12,
        marginLeft: 12,
    },
    input: {
        fontSize: 20,
        fontFamily: 'segoeuir'
    },
    btn: {
        alignSelf: 'stretch',
        height: 70,
        borderRadius: 0,
        backgroundColor: Values.buttonColor,
        justifyContent: 'center',
    },
})