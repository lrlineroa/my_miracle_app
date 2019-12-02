import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Values from '../../common/Values';

import Loader from '../../common/Loader';
import appConstants from '../../common/AppConstants';
import { Container, Header, Left, Button, Icon, Body, Title, Card, CardItem, Item, Input, Label, Right } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import Common from '../../common/Common';
import InputAPhrase from './prhases/InputAPhrase';
import AppContainer from './layout/AppContainer';
const loadingMessages = ['Cargando Datos']
const noPrasesView = <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
    <Text style={{ fontFamily: 'segoeuil', fontSize: 22, color: Values.appPrimaryColor }}>
        Aún sin Frases :(
    </Text>
</View>
class MyPhrases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            loadingMessagesIndex: 0,
            phrases: [],
            isDateTimePickerVisible: false,
            shouldAskAPrhase: false,
        }
        this.loadInformation()
        this.phraseEnteredSuccessfully = this.phraseEnteredSuccessfully.bind(this)
        this.loadPhrases = this.loadInformation.bind(this)
    }

    async loadInformation() {
        // if (await Common.shouldAskAPrhase()) {
        //     this.setState({
        //         shouldAskAPrhase: true,
        //         isLoading: false,
        //     })
        // } else {
            let currentUserPhrases = (await Common.getUserPhrases())[appConstants.CURRENT_USER_PHRASES];
            this.setState({
                isLoading: false,
                phrases: currentUserPhrases ? currentUserPhrases.phrases : []
            })
        // }
    }

    phraseEnteredSuccessfully() {
        this.loadInformation();
        this.setState({
            shouldAskAPrhase: false
        })
    }
    render() {
        if (this.state.isLoading)
            return (<Loader message={loadingMessages[this.state.loadingMessagesIndex]} />)
        if (this.state.shouldAskAPrhase)
            return (
                <AppContainer context={this}>
                    <InputAPhrase proccessOk={this.phraseEnteredSuccessfully} />
                </AppContainer>
            )
        return (
            <AppContainer context={this}>
                <NavigationEvents
                    onWillFocus={() => {
                        this.loadInformation()
                    }}
                />
                <View style={styles.main}>
                    {
                        this.state.phrases.length > 0 ?
                            <ScrollView>
                                <Text style={styles.title}>
                                    Mis Frases
                                    </Text>
                                {this.state.phrases.map(
                                    (p, idx) => {
                                        return (
                                            <Card key={'phrase_' + idx} style={styles.card}>
                                                <CardItem
                                                    style={[styles.cardItemBody]}
                                                    cardBody>
                                                    <Text style={[styles.phrase_text]}>
                                                        {p.phrase}
                                                    </Text>
                                                </CardItem>
                                                <CardItem style={{ paddingTop: 0 }}>
                                                    <Icon style={{ fontSize: 20, color: 'gray' }} name='alarm' />
                                                    <Text style={{ fontFamily: 'segoeuir' }}>
                                                        {Common.getTime(p[appConstants.phrase.NEXT_REMINDER])}
                                                    </Text>
                                                    {/* <Text style={{ marginLeft: 8, fontFamily: 'segoeuir' }}>
                                                        reps: {' ' + p.reps}
                                                    </Text> */}
                                                </CardItem>
                                            </Card>
                                        )
                                    }
                                )}
                            </ScrollView>
                            :
                            noPrasesView
                    }

                </View>
                {/* <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    mode='time'
                /> */}
            </AppContainer>
        );
    }
}

export default MyPhrases;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Values.appThirdColor
    },
    title: {
        marginTop: 15,
        marginBottom: 15,
        fontSize: 20,
        fontFamily: 'segoeuir',
        alignSelf: 'center',
        color: Values.appSecondaryColor,
        textAlign: 'center'
    },
    phrase_text: {
        fontSize: 16,
        fontFamily: 'segoeuil'
    },
    card: {
        marginRight: 12,
        marginLeft: 12,
    },
    cardItemBody: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
})