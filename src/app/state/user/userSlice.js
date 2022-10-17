import { createSlice } from "@reduxjs/toolkit";

import { 
    SESSION_INITIAL_USER_ID,
    SESSION_INITIAL_USER_NAME,
 } from "../sessionStorage/sessionStorageSlice";

const initialState = {
    name: SESSION_INITIAL_USER_NAME || 'guest',
    connected: false,
    status: 'idle',
    id: SESSION_INITIAL_USER_ID || null,

    //FIXME - weird stuff going on here
    others: {}
}

const IDLE_TIMEOUT_MILLIS = 100;

let idleTimeout;

export const userSlice = createSlice({
    name: 'user',
    initialState,

    reducers: {
        setOwnName: (state, action) => {
            state.name = action.payload
        },

        setOwnConnected: (state, action) => {
            state.connected = !!action.payload;
        },

        setOwnStatus: (state, action) => {
            state.status = action.payload;
        },

        setOwnId: (state, action) => {
            state.id = action.payload;
        },


        setOtherUser: (state, action) => {
            const {
                name,
                status,
                color,
                id,                
            } = action.payload;

            state.others[id] = {
                name,
                status,
                color
            };
        },

        removeOtherUser: (state, action) => {
            delete state.others[action.payload.id]
        }


    },
});

export const {
    setOwnName,
    setOwnConnected,
    setOwnStatus,
    setOwnId,

    setOtherUser,
    removeOtherUser,

} = userSlice.actions;

export const selectOwnName = (state) =>  state.user.name;
export const selectOwnConnected = (state) =>  state.user.connected;
export const selectOwnStatus = (state) =>  state.user.status;
export const selectOwnId = (state) =>  state.user.id;

// export const selectOtherUsers = (state) => state.user.others.entries();

export const selectOtherUsers = (state) => Object.keys(state.user.others).map(id => [id, state.user.others[id]])

// export const selectOtherUsers = (state) => Object.keys({...state.user.others})


// export const selectOtherUsers = (state) => {
//     // return Object.getOwnPropertyNames(state.user.others)
//     return Object.keys(state.user.others)
// }

export default userSlice.reducer;