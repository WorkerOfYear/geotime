interface ICoords {
  x: string;
  y: string;
}

export interface IDetection {
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
  type: Array<"calibration" | "streaming">;
  data: IData;
  detection: IDetection;
}

export interface IInitialCameras {
  detectionProcess: boolean;
  detectionProcessId: string | null;
  camera1: ICamera;
  camera2: ICamera;
  camera3: ICamera;
  detectionImg1: string;
  detectionImg2: string;
  detectionImg3: string;
}
