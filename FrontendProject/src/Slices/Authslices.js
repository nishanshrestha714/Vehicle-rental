import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  userInfo: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const userInfo = action.payload;
      state.userInfo = userInfo;
      localStorage.setItem("user", JSON.stringify(state.userInfo));
    },
    clearCredentials: (state, action) => {
      ((state.userInfo = null), localStorage.removeItem("user"));
    },
  },
});

export const { setCredentials, clearCredentials } = AuthSlice.actions;
export default AuthSlice.reducer;
