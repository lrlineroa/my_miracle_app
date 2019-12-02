import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import EntryPoint from './UI/EntryPoint';
import Login from './UI/Login';
import RegisterUserData from './UI/RegisterUserData';
import RegisterQR from './UI/RegisterQR';
import MyDrawerNavigator from './UI/DrawerHome';


const MainNavigator = createStackNavigator({
  EntryPoint: { screen: EntryPoint },
  Login: { screen: Login },
  DrawerHome: MyDrawerNavigator,
  RegisterUserData: { screen: RegisterUserData },
  RegisterQR: { screen: RegisterQR },
},
  {
    headerMode: 'none',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f00',
        alignContent: 'center',

      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        marginLeft: 0
      },
    },
  }
);


const Router = createAppContainer(MainNavigator);

export default Router;