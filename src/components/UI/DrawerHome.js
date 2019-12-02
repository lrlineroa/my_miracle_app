import { createDrawerNavigator } from 'react-navigation-drawer';
import CustomDrawerContentComponent from '../../common/CustomDrawerContentComponent';
import MyPhrases from "./MyPhrases";
import CurrentPhrase from './CurrentPhrase';
import DailyMessage from './DailyMessage';
import Recomendations from './Recomendations';
import Contact from './Contact';

const MyDrawerNavigator = createDrawerNavigator({
  'Mis Frases de Poder': {
    screen: MyPhrases,
  },
  'Mi Frase del día': {
    screen: CurrentPhrase
  },
  'Mensaje diario': {
    screen: DailyMessage
  },
  'Recomendaciones': {
    screen: Recomendations
  },
  'Contacto': {
    screen: Contact
  },
},
  {
    contentComponent: CustomDrawerContentComponent,
    initialRouteName:global.initialRouteName
  });
  
export default MyDrawerNavigator;