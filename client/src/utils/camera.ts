import { cameraSlice } from "../store/reducers/CameraSlice";
import { jobSlice } from "../store/reducers/JobSlice";
import { IDetection, IInitialCameras } from "../types/ICamera";

export default function chooseCamera(id: string | undefined, reducer: IInitialCameras) {
  if (id === "1") {
    return {
      name: "camera1",
      errorText: "Видео с камеры 1",
      action: {
        setCamera: cameraSlice.actions.setCamera1,
        setCameraId: jobSlice.actions.setCamera1Id,
      },
      ...reducer.camera1,
    };
  } else if (id === "2") {
    return {
      name: "camera2",
      errorText: "Видео с камеры 2",
      action: {
        setCamera: cameraSlice.actions.setCamera2,
        setCameraId: jobSlice.actions.setCamera2Id,
      },
      ...reducer.camera2,
    };
  } else if (id === "3") {
    return {
      name: "camera3",
      errorText: "Видео с камеры 3",
      action: {
        setCamera: cameraSlice.actions.setCamera3,
        setCameraId: jobSlice.actions.setCamera3Id,
      },
      ...reducer.camera3,
    };
  } else return null;
}

export const createArrayFromDetection = (detection: IDetection, coefHeight: number, coefWidth: number) => {
  return [
    [parseInt(detection.A.x) / coefWidth, parseInt(detection.A.y) / coefHeight],
    [parseInt(detection.B.x) / coefWidth, parseInt(detection.B.y) / coefHeight],
    [parseInt(detection.C.x) / coefWidth, parseInt(detection.C.y) / coefHeight],
    [parseInt(detection.D.x) / coefWidth, parseInt(detection.D.y) / coefHeight],
  ];
};

export const getInitialDetectionById = (cameraId: number, cameraReducer: IInitialCameras) => {
  switch (cameraId) {
    case 1:
      return cameraReducer.camera1.detection;
    case 2:
      return cameraReducer.camera2.detection;
    case 3:
      return cameraReducer.camera3.detection;
  }
  return null;
};

export const getInitialProductIdByCameraId = (cameraId: number, cameraReducer: IInitialCameras) => {
  switch (cameraId) {
    case 1:
      return cameraReducer.camera1.id;
    case 2:
      return cameraReducer.camera2.id;
    case 3:
      return cameraReducer.camera3.id;
  }
  return null;
};

export function checkNestedObject(obj: any) {
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      for (let nestedKey in obj[key]) {
        if (obj[key][nestedKey] === "") {
          return false;
        }
      }
    } else {
      if (obj[key] === "") {
        return false;
      }
    }
  }
  return true;
}
