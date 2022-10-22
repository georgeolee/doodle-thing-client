import { createSlice } from "@reduxjs/toolkit";

import { 
    LOCAL_INITIAL_USER_ID,
    LOCAL_INITIAL_USER_NAME,
 } from "../localStorage/localStorageSlice";

const initialState = {
    name: LOCAL_INITIAL_USER_NAME || 'user',
    connected: false,
    status: 'idle',
    id: LOCAL_INITIAL_USER_ID || null,

    others: {} //key other users by id
}

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
        },

        removeOtherUsersAll: (state) => {
            state.others = {}
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
    removeOtherUsersAll,

} = userSlice.actions;



export const selectOwnName = (state) =>  state.user.name;
export const selectOwnConnected = (state) =>  state.user.connected;
export const selectOwnStatus = (state) =>  state.user.status;
export const selectOwnId = (state) =>  state.user.id;

export const selectOwnUser = (state) => {
    return {
        name: selectOwnName(state),
        status: selectOwnStatus(state),
        id: selectOwnId(state),
    }   
}

export const selectOtherUsers = (state) => Object.keys(state.user.others).map(id => [id, state.user.others[id]])

export const selectOtherUsersObj = state => Object.keys(state.user.others).reduce((map, key) => {
    map[key] = {...state.user.others[key]}
    return map;
}, {})

// export const selectOtherUsersObj = state => Object.keys(state.user.others)

export default userSlice.reducer;