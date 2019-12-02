import React, { Component } from 'react';
import { View,Text,Image,StyleSheet } from 'react-native';
import Values from './Values';
class Loader extends Component {
    state = {  }
    render() { 
        return ( 
        <View style={[{flex:1},Values.styles.centered]}>
            <Image style={styles.logo} source={require('../components/UI/img/my_miracle.png')} />
            <Text style={[Values.styles.appText,{marginTop:5}]}>
                {this.props.message}
            </Text>
            {/* {
                global.HermesInternal &&
                <Text>
                    usando hermes
                </Text>
            } */}
        </View> );
    }
}
 
export default Loader;
const styles=StyleSheet.create({
    logo: {
        alignSelf: 'center',
        height: 124,
        width: 168,
        marginTop: 49
    }
})