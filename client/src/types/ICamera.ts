interface ICoords {
  x: string;
  y: string;
}

interface IDetection {
  A: ICoords;
  B: ICoords;
  C: ICoords;
  D: ICoords;
}

interface IData {
  url: string;
  volume: string;
  sensitivity: string;
}

export interface ICamera {
  id: string | null;
  data: IData;
  detection: IDetection;
}

export interface IInitialCameras {
  camera1: ICamera;
  camera2: ICamera;
  camera3: ICamera;
}
