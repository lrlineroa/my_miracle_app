import React, { Component } from 'react';
import { View,ScrollView, Text, StyleSheet } from 'react-native';
import AppContainer from './layout/AppContainer';
import { CardItem, Card, Icon } from 'native-base';
import Common from '../../common/Common';
import Values from '../../common/Values';
import moment from 'moment';
import AppAsyncStorage from '../../common/AppAsyncStorage';
import appConstants from '../../common/AppConstants';
const noRecomendationsView = <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
    <Text style={{ fontFamily: 'segoeuil', fontSize: 22, color: Values.appPrimaryColor }}>
        Aún sin Recomendaciones :(
    </Text>
</View>
class Recomendations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recomendations: []
        }
        
    }
    componentDidMount(){
        this.loadRecomendations()
    }
    async loadRecomendations(){
        let recomendations=JSON.parse(await AppAsyncStorage.retrieveData(appConstants.database.recomendation.RECOMENDATIONS))
        this.setState({
            recomendations
        })
    }
    render() {
        return (<AppContainer context={this} >
            <View style={styles.main}>
                {
                    this.state.recomendations.length > 0 ?
                        <ScrollView>
                            <Text style={styles.title}>
                                Mis Recomendaciones
                            </Text>
                            {this.state.recomendations.map(
                                (recomendation, idx) => {
                                    return (
                                        <Card key={'phrase_' + idx} style={styles.card}>
                                            <CardItem
                                                style={[styles.cardItemBody]}
                                                cardBody>
                                                <Text style={[styles.phrase_text]}>
                                                    {recomendation[appConstants.database.recomendation.RECOMENDATION]}
                                                </Text>
                                            </CardItem>
                                            <CardItem style={{ paddingTop: 0 }}>
                                                <Icon style={{ fontSize: 20, color: 'gray' }} name='rocket' />
                                                <Text style={{ fontFamily: 'segoeuir' }}>
                                                    {Common.getFullTime(recomendation[appConstants.database.commonAttributes.CREATED_AT])}
                                                </Text>
                                                <Text style={{ marginLeft:5,fontFamily:'segoeuil'}}>
                                                    Por: Angélica F.
                                                </Text>
                                            </CardItem>
                                        </Card>
                                    )
                                }
                            )}
                        </ScrollView>
                        :
                        noRecomendationsView
                }

            </View>
        </AppContainer>);
    }
}

export default Recomendations;

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