import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from 'expo-constants';
import { NavigationEvents } from 'react-navigation';
import Values from '../../common/Values';
import appConstants from '../../common/AppConstants';
class RegisterQR extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            scanned: false,
        }


    }
    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }

    };
    goTo(page, params = {}) {
        const { navigate } = this.props.navigation;
        navigate(page, params)
    }
    handleBarCodeScanned = ({ type, data }) => {
        this.setState({
            scanned: true
        })
        try {
            data = JSON.parse(data)
            if (data.app && data.message 
                && data.app=="MyMiracle" && data.message=="Bienvenido" ) {
                this.showAlert('Código Escaneado', 'Completa tus datos', [{
                    text: 'Continuar',
                    onPress: () => { this.goTo(appConstants.appRoutes.REGISTER_USER_DATA) }
                }]);

            } else {
                this.showAlert('Lo sentimos', 'Escanea un código válido', [{
                    text: 'Ok',
                    onPress:() => { this.setState({ scanned: false }) }
                }])
            }

        } catch (error) {
            console.log(error.message);

            this.showAlert('Lo sentimos', 'Escanea un código válido', [{
                text: 'Ok',
                onPress:() => { this.setState({ scanned: false }) }
            }])
        }

    };

    showAlert(title, message, btns = []) {
        btns = btns.length == 0 ? [{ text: 'Continuar' }] : btns;
        Alert.alert(title, message, btns)
    }
    render() {
        const { hasCameraPermission, scanned } = this.state;
        if (hasCameraPermission === null) {
            return (
                <View style={[Values.styles.container, Values.styles.centered]}>
                    <Text style={Values.styles.promptTitle}>Esperando los permisos de cámara</Text>
                </View>

            )
        }
        if (hasCameraPermission === false) {
            return (
                <View style={[Values.styles.container, Values.styles.centered]}>
                    <Text style={Values.styles.promptTitle}>Sin Acceso a la cámara</Text>
                </View>

            )

        }
        return (<View style={[Values.styles.container]}>
            <NavigationEvents
                onDidFocus={() => {
                    this.setState({
                        scanned: false
                    })
                }}
            />
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.qrReaderContainer}>
                <Image style={styles.qrFrame} source={require('./img/qrFrame.png')} />
            </View>
            <View style={[{
                height: 3,
                backgroundColor: (this.state.scanned ? 'green' : 'red')
            }]}>

            </View>
            <View style={styles.imageContainer}>
                <Text style={[styles.title]}>Apunta con tu cámara el código QR</Text>
                <Image style={[styles.image]} source={require('./img/img2.png')} />
            </View>
        </View>);
    }
}
const styles = StyleSheet.create({
    qrReaderContainer: {
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        height: 320, //cambió con respecto a XD
        alignItems: 'center',
    },
    qrFrame: {
        alignSelf: 'center',
        height: 254,//cambió con respecto a XD
        width: 250.98,//cambió con respecto a XD
    },
    imageContainer: {
        flex: 1,
        backgroundColor: Values.appPrimaryColor
    },
    title: {
        paddingTop: 18,
        fontFamily: 'segoeuil',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
    image: {
        height: 278,
        width: 278,
        alignSelf: 'center',
        marginTop:-15
    },
    marginEqual: {
        marginLeft: 43,
        marginRight: 43,
    },
})
export default RegisterQR;