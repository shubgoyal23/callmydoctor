import { createSlice } from "@reduxjs/toolkit";

interface UserState {
   loggedIn: boolean;
   user: any;
}

const initialState: UserState = {
   loggedIn: true,
   user: null,
};

export const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      login: (state, payload) => {
         state.loggedIn = true;
         state.user = payload.payload;
      },
      logout: (state) => {
         state.loggedIn = false;
         state.user = null;
      },
   },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
