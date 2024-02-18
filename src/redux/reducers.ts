import { ALL_MESSAGES, CHATS, CHATS_ID, USER_DATA } from "./actions";

import { Actions } from "@/lib/definitions";

const initialState = {
    actualyUser: localStorage.getItem('actualyUser') || '', // Obtener del localStorage si existe
    actualyUid: localStorage.getItem('actualyUid') || '', // Obtener del localStorage si existe
    message: [],
    chatId: '',
    user: {},
    messagesSaved: []
}

const rootReducer = (state = initialState, action: Actions) => {
    switch (action.type) {
        case USER_DATA:
            localStorage.setItem('actualyUser', action.payload.email); // Guardar en localStorage
            localStorage.setItem('actualyUid', action.payload.uid); // Guardar en localStorage
            return {
                ...state,
                actualyUser: action.payload.email,
                actualyUid: action.payload.uid
            }
        case CHATS_ID:
            return {
                ...state,
                chatId: action.payload,
            }
        case CHATS:
            return {
                ...state,
                user: action.payload
            }
        case ALL_MESSAGES:
            return {
                ...state,
                messagesSaved: action.payload
            }

        default:
            return state;
    }
}

export default rootReducer;
