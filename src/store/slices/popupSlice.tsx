import { createSlice } from "@reduxjs/toolkit";

interface PopupState {
  popupState: boolean;
}

const popupInitialState: PopupState = {
  popupState: false,
};

const popupSlice = createSlice({
  name: "popup",
  initialState: popupInitialState,
  reducers: {
    setPopupHeader: (state, action) => {
      state.popupState = action.payload;
    },
  },
});

export const { setPopupHeader } = popupSlice.actions;

export default popupSlice.reducer;
