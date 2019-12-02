import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Values from '../../common/Values';
import { Button, Card, Icon, CardItem } from 'native-base';
import appConstants from '../../common/AppConstants';
import AppContainer from './layout/AppContainer';
import Common from '../../common/Common';
import InputAPhrase from './prhases/InputAPhrase';

import { NavigationEvents } from 'react-navigation';
import { LinearGradient } from 'expo-linear-gradient';
import Meditation from './Meditation';
import PushNotification from 'react-native-push-notification';
class CurrentPhrase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldAskAPrhase: false,
            toMeditate: false,
            phrase: {}
        }
        
        this.phraseEnteredSuccessfully = this.phraseEnteredSuccessfully.bind(this)
        this.loadCurrentPhrase = this.loadInformation.bind(this)
        this.onMeditationFinish = this.onMeditationFinish.bind(this)
    }
    componentDidMount(){
        if(global.initialRouteName){
            this.props.navigation.navigate('Mensaje diario')
        }
    }
    
    
    onMeditationFinish() {
        this.setState({
            toMeditate: false,
        })
    }
    phraseEnteredSuccessfully() {
        this.loadInformation();
        this.setState({
            shouldAskAPrhase: false
        })
    }
    componentWillUnmount() {
        console.log('chauuu')
        if (this.listener)
            this.listener.remove()
    }

    async loadInformation(notificationId = null) {
        //await Common.updateLastPhraseInformation(notificationId)
        if (await Common.shouldAskAPrhase()) {
            this.setState({
                shouldAskAPrhase: true,
                isLoading: false,
            })
        } else {
            let currentUserPhrases = (await Common.getUserPhrases())[appConstants.CURRENT_USER_PHRASES];
            let currentUserPhrase = currentUserPhrases ? currentUserPhrases.phrases[currentUserPhrases.phrases.length - 1] : {}
            this.setState({
                isLoading: false,
                phrase: currentUserPhrase
            })
        }
    }

    render() {
        if (this.state.toMeditate)
            return <Meditation onFinish={this.onMeditationFinish} />
        if (this.state.shouldAskAPrhase)
            return (
                <AppContainer context={this}>
                    <InputAPhrase proccessOk={this.phraseEnteredSuccessfully} />
                </AppContainer>
            )
        return (
            <AppContainer context={this}>
                <NavigationEvents
                    onWillFocus={async () => {
                        // await Common.clearPhrases()
                        // Common.clearAllNotifications()
                        this.loadInformation();
                    }}
                    onWillBlur={
                        () => {
                            console.log()
                            if (this.listener)
                                this.listener.remove()
                        }
                    }
                />
                <LinearGradient
                    style={[{ flex: 1 }]}
                    colors={[Values.appSecondaryColor, Values.appThirdColor]}
                >
                    <Card style={[styles.card]}>
                        <CardItem style={[styles.cardItemHeader]}>
                            <Text style={[Values.styles.appSecondaryText, { color: Values.appPrimaryColor }]}>
                                Tu Frase de hoy
                                </Text>
                        </CardItem>
                        <CardItem style={[styles.cardItemBody]} cardBody>
                            <Text style={styles.textPhrase}>
                                {this.state.phrase ? this.state.phrase.phrase : ''}
                            </Text>
                        </CardItem>
                        <CardItem style={{ paddingTop: 0 }}>
                            <Icon style={{ fontSize: 20, color: 'gray' }} name='alarm' />
                            <Text style={{ fontFamily: 'segoeuir' }}>
                                {this.state.phrase ? Common.getTime(this.state.phrase[appConstants.phrase.NEXT_REMINDER]) : ''}
                            </Text>
                            {/* <Text style={{ marginLeft: 8, fontFamily: 'segoeuir' }}>
                                reps: {this.state.phrase ? ' ' + this.state.phrase.reps : ''}
                            </Text> */}
                        </CardItem>
                        <CardItem style={[Values.styles.paddingZero, { flexDirection: 'column' }]}>
                            <Button onPress={
                                () => {
                                    this.setState({
                                        toMeditate: true,
                                    })
                                }
                            } style={styles.btn}>
                                <Text style={[Values.styles.appSecondaryText, { color: 'white' }]}>
                                    Meditar
                                </Text>
                            </Button>
                        </CardItem>
                    </Card>
                </LinearGradient>
            </AppContainer>
        );
    }
}

export default CurrentPhrase;

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
    textPhrase: {
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