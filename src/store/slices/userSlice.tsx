import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
  user: string;
  userId: string;
  username: string

}

const userInitialState: UserState = {
  isLoggedIn: false,
  user: "",
  username: "",
  userId: ""
};

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setLogin(state, action) {
      state.isLoggedIn = action.payload;
    },
    setLogout(state, action) {
      state.isLoggedIn = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    }
  },
});

export const { setLogin, setLogout, setUser, setUsername, setUserId } = userSlice.actions;

export default userSlice.reducer;
