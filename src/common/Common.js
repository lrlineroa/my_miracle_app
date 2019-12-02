import * as SecureStore from 'expo-secure-store';
import AppAsyncStorage from './AppAsyncStorage';
import appConstants from './AppConstants';
import { Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
// moment.locale('es', {
//     months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
//     monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
//     weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sábado'.split('_'),
//     weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
//     weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
// });
export default class Common {
    static async shouldAskAPrhase() {
        // return false
        let currentUserPhrases = (await Common.getUserPhrases())[appConstants.CURRENT_USER_PHRASES];
        //console.log(currentUserPhrases)
        //condiciones para saber si se necesita pedir una frase
        //1. El arreglo de frases está vacío
        if (!currentUserPhrases || currentUserPhrases[appConstants.PHRASES].length == 0)
            return true
        if (currentUserPhrases != undefined) {
            let lastPhrase = currentUserPhrases.phrases[currentUserPhrases.phrases.length - 1]
            // console.log(lastPhrase);
            // if (lastPhrase[appConstants.phrase.REPS] < appConstants.MAX_REPS) {
            //     return false;
            // }
            if (currentUserPhrases.phrases.length < appConstants.MAX_PHRASES_LENGTH) {
                //Si la fecha actual es mayor al día siguiente del último recordatorio de la frase
                //sólo ahí entre a pedir una nueva frase, retorne true
                let goToAskAPrhase = moment().isSameOrAfter(
                    moment(lastPhrase[appConstants.phrase.NEXT_REMINDER]).add((appConstants.MAX_REPS), appConstants.REPS_INTERVAL));
                if (goToAskAPrhase) {
                    Common.clearAllNotifications();
                    return true;
                }

            }
        }
        return false
    }

    static async getUserPhrases() {
        let userData = JSON.parse(await SecureStore.getItemAsync(appConstants.USER_INFO))
        if (userData) {
            let userId = userData.user._id
            let data = await AppAsyncStorage.retrieveData(appConstants.USER_PHRASES)
            let allUserPhrases = data ? JSON.parse(data) : []
            let currentUserPhrases = allUserPhrases.find(
                (d) => {
                    return d.user_id == userId
                }
            )
            if (!currentUserPhrases) {
                currentUserPhrases = {}
                currentUserPhrases[appConstants.PHRASES] = []
                currentUserPhrases[appConstants.database.user.USER_ID] = userId
            }
            return { allUserPhrases, currentUserPhrases }

        }
        return null
    }
    static async clearPhrases() {
        let userData = JSON.parse(await SecureStore.getItemAsync(appConstants.USER_INFO))
        if (userData) {
            let userId = userData.user._id
            let data = await AppAsyncStorage.retrieveData(appConstants.USER_PHRASES)
            let allUserPhrases = data ? JSON.parse(data) : []
            let currentUserPhrases = allUserPhrases.find(
                (d) => {
                    return d.user_id == userId
                }
            )
            currentUserPhrases.phrases = []
            console.log(currentUserPhrases)
            await AppAsyncStorage.storeData(appConstants.USER_PHRASES, JSON.stringify(allUserPhrases))
        }
    }
    static clearAllNotifications() {
        PushNotification.cancelAllLocalNotifications();
    }
    // static async updateLastPhraseInformation(notificationId) {
    //     let phrasesObject = await Common.getUserPhrases()
    //     let currentUserPhrases = phrasesObject[appConstants.CURRENT_USER_PHRASES];
    //     let allUserPhrases = phrasesObject[appConstants.ALL_USER_PHRASES]
    //     currentUserPhrases = currentUserPhrases.phrases;

    //     //obtenemos la última
    //     let lastUserPhrase = currentUserPhrases[currentUserPhrases.length - 1]

    //     if (lastUserPhrase) {
    //         //si la fecha actual es mayor o iguar a la fecha del siguiente recordatorio sume la repetición,
    //         lastUserPhrase[appConstants.phrase.REPS] = appConstants.MAX_REPS;
    //         Common.clearAllNotifications();
    //         // if (moment().isSameOrAfter(moment(lastUserPhrase[appConstants.phrase.NEXT_REMINDER]))) {
    //         //     if (lastUserPhrase[appConstants.phrase.REPS] < appConstants.MAX_REPS) {
    //         //         lastUserPhrase[appConstants.phrase.REPS]++
    //         //         if (lastUserPhrase[appConstants.phrase.REPS] < appConstants.MAX_REPS)
    //         //             lastUserPhrase[appConstants.phrase.NEXT_REMINDER] =
    //         //                 moment(lastUserPhrase[appConstants.phrase.NEXT_REMINDER]).add(1, appConstants.REPS_INTERVAL).toDate()
    //         //     }
    //         // }

    //         await AppAsyncStorage.storeData(appConstants.USER_PHRASES, JSON.stringify(allUserPhrases))
    //     }
    // }

    static getTime(time) {
        if (time != undefined)
            return moment(time).format('hh:mm a')
        return 'No time'
    }

    static getFullTime(time) {
        return moment(time).format('D {1} MMMM {1} YYYY').replace('{1}', 'de').replace('{1}', 'de')
    }

    static showAlert(title, message, btns = []) {
        btns = btns.length == 0 ? [{ text: 'Continuar' }] : btns;
        Alert.alert(title, message, btns)
    }

    static async  scheduleNotification(title, message, date, id) {
        for (let index = 0; index < appConstants.MAX_REPS; index++) {
            Common.scheduleOnlyOneNotification(title, message, date, (id + index), null);
            date = moment(date).add(1, appConstants.REPS_INTERVAL).toDate();
        }
        let currentUserPhrases = (await Common.getUserPhrases())[appConstants.CURRENT_USER_PHRASES];

        if (currentUserPhrases[appConstants.PHRASES].length < appConstants.MAX_PHRASES_LENGTH) {

            Common.scheduleOnlyOneNotification("!Enhorabuena! 😊"
                , 'Es momento de grabar otra frase',
                date,
                '' + (id + appConstants.MAX_REPS), appConstants.REPS_INTERVAL);
        }
    };
    static scheduleOnlyOneNotification(title, message, date, id, repeatType) {
        let notification = {
            id: '' + (id),
            title,
            message,
            date,
            repeatType,
        }
        PushNotification.localNotificationSchedule(notification);
    }
}
