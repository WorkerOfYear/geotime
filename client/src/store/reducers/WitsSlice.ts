import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWits } from "../../types/IWits";

interface IInitialWits {
  initialised: boolean;
  stream: boolean;
  ws: WebSocket | null;
  data: IWits;
}

const initialState: IInitialWits = {
  initialised: false,
  stream: false,
  ws: null,
  data: {
    host: "",
    port: "",
    depth: "",
    well_diam: "",
    lag_depth: "",
  },
};

export const witsSlice = createSlice({
  name: "wits",
  initialState,
  reducers: {
    setInitialised(state, action: PayloadAction<boolean>) {
      state.initialised = action.payload;
    },
    setStream(state, action: PayloadAction<boolean>) {
      state.stream = action.payload;
    },
    setWebsocket(state, action: PayloadAction<WebSocket | null | any>) {
      state.ws = action.payload;
    },
    setWits(state, action: PayloadAction<IWits>) {
      state.data.host = action.payload.host;
      state.data.port = action.payload.port;
      state.data.depth = action.payload.depth;
      state.data.well_diam = action.payload.well_diam;
      state.data.lag_depth = action.payload.lag_depth;
    },
  },
});

export default witsSlice.reducer;
