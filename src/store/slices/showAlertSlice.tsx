import { createSlice } from "@reduxjs/toolkit";

interface showAlertState {
  showAlertState: boolean;
}

const showAlertInitialState: showAlertState = {
  showAlertState: false,
};

const showAlertSlice = createSlice({
  name: "showAlert",
  initialState: showAlertInitialState,
  reducers: {
    setShowAlert: (state, action) => {
      state.showAlertState = action.payload;
    },
  },
});

export const { setShowAlert } = showAlertSlice.actions;

export default showAlertSlice.reducer;
