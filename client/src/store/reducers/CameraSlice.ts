import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICamera, IDetection, IInitialCameras } from "../../types/ICamera";

function generate_initial_camera_data(): ICamera {
  return {
    id: null,
    type: [],
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
  };
}

const initialState: IInitialCameras = {
  detectionProcess: false,
  detectionProcessId: null,
  camera1: generate_initial_camera_data(),
  camera2: generate_initial_camera_data(),
  camera3: generate_initial_camera_data(),
  detectionImg1: "",
  detectionImg2: "",
  detectionImg3: "",
};

export const cameraSlice = createSlice({
  name: "cameras",
  initialState,
  reducers: {
    setDetectionProcess(state, action: PayloadAction<boolean>) {
      state.detectionProcess = action.payload;
    },
    setDetectionProcessId(state, action: PayloadAction<string | null>) {
      state.detectionProcessId = action.payload;
    },
    setCamera1(state, action: PayloadAction<ICamera>) {
      state.camera1 = action.payload;
    },
    setCamera2(state, action: PayloadAction<ICamera>) {
      state.camera1 = action.payload;
    },
    setCamera3(state, action: PayloadAction<ICamera>) {
      state.camera1 = action.payload;
    },
    setCameraId(state, action: PayloadAction<{ cameraIndex: number; id: string }>) {
      switch (action.payload.cameraIndex) {
        case 1:
          state.camera1.id = action.payload.id;
        case 2:
          state.camera2.id = action.payload.id;
        case 3:
          state.camera3.id = action.payload.id;
      }
    },
    setDetectionImg(state, action: PayloadAction<{ cameraIndex: number; url: string }>) {
      switch (action.payload.cameraIndex) {
        case 1:
          state.detectionImg1 = action.payload.url;
        case 2:
          state.detectionImg2 = action.payload.url;
        case 3:
          state.detectionImg3 = action.payload.url;
      }
    },
    setDetectionPoints(state, action: PayloadAction<{ cameraIndex: number; points: IDetection }>) {
      switch (action.payload.cameraIndex) {
        case 1:
          state.camera1.detection = action.payload.points;
        case 2:
          state.camera2.detection = action.payload.points;
        case 3:
          state.camera3.detection = action.payload.points;
      }
    },
  },
});

export default cameraSlice.reducer;
