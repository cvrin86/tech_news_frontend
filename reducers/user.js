import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { isConnected: false, username: "" },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.isConnected = true;
      state.value.username = action.payload;
    },
    logout: (state, action) => {
      state.value.isConnected = false;
      state.value.username = "";
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
