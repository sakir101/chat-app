import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


type IUserRole = 'user' | 'admin'
export type IUser = {
    _id: string;
    fullName: string;
    role: IUserRole;
    email: string;
};

interface IChat {
    selectedUser: IUser | null;
    messages: any[];
}

const initialState: IChat = {
    selectedUser: null,
    messages: [],
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedUser: (state, action: PayloadAction<IUser | null>) => {
            state.selectedUser = action.payload;
        },

        setMessages: (state, action: PayloadAction<any[]>) => {
            state.messages = action.payload;
        },
    },
});

export const { setSelectedUser, setMessages } = chatSlice.actions;

export default chatSlice.reducer;
