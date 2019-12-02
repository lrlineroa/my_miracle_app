import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppContainer from './layout/AppContainer';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardItem } from 'native-base';
import Values from '../../common/Values';
import appConstants from '../../common/AppConstants';
import AppAsyncStorage from '../../common/AppAsyncStorage';
class DailyMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:''
        }
        this.loadMessage()        
    }
    async loadMessage(){
        let message=JSON.parse(await AppAsyncStorage.retrieveData(appConstants.database.dailymessage.DAILY_MESSAGE))
        this.setState({
            message
        })
    }
    render() {
        return (<AppContainer context={this} >
            <LinearGradient
                style={[{ flex: 1 }]}
                colors={[Values.appSecondaryColor, Values.appThirdColor]}
            >
                <Card style={[styles.card]}>
                    <CardItem style={[styles.cardItemHeader]}>
                        <Text style={[Values.styles.appSecondaryText, { color: Values.appPrimaryColor }]}>
                            Mensaje Diario
                                </Text>
                    </CardItem>
                    <CardItem style={[styles.cardItemBody]} cardBody>
                        <Text style={styles.textPhrase}>
                        {this.state.message[appConstants.database.dailymessage.DAILY_MESSAGE]}
                        </Text>
                    </CardItem>
                    </Card>
            </LinearGradient>
        </AppContainer>);
    }
}

export default DailyMessage;

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