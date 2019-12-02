const appConstants = {
    database:{
        user:{
            USER_ID:'user_id',
            PUSH_TOKEN:'push_token',
        },
        recomendation:{
            RECOMENDATIONS:'recomendations',
            RECOMENDATION:'recomendation',
        },
        dailymessage:{
            DAILY_MESSAGE:'daily_message',
        },
        commonAttributes:{
            CREATED_AT:'createdAt',
            UPDATED_AT:'updatedAt',
        }
    },
    appRoutes: {
        DAILY_MESSAGE:'Mensaje diario',
        ENTRY_POINT: "EntryPoint",
        LOGIN: "Login",
        REGISTER_QR: "RegisterQR",
        REGISTER_USER_DATA: "RegisterUserData",
        DRAWER_HOME: 'DrawerHome',//ONLY FOR TEST
        MY_PHRASES: 'Mis Frases',
    },
    appVersion: {
        UNCHECKED: 'unchecked',
        NEEDS_UPDATE: "needs_update",
        UP_TO_DATE: "up_to_date"
    },
    validation: {
        TESTING: 'testing',
        OK: 'OK',
        required: {
            EMAIL: 'El campo Email es requerido',
            PASSWORD: 'El campo Password es requerido',
            NAME: 'El campo Nombre es requerido',
            LAST_NAME: 'El campo Apellido es requerido',
            PHONE_NUMBER: 'El campo Teléfono es requerido',
        },
        invalid: {
            EMAIL: 'El campo Email es incorrecto',
            PHONE_NUMBER: 'El campo Teléfono es incorrecto',
            PHONE_NUMBER_EMAIL: 'El Campo no concuerda con un teléfono o un email'
        },

    },
    notifications: {
        RECEIVED: 'received',
        NOTIFICATIONS_LISTENER: 'notifications_listener'
    },
    USER_INFO: "user_info",
    USER_PHRASES: "user_phrases",
    CURRENT_USER_PHRASES: "currentUserPhrases",
    ALL_USER_PHRASES: "allUserPhrases",
    MY_POWER_PHRASES: 'Mis Frases de Poder',
    PHRASES: 'phrases',
    phrase: {
        PHRASE: 'phrase',
        NEXT_REMINDER: 'next_reminder',
        CREATED_AT: 'created_at',
        NOTIFICATION_ID: 'notificationId',
        REPS: 'reps',
        LAST_UPDATE:'last_update',
    },
    MAX_REPS: 7,//2,//
    MAX_PHRASES_LENGTH: 10,//3,//
    REPS_INTERVAL:'day',//'minute',//
    NOTIFICATION_FOR_ASK_NEW_PHRASE:'notificationForAskNewPhrase',
    PHRASE_REMINDER:'phrase_reminder',
    DEVICE_PUSH_TOKEN:'device_push_token',
    DRAWER_INITIAL_VIEW:'drawer_initial_view',
}



export default appConstants;
