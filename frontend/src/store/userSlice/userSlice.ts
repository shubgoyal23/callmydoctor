import { createSlice } from "@reduxjs/toolkit";

interface UserState {
   loggedIn: boolean;
   isDoctor: boolean;
   user: any;
}

const initialState: UserState = {
   loggedIn: false,
   isDoctor: false,
   user: null,
};

export const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      login: (state, action) => {
         state.loggedIn = true;
         state.isDoctor = action.payload.role === "doctor";
         state.user = action.payload;
      },
      logout: (state) => {
         state.loggedIn = false;
         state.user = null;
      },
   },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
