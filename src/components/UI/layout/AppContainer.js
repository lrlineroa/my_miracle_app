import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Container, Header, Left, Button, Body, Title, Icon, Right } from 'native-base';
import Values from '../../../common/Values';

class AppContainer extends Component {
    state = {}
    render() {
        return (
            <View style={[{flex:1}]}>
                <Container>
                    <Header style={{ backgroundColor: Values.appPrimaryColor }}>
                        <Left style={{flex:1}}>
                            <Button onPress={() => {
                                this.props.context.props.navigation.openDrawer()
                            }} transparent>
                                <Icon name='menu' />
                            </Button>
                        </Left>
                        <Body style={{flex:1}}>
                            <Title style={[Values.styles.appSecondaryText]}>My Miracle</Title>
                        </Body>
                        <Right style={{flex:1}}>
                            
                        </Right>
                    </Header>
                    {this.props.children}
                </Container>
            </View>
        );
    }
}

export default AppContainer;