import { combineReducers, configureStore } from "@reduxjs/toolkit";
import jobReducer from "./reducers/JobSlice";
import cameraReducer from "./reducers/CameraSlice";
import witsReducer from "./reducers/WitsSlice";
import { reportApi } from "../services/ReportService";


const rootReducer = combineReducers({
  jobReducer,
  cameraReducer,
  witsReducer,
  [reportApi.reducerPath]: reportApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(reportApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
