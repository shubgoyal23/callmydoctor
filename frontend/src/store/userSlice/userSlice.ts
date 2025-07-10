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
      updateDoctorDetails: (state, action) => {
         state.user.details = action.payload;
      },
   },
});

export const { login, logout, updateDoctorDetails } = userSlice.actions;

export default userSlice.reducer;
