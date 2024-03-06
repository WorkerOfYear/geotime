import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICamera, IInitialCameras } from "../../types/ICamera";


const initialState: IInitialCameras = {
  camera1: {
    id: null,
    data: {
      url: "",
      volume: "",
      sensitivity: "",
    },
    detection: {
      A: {
        x: "",
        y: "",
      },
      B: {
        x: "",
        y: "",
      },
      C: {
        x: "",
        y: "",
      },
      D: {
        x: "",
        y: "",
      },
    },
  },
  camera2: {
    id: null,
    data: {
      url: "",
      volume: "",
      sensitivity: "",
    },
    detection: {
      A: {
        x: "",
        y: "",
      },
      B: {
        x: "",
        y: "",
      },
      C: {
        x: "",
        y: "",
      },
      D: {
        x: "",
        y: "",
      },
    },
  },
  camera3: {
    id: null,
    data: {
      url: "",
      volume: "",
      sensitivity: "",
    },
    detection: {
      A: {
        x: "",
        y: "",
      },
      B: {
        x: "",
        y: "",
      },
      C: {
        x: "",
        y: "",
      },
      D: {
        x: "",
        y: "",
      },
    },
  },
};

export const cameraSlice = createSlice({
  name: "cameras",
  initialState,
  reducers: {
    setCamera1(state, action: PayloadAction<ICamera>) {
      state.camera1 = action.payload;
    },
    setCamera2(state, action: PayloadAction<ICamera>) {
      state.camera1 = action.payload;
    },
    setCamera3(state, action: PayloadAction<ICamera>) {
      state.camera1 = action.payload;
    },
  },
});

export default cameraSlice.reducer;
