import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Values from '../../common/Values';
import { LinearGradient } from 'expo-linear-gradient';
import CountDown from 'react-native-countdown-component';
import { Audio } from 'expo-av';
import { Button } from 'native-base';
const soundObject = new Audio.Sound();
class Meditation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mins: -10,
        }
        this.loadSound();
    }
    async loadSound() {
        try {
            await soundObject.loadAsync(require('../../assets/sounds/japanese-temple-bell.mp3'));
        } catch (error) {
            console.log('an error has ocurred at loading sound');
            console.log(error)
        }
    }
    render() {
        return (<View style={{flex:1}}>
            <LinearGradient
                style={[{ flex: 1 }, Values.styles.centered]}
                colors={[Values.appSecondaryColor, Values.appThirdColor]}
            >
                {
                    this.state.mins < 0
                        ?
                        <View style={[{ alignSelf: 'stretch', }]}>
                            <Text style={[Values.styles.appText, { textAlign: 'center' }]}>
                                ¿Cuánto tiempo quieres Meditar?
                            </Text>
                            <View style={[styles.btnsContainer]}>

                                <Button
                                    onPress={
                                        () => {
                                            this.setState({
                                                mins: 3
                                            })
                                        }
                                    }
                                    style={styles.btn}>
                                    <Text style={[Values.styles.appText, { color: 'white' }]}>
                                        3 minutos
                            </Text>
                                </Button>
                                <Button
                                    onPress={
                                        () => {
                                            this.setState({
                                                mins: 5
                                            })
                                        }
                                    }
                                    style={styles.btn}>
                                    <Text style={[Values.styles.appText, { color: 'white' }]}>
                                        5 minutos
                            </Text>
                                </Button>
                                <Button
                                    onPress={
                                        () => {
                                            this.setState({
                                                mins: 10
                                            })
                                        }
                                    }
                                    style={styles.btn}>
                                    <Text style={[Values.styles.appText, { color: 'white' }]}>
                                        10 minutos
                            </Text>
                                </Button>
                            </View>
                        </View>
                        :
                        <CountDown
                            until={60 * this.state.mins}//{10}//
                            onFinish={async () => {
                                await soundObject.replayAsync();
                                setTimeout(
                                    () => {
                                        this.props.onFinish();
                                    }
                                    , 2000)

                            }}
                            timeToShow={['M', 'S']}
                            timeLabels={{ m: 'Min', s: 'Seg' }}
                            size={20}
                        />
                }
            </LinearGradient>
        </View>);
    }
}

export default Meditation;

const styles = StyleSheet.create({
    btn: {
        backgroundColor: Values.buttonColor,
        padding: 5
    },
    btnsContainer: {
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'space-between',
        marginLeft: 5,
        marginRight: 5,
    },
})