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
  coef_w_1: 0,
  coef_h_1: 0,
  detectionImg2: "",
  coef_w_2: 0,
  coef_h_2: 0,
  detectionImg3: "",
  coef_w_3: 0,
  coef_h_3: 0,
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
          break
        case 2:
          state.camera2.id = action.payload.id;
          break
        case 3:
          state.camera3.id = action.payload.id;
      }
    },
    setDetectionImg(state, action: PayloadAction<{ cameraIndex: number; url: string }>) {
      switch (action.payload.cameraIndex) {
        case 1:
          state.detectionImg1 = action.payload.url;
          break
        case 2:
          state.detectionImg2 = action.payload.url;
          break
        case 3:
          state.detectionImg3 = action.payload.url;
      }
    },
    setWidthImgCoef(state, action: PayloadAction<{ cameraIndex: number; coef: number }>) {
      switch (action.payload.cameraIndex) {
        case 1:
          state.coef_w_1 = action.payload.coef;
          break
        case 2:
          state.coef_w_2 = action.payload.coef;
          break
        case 3:
          state.coef_w_3 = action.payload.coef;
      }
    },
    setHeightImgCoef(state, action: PayloadAction<{ cameraIndex: number; coef: number }>) {
      switch (action.payload.cameraIndex) {
        case 1:
          state.coef_h_1 = action.payload.coef;
          break
        case 2:
          state.coef_h_2 = action.payload.coef;
          break
        case 3:
          state.coef_h_3 = action.payload.coef;
      }
    },
    setDetectionPoints(state, action: PayloadAction<{ cameraIndex: number; points: IDetection }>) {
      switch (action.payload.cameraIndex) {
        case 1:
          state.camera1.detection = {
            A: {
              x: String(Math.round(parseInt(action.payload.points.A.x) * state.coef_w_1)),
              y: String(Math.round(parseInt(action.payload.points.A.y) * state.coef_h_1)),
            },
            B: {
              x: String(Math.round(parseInt(action.payload.points.B.x) * state.coef_w_1)),
              y: String(Math.round(parseInt(action.payload.points.B.y) * state.coef_h_1)),
            },
            C: {
              x: String(Math.round(parseInt(action.payload.points.C.x) * state.coef_w_1)),
              y: String(Math.round(parseInt(action.payload.points.C.y) * state.coef_h_1)),
            },
            D: {
              x: String(Math.round(parseInt(action.payload.points.D.x) * state.coef_w_1)),
              y: String(Math.round(parseInt(action.payload.points.D.y) * state.coef_h_1)),
            },
          };
          break
        case 2:
          state.camera2.detection = {
            A: {
              x: String(Math.round(parseInt(action.payload.points.A.x) * state.coef_w_2)),
              y: String(Math.round(parseInt(action.payload.points.A.y) * state.coef_h_2)),
            },
            B: {
              x: String(Math.round(parseInt(action.payload.points.B.x) * state.coef_w_2)),
              y: String(Math.round(parseInt(action.payload.points.B.y) * state.coef_h_2)),
            },
            C: {
              x: String(Math.round(parseInt(action.payload.points.C.x) * state.coef_w_2)),
              y: String(Math.round(parseInt(action.payload.points.C.y) * state.coef_h_2)),
            },
            D: {
              x: String(Math.round(parseInt(action.payload.points.D.x) * state.coef_w_2)),
              y: String(Math.round(parseInt(action.payload.points.D.y) * state.coef_h_2)),
            },
          };
          break
        case 3:
          state.camera3.detection = {
            A: {
              x: String(Math.round(parseInt(action.payload.points.A.x) * state.coef_w_3)),
              y: String(Math.round(parseInt(action.payload.points.A.y) * state.coef_h_3)),
            },
            B: {
              x: String(Math.round(parseInt(action.payload.points.B.x) * state.coef_w_3)),
              y: String(Math.round(parseInt(action.payload.points.B.y) * state.coef_h_3)),
            },
            C: {
              x: String(Math.round(parseInt(action.payload.points.C.x) * state.coef_w_3)),
              y: String(Math.round(parseInt(action.payload.points.C.y) * state.coef_h_3)),
            },
            D: {
              x: String(Math.round(parseInt(action.payload.points.D.x) * state.coef_w_3)),
              y: String(Math.round(parseInt(action.payload.points.D.y) * state.coef_h_3)),
            },
          };
      }
    },
  },
});

export default cameraSlice.reducer;
