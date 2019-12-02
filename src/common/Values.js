import { StyleSheet } from 'react-native';
export default values = {
    styles: StyleSheet.create({
        centered: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        container: {
            flex: 1,
        },
        promptTitle:{
            fontSize:20,
            fontFamily: 'Roboto',
        },
        paddingZero:{
            paddingBottom:0,
            paddingTop:0,
            paddingRight:0,
            paddingLeft:0,
        },
        appText:{
            fontSize:16,
            fontFamily: 'Roboto-Regular',
        },
        appSecondaryText:{
            fontSize:20,
            fontFamily:'segoeuil'
        },
        btnText:{
            fontSize:14,
            color:'white',
            fontFamily:'Roboto_medium',
            letterSpacing:1.25
        },
        logo: {
            alignSelf: 'center',
            height: 124,
            width: 168,
            marginTop: 49
        },
    }),
    appPrimaryColor:'#36B1BF',
    appSecondaryColor:'#4AD9D9',
    appThirdColor:'#E9F1DF',
    buttonColor:'#F5A503',
}