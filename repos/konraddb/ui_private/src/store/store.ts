import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

import { bridgeReducer } from "@/features/BridgePage/store/bridge.store";
import { retireReducer } from "@/features/RetirePage/store/retire.store";
import { api } from "@/services/api";
import { graphApi, jasmineApi, neutralApi } from "@/services/extraApis";

import { authReducer } from "./auth/auth.store";
import { backdropsReducer } from "./backdrops/backdrops.store";
import { notificationsReducer } from "./notifications/notifications.store";
import { poolReducer } from "./pool/pool.store";
import { uiReducer } from "./ui/ui.store";
import { walletReducer } from "./wallet/wallet.store";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [jasmineApi.reducerPath]: jasmineApi.reducer,
  [graphApi.reducerPath]: graphApi.reducer,
  [neutralApi.reducerPath]: neutralApi.reducer,
  backdrops: backdropsReducer,
  ui: uiReducer,
  auth: authReducer,
  notifications: notificationsReducer,
  wallet: walletReducer,
  pool: poolReducer,
  retire: retireReducer,
  bridge: bridgeReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(
        api.middleware,
        jasmineApi.middleware,
        graphApi.middleware,
        neutralApi.middleware
      ),
  });

export const store = setupStore();
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
