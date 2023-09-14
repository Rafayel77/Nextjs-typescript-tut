import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import popupReducer from "./slices/popupSlice";
import votingReducer from "./slices/votingSlice";
import showAlertReducer from "./slices/showAlertSlice";
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
  popup: popupReducer,
  voting: votingReducer,
  showAlert: showAlertReducer,
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["voting", "showAlert"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
